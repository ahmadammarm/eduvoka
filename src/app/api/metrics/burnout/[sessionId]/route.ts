/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { calculateBurnout, validateBurnoutInput } from '@/lib/burnout-calc';
import type { AnswerData } from '@/types/burnout';

export function normalizeAnswers(jawaban: any[]): AnswerData[] {
	return jawaban
		.filter(j => j.answeredAt) // indikator interaksi nyata
		.map(j => ({
			timeSpent: j.timeSpent || 0,
			isCorrect: Boolean(j.isCorrect),
			isSkipped: Boolean(j.isSkipped),
			answeredAt: new Date(j.answeredAt)
		}));
}

export async function GET(
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

		// Fetch session with answers
		const latihanSession = await prisma.latihanSession.findFirst({
			where: {
				id: sessionId,
				userId: session.user.id
			},
			include: {
				jawaban: {
					where: {
						answeredAt: { not: null }
					},
					select: {
						timeSpent: true,
						isCorrect: true,
						isSkipped: true,
						answeredAt: true
					},
					orderBy: { answeredAt: 'asc' }
				}
			}
		});

		if (!latihanSession) {
			return NextResponse.json(
				{ error: 'Session not found or unauthorized' },
				{ status: 404 }
			);
		}

		// Transform to AnswerData format
		const answers = normalizeAnswers(latihanSession.jawaban);

		console.log('[Burnout] Answer stats:', {
			total: latihanSession.jawaban.length,
			afterFilter: answers.length,
			skipped: latihanSession.jawaban.filter(j => j.isSkipped).length,
			zeroTime: latihanSession.jawaban.filter(j => j.timeSpent === 0).length,
			nullTime: latihanSession.jawaban.filter(j => j.timeSpent == null).length,
		});

		// Validate input
		const validation = validateBurnoutInput(answers);

		if (!validation.valid) {
			return NextResponse.json({
				error: 'Insufficient data',
				reason: validation.reason || 'Not enough data for burnout analysis',
				canCalculate: false,
				progress: {
					current: answers.length,
					required: 5
				}
			}, { status: 400 });
		}

		// Calculate burnout
		const result = calculateBurnout({
			sessionId,
			userId: session.user.id,
			answers
		});

		// Save to database
		try {
			await prisma.sessionMetrics.upsert({
				where: { sessionId },
				create: {
					sessionId,
					sessionType: 'LATIHAN', // ✅ Specify type
					burnoutLevel: result.burnoutLevel,
					fatigueIndex: result.fatigueIndex
				},
				update: {
					burnoutLevel: result.burnoutLevel,
					fatigueIndex: result.fatigueIndex,
					updatedAt: new Date()
				}
			});
		} catch (dbError) {
			console.error('[Burnout] Failed to save metrics:', dbError);
		}

		// Return result directly (tidak pakai wrapper data.data)
		return NextResponse.json({
			...result,
			canCalculate: true,
			meta: {
				progress: {
					current: answers.length,
					required: 5
				}
			}
		}, { status: 200 });

	} catch (error) {
		console.error('[Burnout Calculate] Error:', error);

		return NextResponse.json({
			error: 'Failed to calculate burnout',
			details: error instanceof Error ? error.message : 'Unknown error',
			canCalculate: false,
			progress: {
				current: 0,
				required: 5
			}
		}, { status: 500 });
	}
}