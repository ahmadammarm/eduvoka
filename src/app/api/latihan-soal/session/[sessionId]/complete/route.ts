import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
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

		// Get session dengan jawaban
		const latihanSession = await prisma.latihanSession.findFirst({
			where: {
				id: sessionId,
				userId: session.user.id
			},
			include: {
				jawaban: true
			}
		});

		if (!latihanSession) {
			return NextResponse.json(
				{ error: 'Session not found' },
				{ status: 404 }
			);
		}

		console.log('Session found:', {
			sessionId: latihanSession.id,
			materiId: latihanSession.materiId,
			type: latihanSession.type,
			totalJawaban: latihanSession.jawaban.length
		});

		// Get total soal - HANYA jika materiId ada
		let totalSoalCount = latihanSession.jawaban.length;
		
		if (latihanSession.materiId) {
			totalSoalCount = await prisma.soalLatihanSoal.count({
				where: {
					materiId: latihanSession.materiId,
					tipeSesi: latihanSession.type
				}
			});
		}

		console.log('Total soal available:', totalSoalCount);

		// Hitung analytics
		const totalAnswered = latihanSession.jawaban.length;
		const answeredQuestions = latihanSession.jawaban.filter(j => !j.isSkipped).length;
		const skippedQuestions = latihanSession.jawaban.filter(j => j.isSkipped).length;
		const correctAnswers = latihanSession.jawaban.filter(j => j.isCorrect === true).length;
		const wrongAnswers = answeredQuestions - correctAnswers;

		const totalQuestions = totalSoalCount > 0 ? totalSoalCount : totalAnswered;

		// Score dari yang dijawab (tidak termasuk skip)
		const score = answeredQuestions > 0 
			? Math.round((correctAnswers / answeredQuestions) * 100) 
			: 0;

		const accuracyRate = answeredQuestions > 0 
			? Math.round((correctAnswers / answeredQuestions) * 100) 
			: 0;

		const completionRate = totalQuestions > 0
			? Math.round((answeredQuestions / totalQuestions) * 100)
			: 0;

		const totalTimeSpent = latihanSession.jawaban.reduce(
			(sum, j) => sum + (j.timeSpent || 0), 
			0
		);
		
		const averageTimePerQ = answeredQuestions > 0 
			? Math.round(totalTimeSpent / answeredQuestions) 
			: 0;

		console.log('Analytics calculated:', {
			totalQuestions,
			answeredQuestions,
			correctAnswers,
			score,
			accuracyRate,
			completionRate,
			totalTimeSpent,
			averageTimePerQ
		});

		// Update session
		const updatedSession = await prisma.latihanSession.update({
			where: { id: sessionId },
			data: {
				endedAt: new Date(),
				score,
				totalDuration: totalTimeSpent,
				averageTimePerQ,
				accuracyRate,
				completionRate
			}
		});

		return NextResponse.json({
			success: true,
			data: {
				sessionId: updatedSession.id,
				score: updatedSession.score,
				totalQuestions,
				totalAnswered,
				answeredQuestions,
				correctAnswers,
				wrongAnswers,
				skippedQuestions,
				accuracyRate: updatedSession.accuracyRate,
				completionRate: updatedSession.completionRate,
				totalDuration: updatedSession.totalDuration,
				averageTimePerQ: updatedSession.averageTimePerQ
			}
		});

	} catch (error) {
		console.error('Error completing session:', error);
		return NextResponse.json(
			{ 
				error: 'Failed to complete session',
				details: error instanceof Error ? error.message : 'Unknown error'
			},
			{ status: 500 }
		);
	}
}