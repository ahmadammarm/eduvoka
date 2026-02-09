import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(
	_req: NextRequest,
	{ params }: { params: Promise<{ sessionId: string }> }
) {
	try {
		const session = await getServerSession(authOptions);
		if (!session?.user?.id) {
			return NextResponse.json(
				{ error: 'Unauthorized' },
				{ status: 401 }
			);
		}

		const { sessionId } = await params;

		console.log('[Complete Session] SessionId:', sessionId);

		// Verify session ownership
		const latihanSession = await prisma.latihanSession.findFirst({
			where: {
				id: sessionId,
				userId: session.user.id
			},
			include: {
				jawaban: {
					where: { isSkipped: false },
					select: {
						isCorrect: true,
						timeSpent: true
					}
				}
			}
		});

		if (!latihanSession) {
			return NextResponse.json(
				{ error: 'Session not found or unauthorized' },
				{ status: 404 }
			);
		}

		// Check if already completed
		if (latihanSession.endedAt) {
			console.log('[Complete Session] Already completed:', latihanSession.endedAt);

			// Return existing data
			return NextResponse.json({
				success: true,
				data: {
					sessionId: latihanSession.id,
					score: latihanSession.score,
					totalDuration: latihanSession.totalDuration,
					accuracyRate: latihanSession.accuracyRate,
					completionRate: latihanSession.completionRate
				}
			});
		}

		// Calculate metrics
		const totalQuestions = await prisma.latihanJawabanUser.count({
			where: { sessionId }
		});

		const answeredQuestions = latihanSession.jawaban.length;
		const correctAnswers = latihanSession.jawaban.filter(j => j.isCorrect).length;

		const accuracyRate = answeredQuestions > 0
			? (correctAnswers / answeredQuestions) * 100
			: 0;

		const completionRate = totalQuestions > 0
			? (answeredQuestions / totalQuestions) * 100
			: 0;

		const score = Math.round(accuracyRate);

		const totalDuration = latihanSession.jawaban.reduce(
			(sum, j) => sum + (j.timeSpent || 0),
			0
		);

		const averageTimePerQ = answeredQuestions > 0
			? totalDuration / answeredQuestions
			: 0;

		// Update session
		const updatedSession = await prisma.latihanSession.update({
			where: { id: sessionId },
			data: {
				endedAt: new Date(),
				score,
				totalDuration,
				averageTimePerQ,
				accuracyRate,
				completionRate
			}
		});

		console.log('[Complete Session] Updated:', {
			sessionId,
			score,
			totalDuration,
			accuracyRate
		});

		return NextResponse.json({
			success: true,
			data: {
				sessionId: updatedSession.id,
				score: updatedSession.score,
				totalDuration: updatedSession.totalDuration,
				accuracyRate: updatedSession.accuracyRate,
				completionRate: updatedSession.completionRate
			}
		});

	} catch (error) {
		console.error('[Complete Session] Error:', error);
		return NextResponse.json(
			{
				error: 'Internal server error',
				details: error instanceof Error ? error.message : 'Unknown error'
			},
			{ status: 500 }
		);
	}
}