import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { calculateBurnout, validateBurnoutInput } from '@/lib/burnout-calc';
import type { AnswerData } from '@/types/burnout';

export async function GET(
	req: NextRequest,
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

		// Fetch session with answers
		const latihanSession = await prisma.latihanSession.findFirst({
			where: {
				id: sessionId,
				userId: session.user.id
			},
			include: {
				jawaban: {
					where: {
						answeredAt: { not: null },
						isSkipped: false // Exclude skipped questions from burnout calculation
					},
					select: {
						timeSpent: true,
						isCorrect: true,
						isSkipped: true,
						answeredAt: true
					},
					orderBy: {
						answeredAt: 'asc'
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

		// Transform to AnswerData format - filter only valid answers
		const answers: AnswerData[] = latihanSession.jawaban
			.filter(j => j.timeSpent && j.timeSpent > 0 && !j.isSkipped)
			.map(j => ({
				timeSpent: j.timeSpent!,
				isCorrect: j.isCorrect ?? false,
				isSkipped: j.isSkipped,
				answeredAt: j.answeredAt!
			}));

		// Validate input
		const validation = validateBurnoutInput(answers);
		if (!validation.valid) {
			return NextResponse.json(
				{
					error: 'Insufficient data for burnout calculation',
					details: validation.reason,
					currentCount: answers.length,
					requiredCount: 10,
					canCalculate: false
				},
				{ status: 400 }
			);
		}

		// Calculate burnout
		const result = calculateBurnout({
			sessionId,
			userId: session.user.id,
			answers
		});

		// Save to database - check if sessionMetrics relation exists
		try {
			await prisma.sessionMetrics.upsert({
				where: { sessionId },
				create: {
					sessionId,
					burnoutLevel: result.burnoutLevel,
					fatigueIndex: result.fatigueIndex,
				},
				update: {
					burnoutLevel: result.burnoutLevel,
					fatigueIndex: result.fatigueIndex,
					updatedAt: new Date()
				}
			});
		} catch (dbError) {
			// Log error but don't fail the request
			console.error('[Burnout Calculate] Failed to save metrics:', dbError);
		}

		return NextResponse.json({
			success: true,
			data: result,
			meta: {
				answersAnalyzed: answers.length,
				sessionId,
				calculatedAt: new Date().toISOString()
			}
		});

	} catch (error) {
		console.error('[Burnout Calculate] Error:', error);

		if (error instanceof Error) {
			return NextResponse.json(
				{
					error: error.message,
					canCalculate: false
				},
				{ status: 400 }
			);
		}

		return NextResponse.json(
			{ error: 'Internal server error' },
			{ status: 500 }
		);
	}
}