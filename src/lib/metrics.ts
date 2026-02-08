import { prisma } from "@/lib/prisma";

export interface VelocityResult {
    velocity: number;
    components: {
        accuracyScore: number;
        difficultyScore: number;
        timeEfficiency: number;
        improvement: number;
        engagement: number; // NEW: Material reading engagement
    };
}

// Time constants per category (in seconds)
const TIME_CONSTANTS: Record<string, number> = {
    PU: 60,
    PBM: 60,
    PPU: 60,
    PK: 90,
    LITERASIBINDO: 60,
    LITERASIBINGG: 60,
    DEFAULT: 60
};

// Helper function to calculate engagement score from StudySession data
function calculateEngagementScore(
    totalDuration: number,
    scrollDepthMax: number,
    totalVisibleTime: number,
    totalHiddenTime: number
): number {
    // Target reading time constants
    const MIN_READING_TIME = 180;  // 3 minutes minimum
    const TARGET_READING_TIME = 600; // 10 minutes optimal

    // 1. Reading Time Score (40%)
    // Reward time spent, but cap at target to avoid gaming
    let readingTimeScore = 0;
    if (totalDuration >= TARGET_READING_TIME) {
        readingTimeScore = 1.0;
    } else if (totalDuration >= MIN_READING_TIME) {
        readingTimeScore = (totalDuration - MIN_READING_TIME) / (TARGET_READING_TIME - MIN_READING_TIME);
    }

    // 2. Scroll Depth Score (30%)
    // Normalize 0-100 to 0-1, bonus if reached 90%+
    const scrollScore = Math.min(1.0, scrollDepthMax / 90);

    // 3. Focus Quality Score (30%)
    // Ratio of visible time vs total time
    const totalTime = totalVisibleTime + totalHiddenTime;
    const focusScore = totalTime > 0 ? totalVisibleTime / totalTime : 0;

    // Weighted combination
    return (readingTimeScore * 0.4) + (scrollScore * 0.3) + (focusScore * 0.3);
}

export async function calculateLearningVelocity(
    userId: string,
    currentSessionId: string
): Promise<VelocityResult> {
    // 1. Fetch Session Data
    const session = await prisma.latihanSession.findUnique({
        where: { id: currentSessionId },
        include: {
            jawaban: {
                include: {
                    soalLatihan: {
                        select: {
                            tingkatKesulitan: true,
                            tipe: true // to identify category for time constant
                        }
                    }
                }
            }
        }
    });

    if (!session) {
        throw new Error("Session not found");
    }

    // Fetch most recent completed StudySession for this material
    const studySession = await prisma.studySession.findFirst({
        where: {
            userId,
            materiId: session.materiId || undefined,
            isCompleted: true
        },
        orderBy: { endedAt: 'desc' }
    });

    // 2. Accuracy Component (30% - adjusted from 35%)
    // Pull from LatihanSession.accuracyRate (percentage 0-100) -> convert to 0-1
    const accuracyRaw = session.accuracyRate ?? 0;
    const accuracyComp = accuracyRaw / 100;

    // 3. Difficulty Component (25%)
    // Map from soalLatihanSoal.tingkatKesulitan (1-5)
    // Calculate average difficulty of questions in this session
    let totalDiff = 0;
    let validQ = 0;
    let category = "DEFAULT";

    if (session.jawaban.length > 0) {
        category = session.jawaban[0].soalLatihan.tipe.toString(); // Assume uniform category per session usually
        session.jawaban.forEach(j => {
            totalDiff += j.soalLatihan.tingkatKesulitan;
            validQ++;
        });
    }

    const avgDiff = validQ > 0 ? totalDiff / validQ : 1; // Default to 1 if no Qs
    const difficultyComp = avgDiff / 5; // Normalize 1-5 to 0.2-1.0 (approx)

    // 4. Time Efficiency (15% - adjusted from 20%)
    // Compare LatihanSession.averageTimePerQ against global constant
    const avgTime = session.averageTimePerQ ?? 0;
    const targetTime = TIME_CONSTANTS[category] || TIME_CONSTANTS["DEFAULT"];

    let timeEfficiencyComp = 0;
    if (avgTime > 0) {
        const ratio = avgTime / targetTime;
        if (ratio <= 1) timeEfficiencyComp = 1;
        else timeEfficiencyComp = Math.max(0, 2 - ratio); // Linear decay, 0 at 2x time
    }

    // 5. Improvement (15% - adjusted from 20%)
    // Compare current accuracyRate vs avg accuracyRate from last 5 LearningMetrics (cross-materi)
    const lastMetrics = await prisma.learningMetrics.findMany({
        where: {
            userId,
            accuracyRate: { not: null } // Only entries with accuracy data
        },
        orderBy: { date: "desc" },
        take: 5,
        select: { accuracyRate: true }
    });

    let improvementComp = 0;
    if (lastMetrics.length > 0) {
        const sumPrev = lastMetrics.reduce((acc, m) => acc + (m.accuracyRate ?? 0), 0);
        const avgPrev = sumPrev / lastMetrics.length;

        const delta = accuracyRaw - avgPrev;
        if (delta > 0) {
            improvementComp = Math.min(1, delta / 20); // Cap at 1 for big jumps
        }
    } else {
        improvementComp = 0.5; // Neutral start for new user
    }

    // 6. Engagement Component (15%) - NEW
    // Based on material reading behavior from StudySession
    let engagementComp = 0;
    if (studySession) {
        engagementComp = calculateEngagementScore(
            studySession.totalDuration,
            studySession.scrollDepthMax,
            studySession.totalVisibleTime,
            studySession.totalHiddenTime
        );
    } else {
        // No study session found - neutral score
        engagementComp = 0.5;
    }

    // Weighted Formula (5 components)
    // Velocity = (Acc * 30%) + (Diff * 25%) + (TimeEff * 15%) + (Imp * 15%) + (Engagement * 15%)
    const velocity =
        (accuracyComp * 0.30) +
        (difficultyComp * 0.25) +
        (timeEfficiencyComp * 0.15) +
        (improvementComp * 0.15) +
        (engagementComp * 0.15);

    return {
        velocity: parseFloat((velocity * 100).toFixed(1)), // Scale to 0-100
        components: {
            accuracyScore: accuracyComp,
            difficultyScore: difficultyComp,
            timeEfficiency: timeEfficiencyComp,
            improvement: improvementComp,
            engagement: engagementComp // NEW
        }
    };
}
