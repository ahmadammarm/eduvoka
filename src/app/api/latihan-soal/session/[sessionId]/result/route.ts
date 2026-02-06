import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
	req: NextRequest,
	{ params }: { params: Promise<{ sessionId: string }> }
) {
	try {
		const session = await auth();
		if (!session?.user) {
			return NextResponse.json(
				{ error: "Unauthorized" },
				{ status: 401 }
			);
		}

		const { sessionId } = await params;

		const latihanSession = await prisma.latihanSession.findFirst({
			where: {
				id: sessionId,
				userId: session.user.id
			},
			include: {
				jawaban: {
					include: {
						soalLatihan: {
							select: {
								id: true,
								content: true,
								kunciJawaban: true,
								tingkatKesulitan: true
							}
						},
						pilihanJawaban: {
							select: {
								id: true,
								label: true,
								pilihan: true
							}
						}
					}
				},
				user: {
					select: {
						id: true,
						name: true,
						email: true
					}
				}
			}
		});

		if (!latihanSession) {
			return NextResponse.json(
				{ error: 'Session not found' },
				{ status: 404 }
			);
		}

		const totalAnswered = latihanSession.jawaban.length;
		const answeredQuestions = latihanSession.jawaban.filter(j => !j.isSkipped).length;
		const skippedQuestions = latihanSession.jawaban.filter(j => j.isSkipped).length;
		const correctAnswers = latihanSession.jawaban.filter(j => j.isCorrect === true).length;
		const wrongAnswers = answeredQuestions - correctAnswers;

		let totalSoalCount = totalAnswered;
		if (latihanSession.materiId) {
			totalSoalCount = await prisma.soalLatihanSoal.count({
				where: {
					materiId: latihanSession.materiId,
					tipeSesi: latihanSession.type
				}
			});
		}

		const totalQuestions = totalSoalCount > 0 ? totalSoalCount : totalAnswered;

		const difficultyStats = latihanSession.jawaban.reduce((acc, jawaban) => {
			const difficulty = jawaban.soalLatihan.tingkatKesulitan;
			if (!acc[difficulty]) {
				acc[difficulty] = { total: 0, correct: 0 };
			}
			acc[difficulty].total++;
			if (jawaban.isCorrect) {
				acc[difficulty].correct++;
			}
			return acc;
		}, {} as Record<number, { total: number; correct: number }>);

		const sessionDuration = latihanSession.endedAt && latihanSession.startedAt
			? Math.floor((latihanSession.endedAt.getTime() - latihanSession.startedAt.getTime()) / 1000)
			: latihanSession.totalDuration || 0;

		const result = {
			sessionId: latihanSession.id,
			userId: latihanSession.userId,
			userName: latihanSession.user.name,
			type: latihanSession.type,
			materiId: latihanSession.materiId,
			
			// Score & Performance
			score: latihanSession.score || 0,
			totalQuestions,
			totalAnswered,
			answeredQuestions,
			correctAnswers,
			wrongAnswers,
			skippedQuestions,
			
			// Rates
			accuracyRate: latihanSession.accuracyRate || 0,
			completionRate: latihanSession.completionRate || 0,
			
			// Time
			totalDuration: sessionDuration,
			averageTimePerQ: latihanSession.averageTimePerQ || 0,
			
			// Timestamps
			startedAt: latihanSession.startedAt,
			endedAt: latihanSession.endedAt,
			
			// Additional Analytics
			difficultyBreakdown: Object.entries(difficultyStats).map(([level, stats]) => ({
				level: parseInt(level),
				total: stats.total,
				correct: stats.correct,
				accuracy: stats.total > 0 ? Math.round((stats.correct / stats.total) * 100) : 0
			})),
			
			// Detailed answers (optional, for review)
			answers: latihanSession.jawaban.map(jawaban => ({
				soalId: jawaban.soalLatihanId,
				pilihanId: jawaban.pilihanId,
				pilihanLabel: jawaban.pilihanJawaban?.label,
				kunciJawaban: jawaban.soalLatihan.kunciJawaban,
				isCorrect: jawaban.isCorrect,
				isSkipped: jawaban.isSkipped,
				timeSpent: jawaban.timeSpent,
				answeredAt: jawaban.answeredAt,
				tingkatKesulitan: jawaban.soalLatihan.tingkatKesulitan
			}))
		};

		return NextResponse.json({
			success: true,
			data: result
		});

	} catch (error) {
		console.error('Error fetching session result:', error);
		return NextResponse.json(
			{ 
				error: 'Failed to fetch session result',
				details: error instanceof Error ? error.message : 'Unknown error'
			},
			{ status: 500 }
		);
	}
}