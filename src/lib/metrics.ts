import { prisma } from "@/lib/prisma";

export interface VelocityResult {
    velocity: number;
    components: {
        accuracyScore: number;
        difficultyScore: number;
        timeEfficiency: number;
        improvement: number;
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

    // 2. Accuracy Component (35%)
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

    // 4. Time Efficiency (20%)
    // Compare LatihanSession.averageTimePerQ against global constant
    const avgTime = session.averageTimePerQ ?? 0;
    const targetTime = TIME_CONSTANTS[category] || TIME_CONSTANTS["DEFAULT"];

    // Efficiency = 1 - (Actual / Target). 
    // If Actual < Target, Eff > 0. If Actual > Target, Eff < 0 (clamped to 0).
    // Actually, standard formula often: Target / Actual (capped at 1).
    // Request says "Compare...". Using standardized efficiency logic:
    // Let's use: max(0, 1 - (avgTime - targetTime) / targetTime)? No.
    // Standard: if avgTime <= targetTime, score 1.
    // If avgTime > targetTime, score decays.
    let timeEfficiencyComp = 0;
    if (avgTime > 0) {
        // If they are faster than target, efficiency is 1. 
        // If they connect 2x target, efficiency is 0.
        const ratio = avgTime / targetTime;
        if (ratio <= 1) timeEfficiencyComp = 1;
        else timeEfficiencyComp = Math.max(0, 2 - ratio); // Linear decay, 0 at 2x time
    }

    // 5. Improvement (20%)
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

        // Improvement delta (normalized).
        // If current is 80, avg is 70, delta 10.
        // If current 70, avg 80, delta -10.
        // We want a 0-1 score.
        // Let's baseline at 0.5 for no change? Or only reward positive?
        // "Improvement" implies positive change.
        const delta = accuracyRaw - avgPrev;
        // Map delta (-20 to +20 range typically) to 0-1.
        // Let's say +20% improvement is max score (1.0). 0% is 0.
        // improvementComp = Math.max(0, Math.min(1, delta / 20));

        // Alternative: Simple ratio Current / Avg?
        // Let's stick to positive delta rewarding.
        if (delta > 0) {
            improvementComp = Math.min(1, delta / 20); // Cap at 1 for big jumps
        }
    } else {
        improvementComp = 0.5; // Neutral start for new user
    }

    // Weighted Formula
    // Velocity = (Acc * 0.35) + (Diff/5 * 0.25) + (TimeEff * 0.20) + (Imp * 0.20)
    const velocity =
        (accuracyComp * 0.35) +
        (difficultyComp * 0.25) +
        (timeEfficiencyComp * 0.20) +
        (improvementComp * 0.20);

    return {
        velocity: parseFloat((velocity * 100).toFixed(1)), // Scale to 0-100
        components: {
            accuracyScore: accuracyComp,
            difficultyScore: difficultyComp,
            timeEfficiency: timeEfficiencyComp,
            improvement: improvementComp
        }
    };
}
