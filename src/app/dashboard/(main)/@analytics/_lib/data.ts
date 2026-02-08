"use server";

import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import type {
    OverviewStats,
    DailyActivity,
    SubjectPerformance,
    RecentSession,
    StudyTimeDistribution,
    AnalyticsData,
} from "../_types/analytics";

const KATEGORI_LABELS: Record<string, string> = {
    PU: "Penalaran Umum",
    PK: "Pengetahuan Kuantitatif",
    PPU: "Pengetahuan & Pemahaman Umum",
    PBM: "Pemahaman Bacaan & Menulis",
    LITERASIBINDO: "Literasi Bahasa Indonesia",
    LITERASIBINGG: "Literasi Bahasa Inggris",
};

async function getUserId(): Promise<string | null> {
    const session = await getServerSession(authOptions);
    return session?.user?.id ?? null;
}

// OVERVIEW STATS

export async function getOverviewStats(): Promise<OverviewStats> {
    const userId = await getUserId();
    if (!userId) {
        return {
            totalSessions: 0,
            totalQuestionsAnswered: 0,
            overallAccuracy: 0,
            totalStudyMinutes: 0,
            currentStreak: 0,
            bestStreak: 0,
            avgSessionDuration: 0,
            improvementRate: 0,
        };
    }

    const now = new Date();
    const sevenDaysAgo = new Date(now);
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const fourteenDaysAgo = new Date(now);
    fourteenDaysAgo.setDate(fourteenDaysAgo.getDate() - 14);

    // Fetch completed latihan sessions (endedAt is not null = completed)
    const latihanSessions = await prisma.latihanSession.findMany({
        where: {
            userId,
            endedAt: { not: null },
        },
        select: {
            id: true,
            startedAt: true,
            totalDuration: true,
        },
    });

    // Fetch all jawaban for this user
    const allJawaban = await prisma.latihanJawabanUser.findMany({
        where: {
            session: { userId },
            isSkipped: false,
        },
        select: {
            isCorrect: true,
            session: {
                select: { startedAt: true },
            },
        },
    });

    // Fetch study sessions for materi reading time
    const studySessions = await prisma.studySession.findMany({
        where: { userId },
        select: {
            id: true,
            startedAt: true,
            totalDuration: true,
        },
    });

    // === Total sessions = latihan + study ===
    const totalSessions = latihanSessions.length + studySessions.length;

    // === Basic stats ===
    const totalQuestionsAnswered = allJawaban.length;
    const correctAnswers = allJawaban.filter((j) => j.isCorrect).length;
    const overallAccuracy =
        totalQuestionsAnswered > 0
            ? (correctAnswers / totalQuestionsAnswered) * 100
            : 0;

    // Total study time (latihan + materi)
    const latihanSeconds = latihanSessions.reduce(
        (sum, s) => sum + (s.totalDuration ?? 0),
        0
    );
    const materiSeconds = studySessions.reduce(
        (sum, s) => sum + (s.totalDuration ?? 0),
        0
    );
    const totalStudyMinutes = (latihanSeconds + materiSeconds) / 60;

    // Avg session duration (across ALL sessions)
    const avgSessionDuration =
        totalSessions > 0 ? totalStudyMinutes / totalSessions : 0;

    // === Streak ===
    const allActivityDates = new Set<string>();
    latihanSessions.forEach((s) =>
        allActivityDates.add(formatDateStr(s.startedAt))
    );
    studySessions.forEach((s) =>
        allActivityDates.add(formatDateStr(s.startedAt))
    );
    const { currentStreak, bestStreak } = calculateStreaks(
        Array.from(allActivityDates)
    );

    // === Improvement rate (current 7d vs previous 7d) ===
    const currentPeriodJawaban = allJawaban.filter(
        (j) => j.session.startedAt >= sevenDaysAgo
    );
    const previousPeriodJawaban = allJawaban.filter(
        (j) =>
            j.session.startedAt >= fourteenDaysAgo &&
            j.session.startedAt < sevenDaysAgo
    );

    const currentAccuracy =
        currentPeriodJawaban.length > 0
            ? (currentPeriodJawaban.filter((j) => j.isCorrect).length /
                  currentPeriodJawaban.length) *
              100
            : 0;
    const previousAccuracy =
        previousPeriodJawaban.length > 0
            ? (previousPeriodJawaban.filter((j) => j.isCorrect).length /
                  previousPeriodJawaban.length) *
              100
            : 0;

    const improvementRate =
        previousAccuracy > 0
            ? Number(
                  (
                      ((currentAccuracy - previousAccuracy) / previousAccuracy) *
                      100
                  ).toFixed(1)
              )
            : 0;

    return {
        totalSessions,
        totalQuestionsAnswered,
        overallAccuracy: Number(overallAccuracy.toFixed(1)),
        totalStudyMinutes: Math.round(totalStudyMinutes),
        currentStreak,
        bestStreak,
        avgSessionDuration: Number(avgSessionDuration.toFixed(1)),
        improvementRate,
    };
}

// DAILY ACTIVITY

export async function getDailyActivity(): Promise<DailyActivity[]> {
    const userId = await getUserId();
    if (!userId) return [];

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    // Latihan data
    const latihanSessions = await prisma.latihanSession.findMany({
        where: {
            userId,
            endedAt: { not: null },
            startedAt: { gte: thirtyDaysAgo },
        },
        select: {
            id: true,
            startedAt: true,
            totalDuration: true,
            jawaban: {
                where: { isSkipped: false },
                select: { isCorrect: true },
            },
        },
    });

    // Study sessions data
    const studySessions = await prisma.studySession.findMany({
        where: {
            userId,
            startedAt: { gte: thirtyDaysAgo },
        },
        select: {
            startedAt: true,
            totalDuration: true,
        },
    });

    // Build 30-day map
    const dayMap = new Map<
        string,
        {
            sessionsCount: number;
            questionsAnswered: number;
            correctAnswers: number;
            totalStudySeconds: number;
            latihanSeconds: number;
            materiSeconds: number;
            latihanSessions: number;
            materiSessions: number;
        }
    >();

    // Initialize all 30 days
    for (let i = 29; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        const key = formatDateStr(d);
        dayMap.set(key, {
            sessionsCount: 0,
            questionsAnswered: 0,
            correctAnswers: 0,
            totalStudySeconds: 0,
            latihanSeconds: 0,
            materiSeconds: 0,
            latihanSessions: 0,
            materiSessions: 0,
        });
    }

    // Fill latihan data
    latihanSessions.forEach((s) => {
        const key = formatDateStr(s.startedAt);
        const entry = dayMap.get(key);
        if (entry) {
            entry.sessionsCount++;
            entry.latihanSessions++;
            entry.questionsAnswered += s.jawaban.length;
            entry.correctAnswers += s.jawaban.filter(
                (j) => j.isCorrect
            ).length;
            const dur = s.totalDuration ?? 0;
            entry.totalStudySeconds += dur;
            entry.latihanSeconds += dur;
        }
    });

    // Fill study session data
    studySessions.forEach((s) => {
        const key = formatDateStr(s.startedAt);
        const entry = dayMap.get(key);
        if (entry) {
            entry.sessionsCount++;
            entry.materiSessions++;
            const dur = s.totalDuration ?? 0;
            entry.totalStudySeconds += dur;
            entry.materiSeconds += dur;
        }
    });

    return Array.from(dayMap.entries()).map(([date, data]) => ({
        date,
        sessionsCount: data.sessionsCount,
        questionsAnswered: data.questionsAnswered,
        correctAnswers: data.correctAnswers,
        totalStudyMinutes: Math.round(data.totalStudySeconds / 60),
        accuracy:
            data.questionsAnswered > 0
                ? Number(
                      (
                          (data.correctAnswers / data.questionsAnswered) *
                          100
                      ).toFixed(1)
                  )
                : 0,
        latihanMinutes: Number((data.latihanSeconds / 60).toFixed(1)),
        materiMinutes: Number((data.materiSeconds / 60).toFixed(1)),
        latihanSessions: data.latihanSessions,
        materiSessions: data.materiSessions,
    }));
}

// SUBJECT PERFORMANCE

export async function getSubjectPerformance(): Promise<SubjectPerformance[]> {
    const userId = await getUserId();
    if (!userId) return [];

    // Relation path: LatihanJawabanUser → session (LatihanSession)
    //                LatihanJawabanUser → soalLatihan (SoalLatihanSoal) → materi (Materi)
    const jawaban = await prisma.latihanJawabanUser.findMany({
        where: {
            session: { userId },
            isSkipped: false,
        },
        select: {
            isCorrect: true,
            timeSpent: true,
            soalLatihan: {
                select: {
                    materi: {
                        select: {
                            kategori: true,
                        },
                    },
                },
            },
            session: {
                select: { id: true },
            },
        },
    });

    // Group by kategori
    const kategoriMap = new Map<
        string,
        {
            total: number;
            correct: number;
            totalTime: number;
            sessionIds: Set<string>;
        }
    >();

    jawaban.forEach((j) => {
        const kategori = j.soalLatihan?.materi?.kategori;
        if (!kategori) return;

        if (!kategoriMap.has(kategori)) {
            kategoriMap.set(kategori, {
                total: 0,
                correct: 0,
                totalTime: 0,
                sessionIds: new Set(),
            });
        }

        const entry = kategoriMap.get(kategori)!;
        entry.total++;
        if (j.isCorrect) entry.correct++;
        entry.totalTime += j.timeSpent ?? 0;
        entry.sessionIds.add(j.session.id);
    });

    return Array.from(kategoriMap.entries())
        .map(([kategori, data]) => ({
            kategori,
            kategoriLabel: KATEGORI_LABELS[kategori] ?? kategori,
            totalQuestions: data.total,
            correctAnswers: data.correct,
            accuracy:
                data.total > 0
                    ? Number(((data.correct / data.total) * 100).toFixed(1))
                    : 0,
            avgTimePerQuestion:
                data.total > 0
                    ? Number((data.totalTime / data.total).toFixed(1))
                    : 0,
            sessionsCount: data.sessionIds.size,
        }))
        .sort((a, b) => b.totalQuestions - a.totalQuestions);
}

// RECENT SESSIONS

export async function getRecentSessions(
    limit: number = 10
): Promise<RecentSession[]> {
    const userId = await getUserId();
    if (!userId) return [];

    // LatihanSession does NOT have a direct @relation to Materi.
    // We get materi info through jawaban → soalLatihan → materi.
    // Also fetch materiId to use as a fallback lookup.
    const latihanSessions = await prisma.latihanSession.findMany({
        where: {
            userId,
            endedAt: { not: null },
        },
        select: {
            id: true,
            type: true,
            materiId: true,
            startedAt: true,
            score: true,
            totalDuration: true,
            accuracyRate: true,
            jawaban: {
                select: {
                    isCorrect: true,
                    soalLatihan: {
                        select: {
                            materi: {
                                select: {
                                    nama: true,
                                    kategori: true,
                                },
                            },
                        },
                    },
                },
                take: 1, // We only need one jawaban to get materi info
            },
        },
        orderBy: { startedAt: "desc" },
        take: limit,
    });

    // If materiId exists but jawaban is empty, look up materi separately
    const materiIds = latihanSessions
        .filter((s) => s.materiId && s.jawaban.length === 0)
        .map((s) => s.materiId!)
        .filter((id, i, arr) => arr.indexOf(id) === i);

    const materiLookup = materiIds.length > 0
        ? await prisma.materi.findMany({
            where: { id: { in: materiIds } },
            select: { id: true, nama: true, kategori: true },
        })
        : [];

    const materiMap = new Map(materiLookup.map((m) => [m.id, m]));

    // For total questions count per session, fetch counts
    const sessionIds = latihanSessions.map((s) => s.id);
    const jawabanCounts = await prisma.latihanJawabanUser.groupBy({
        by: ["sessionId"],
        where: {
            sessionId: { in: sessionIds },
            isSkipped: false,
        },
        _count: { id: true },
    });
    const correctCounts = await prisma.latihanJawabanUser.groupBy({
        by: ["sessionId"],
        where: {
            sessionId: { in: sessionIds },
            isSkipped: false,
            isCorrect: true,
        },
        _count: { id: true },
    });

    const totalCountMap = new Map(
        jawabanCounts.map((j) => [j.sessionId, j._count.id])
    );
    const correctCountMap = new Map(
        correctCounts.map((j) => [j.sessionId, j._count.id])
    );

    // Study sessions — has direct @relation to Materi
    const studySessions = await prisma.studySession.findMany({
        where: { userId },
        select: {
            id: true,
            startedAt: true,
            totalDuration: true,
            materi: {
                select: {
                    nama: true,
                    kategori: true,
                },
            },
        },
        orderBy: { startedAt: "desc" },
        take: limit,
    });

    const combined: RecentSession[] = [];

    // Map latihan
    latihanSessions.forEach((s) => {
        const totalQ = totalCountMap.get(s.id) ?? 0;
        const correctQ = correctCountMap.get(s.id) ?? 0;

        // Get materi info: first try from jawaban, then from materiId lookup
        const materiFromJawaban = s.jawaban[0]?.soalLatihan?.materi;
        const materiFromLookup = s.materiId ? materiMap.get(s.materiId) : null;
        const materiInfo = materiFromJawaban ?? materiFromLookup;

        combined.push({
            id: s.id,
            type: "LATIHAN",
            materiName: materiInfo?.nama ?? "Latihan Soal",
            kategori: materiInfo?.kategori ?? "",
            startedAt: s.startedAt.toISOString(),
            score: s.score,
            accuracy:
                totalQ > 0
                    ? Number(((correctQ / totalQ) * 100).toFixed(1))
                    : s.accuracyRate != null
                    ? Number(s.accuracyRate.toFixed(1))
                    : null,
            totalDuration: s.totalDuration,
            totalQuestions: totalQ,
        });
    });

    // Map study
    studySessions.forEach((s) => {
        combined.push({
            id: s.id,
            type: "STUDY",
            materiName: s.materi?.nama ?? "Unknown",
            kategori: s.materi?.kategori ?? "",
            startedAt: s.startedAt.toISOString(),
            score: null,
            accuracy: null,
            totalDuration: s.totalDuration,
            totalQuestions: 0,
        });
    });

    // Sort by date desc, take limit
    combined.sort(
        (a, b) =>
            new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime()
    );

    return combined.slice(0, limit);
}

// STUDY TIME DISTRIBUTION

export async function getStudyTimeDistribution(): Promise<
    StudyTimeDistribution[]
> {
    const userId = await getUserId();
    if (!userId) {
        return Array.from({ length: 24 }, (_, i) => ({
            hour: i,
            totalMinutes: 0,
            sessionsCount: 0,
        }));
    }

    // Latihan sessions
    const latihanSessions = await prisma.latihanSession.findMany({
        where: {
            userId,
            endedAt: { not: null },
        },
        select: {
            startedAt: true,
            totalDuration: true,
        },
    });

    // Study sessions
    const studySessions = await prisma.studySession.findMany({
        where: { userId },
        select: {
            startedAt: true,
            totalDuration: true,
        },
    });

    // Group by hour
    const hourMap = new Map<
        number,
        { totalSeconds: number; sessionsCount: number }
    >();

    for (let h = 0; h < 24; h++) {
        hourMap.set(h, { totalSeconds: 0, sessionsCount: 0 });
    }

    latihanSessions.forEach((s) => {
        const hour = s.startedAt.getHours();
        const entry = hourMap.get(hour)!;
        entry.totalSeconds += s.totalDuration ?? 0;
        entry.sessionsCount++;
    });

    studySessions.forEach((s) => {
        const hour = s.startedAt.getHours();
        const entry = hourMap.get(hour)!;
        entry.totalSeconds += s.totalDuration ?? 0;
        entry.sessionsCount++;
    });

    return Array.from(hourMap.entries()).map(([hour, data]) => ({
        hour,
        totalMinutes: Number((data.totalSeconds / 60).toFixed(1)),
        sessionsCount: data.sessionsCount,
    }));
}

// AGGREGATED

export async function getAnalyticsData(): Promise<AnalyticsData> {
    const [
        overview,
        dailyActivity,
        subjectPerformance,
        recentSessions,
        studyTimeDistribution,
    ] = await Promise.all([
        getOverviewStats(),
        getDailyActivity(),
        getSubjectPerformance(),
        getRecentSessions(),
        getStudyTimeDistribution(),
    ]);

    return {
        overview,
        dailyActivity,
        subjectPerformance,
        recentSessions,
        studyTimeDistribution,
    };
}

// HELPERS

function formatDateStr(date: Date): string {
    return date.toISOString().split("T")[0];
}

function calculateStreaks(dateStrings: string[]): {
    currentStreak: number;
    bestStreak: number;
} {
    if (dateStrings.length === 0) return { currentStreak: 0, bestStreak: 0 };

    const uniqueDates = [...new Set(dateStrings)].sort((a, b) =>
        b.localeCompare(a)
    );

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayStr = formatDateStr(today);

    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = formatDateStr(yesterday);

    // Current streak
    let currentStreak = 0;
    const mostRecent = uniqueDates[0];

    if (mostRecent === todayStr || mostRecent === yesterdayStr) {
        currentStreak = 1;
        for (let i = 1; i < uniqueDates.length; i++) {
            const prevDate = new Date(uniqueDates[i - 1]);
            const currDate = new Date(uniqueDates[i]);
            const diffMs = prevDate.getTime() - currDate.getTime();
            const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));

            if (diffDays === 1) {
                currentStreak++;
            } else {
                break;
            }
        }
    }

    // Best streak
    let bestStreak = uniqueDates.length > 0 ? 1 : 0;
    let tempStreak = 1;
    for (let i = 1; i < uniqueDates.length; i++) {
        const prevDate = new Date(uniqueDates[i - 1]);
        const currDate = new Date(uniqueDates[i]);
        const diffMs = prevDate.getTime() - currDate.getTime();
        const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));

        if (diffDays === 1) {
            tempStreak++;
            bestStreak = Math.max(bestStreak, tempStreak);
        } else {
            tempStreak = 1;
        }
    }

    return { currentStreak, bestStreak };
}