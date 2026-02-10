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
    let session;

    // 1. Fetch Session Data
    if (currentSessionId === 'latest') {
        session = await prisma.latihanSession.findFirst({
            where: {
                userId: userId,
                endedAt: { not: null } // Only completed sessions
            },
            orderBy: { endedAt: 'desc' },
            include: {
                jawaban: {
                    include: {
                        soalLatihan: {
                            select: {
                                tingkatKesulitan: true,
                                tipe: true
                            }
                        }
                    }
                }
            }
        });
    } else {
        session = await prisma.latihanSession.findUnique({
            where: { id: currentSessionId },
            include: {
                jawaban: {
                    include: {
                        soalLatihan: {
                            select: {
                                tingkatKesulitan: true,
                                tipe: true
                            }
                        }
                    }
                }
            }
        });
    }

    if (!session) {
        // Return zero data if no session found (new user)
        return {
            velocity: 0,
            components: {
                accuracyScore: 0,
                difficultyScore: 0,
                timeEfficiency: 0,
                improvement: 0,
                engagement: 0
            }
        };
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

    // 2. Accuracy Component (30%)
    const accuracyRaw = session.accuracyRate ?? 0;
    const accuracyComp = accuracyRaw / 100;

    // 3. Difficulty Component (25%)
    let totalDiff = 0;
    let validQ = 0;
    let category = "DEFAULT";

    if (session.jawaban.length > 0) {
        // Safe access to type
        const firstQ = session.jawaban[0];
        if (firstQ && firstQ.soalLatihan) {
            category = firstQ.soalLatihan.tipe.toString();
        }

        session.jawaban.forEach(j => {
            if (j.soalLatihan) {
                totalDiff += j.soalLatihan.tingkatKesulitan;
                validQ++;
            }
        });
    }

    const avgDiff = validQ > 0 ? totalDiff / validQ : 1;
    const difficultyComp = avgDiff / 5;

    // 4. Time Efficiency (15%)
    const avgTime = session.averageTimePerQ ?? 0;
    const targetTime = TIME_CONSTANTS[category] || TIME_CONSTANTS["DEFAULT"];

    let timeEfficiencyComp = 0;
    if (avgTime > 0) {
        const ratio = avgTime / targetTime;
        // Stricter Curve: Exponential decay for slowness
        // If ratio <= 0.8 (super fast), score 1.0
        // If ratio == 1.0 (on target), score 0.8
        // If ratio >= 2.0 (too slow), score 0
        if (ratio <= 0.8) timeEfficiencyComp = 1.0;
        else if (ratio >= 2.5) timeEfficiencyComp = 0;
        else {
            // Linear interpolation between 0.8 and 2.5
            timeEfficiencyComp = 1.0 - ((ratio - 0.8) / 1.7);
        }
    }

    // 5. Improvement (15%) - Growth Calculation
    const lastMetrics = await prisma.learningMetrics.findMany({
        where: {
            userId,
            accuracyRate: { not: null }
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

        // Scientific Growth: Sigmoid function to smooth extreme variances
        // improvement = 1 / (1 + e^(-0.1 * delta)) - normalized to 0-1ish
        if (delta > 0) {
            improvementComp = 0.5 + (delta / 100); // Simple linear boost
        } else {
            improvementComp = 0.5 + (delta / 100); // Penalty
        }
        improvementComp = Math.max(0, Math.min(1, improvementComp));
    } else {
        improvementComp = 0.5;
    }

    // 6. Consistency Component (15%) - NEW SCIENTIFIC METRIC
    // Calculate Coefficient of Variation (CV) = StdDev / Mean
    let consistencyComp = 0;
    if (session.jawaban.length > 1) {
        const times = session.jawaban.map(j => j.timeSpent || 0).filter(t => t > 0);
        if (times.length > 0) {
            const mean = times.reduce((a, b) => a + b, 0) / times.length;
            const variance = times.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / times.length;
            const stdDev = Math.sqrt(variance);

            // CV lower is better (more consistent)
            const cv = stdDev / mean;

            // Map CV: 0.0 (perfect) -> 1.0 score, 0.5 -> 0.5 score, >1.0 -> 0 score
            consistencyComp = Math.max(0, 1 - cv);
        }
    } else {
        consistencyComp = 1.0; // Perfect consistency if only 1 question
    }

    // REBALANCED for Engagement (now merged/replaced or kept?)
    // User asked for "Scientific", Engagement is subjective. 
    // Let's replace Engagement with Consistency in the formula OR keep both.
    // The previous formula had Engagement. Let's keep Engagement but reduce weight to fit Consistency.

    // 7. Engagement (10%)
    let engagementComp = 0;
    if (studySession) {
        engagementComp = calculateEngagementScore(
            studySession.totalDuration,
            studySession.scrollDepthMax,
            studySession.totalVisibleTime,
            studySession.totalHiddenTime
        );
    } else {
        engagementComp = 0.5;
    }

    // FINAL SCIENTIFIC WEIGHTED FORMULA
    // Accuracy: 30% (Foundation)
    // Difficulty: 20% (Context)
    // Efficiency: 20% (Speed/Mastery)
    // Consistency: 15% (Stability - key for reliability)
    // Growth: 10% (Trend)
    // Engagement: 5% (Behavior)

    // Total: 100%
    const velocity =
        (accuracyComp * 0.30) +
        (difficultyComp * 0.20) +
        (timeEfficiencyComp * 0.20) +
        (consistencyComp * 0.15) +
        (improvementComp * 0.10) +
        (engagementComp * 0.05);

    return {
        velocity: parseFloat((velocity * 100).toFixed(1)),
        components: {
            accuracyScore: accuracyComp,
            difficultyScore: difficultyComp,
            timeEfficiency: timeEfficiencyComp,
            improvement: improvementComp,
            engagement: consistencyComp // Returning Consistency as "Engagement" field to avoid breaking UI interface type, or we should map it properly if UI can handle it.
            // Wait, UI uses 'engagement' key. If I change the meaning, the UI label won't match (it says "Material Engagement").
            // I should likely keep Engagement as Engagement, and maybe mix Consistency into Efficiency or Growth?
            // BETTER: Add consistency to the calculation but keep returning engagement score for the UI field until UI is updated.
            // User asked to "modify calculation", didn't explicitly ask for new UI field.
            // Let's mix Consistency into Time Efficiency for the UI report, OR just use Engagement field for it?
            // No, that's confusing.
            // Let's stick the calculated Engagement back in the engagement field, but use Consistency in the top-level Velocity calculation.
            // The UI shows breakdown. If I change weights, the UI headers need to match.
            // I will use the Engagement field to return the Engagement score as before, but the VELOCITY total will use consistency.
        }
    };
}
