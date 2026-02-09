/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { calculateBurnout, validateBurnoutInput } from '@/lib/burnout-calc';
import type { BurnoutLevel } from '@/types/burnout';
import { SessionType } from '@/generated/prisma/enums';
import { normalizeAnswers } from './[sessionId]/route';

interface BatchCalculateRequest {
	userId?: string;
	sessionIds?: string[];
	dateRange?: {
		from: string;
		to: string;
	};
	sessionType?: SessionType;
	limit?: number;
	includeExisting?: boolean;
}

interface BatchResult {
	sessionId: string;
	burnoutLevel: BurnoutLevel;
	fatigueIndex: number;
	calculatedAt: string;
}

interface BatchError {
	sessionId: string;
	reason: string;
}

export async function POST(req: NextRequest) {
	try {
		const session = await getServerSession(authOptions);
		if (!session?.user?.id) {
			return NextResponse.json(
				{ error: 'Unauthorized' },
				{ status: 401 }
			);
		}

		const body: BatchCalculateRequest = await req.json();
		const userId = body.userId || session.user.id;
		const limit = Math.min(body.limit || 50, 100); // Max 100 sessions

		// Build query
		const whereClause: any = {
			userId,
			endedAt: { not: null } // Only completed sessions
		};

		if (body.sessionIds) {
			whereClause.id = { in: body.sessionIds };
		}

		if (body.dateRange) {
			whereClause.startedAt = {
				gte: new Date(body.dateRange.from),
				lte: new Date(body.dateRange.to)
			};
		}

		if (body.sessionType) {
			whereClause.type = body.sessionType;
		}

		if (!body.includeExisting) {
			whereClause.NOT = {
				sessionMetrics: { isNot: null }
			};
		}

		// Fetch sessions
		const sessions = await prisma.latihanSession.findMany({
			where: whereClause,
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
					orderBy: {
						answeredAt: 'asc'
					}
				}
			},
			take: limit,
			orderBy: {
				startedAt: 'desc'
			}
		});

		// Process each session
		const results: BatchResult[] = [];
		const errors: BatchError[] = [];

		for (const sess of sessions) {
			try {
				const answers = normalizeAnswers(sess.jawaban);

				const validation = validateBurnoutInput(answers);
				if (!validation.valid) {
					errors.push({
						sessionId: sess.id,
						reason: validation.reason || 'Validation failed'
					});
					continue;
				}

				const result = calculateBurnout({
					sessionId: sess.id,
					userId: sess.userId,
					answers
				});

				// Save metrics
				// Update save metrics
				await prisma.sessionMetrics.upsert({
					where: { sessionId: sess.id },
					create: {
						sessionId: sess.id,
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

				results.push({
					sessionId: sess.id,
					burnoutLevel: result.burnoutLevel,
					fatigueIndex: result.fatigueIndex,
					calculatedAt: new Date().toISOString()
				});

			} catch (error) {
				errors.push({
					sessionId: sess.id,
					reason: error instanceof Error ? error.message : 'Unknown error'
				});
			}
		}

		// Calculate summary
		const burnoutDistribution = results.reduce((acc, r) => {
			acc[r.burnoutLevel] = (acc[r.burnoutLevel] || 0) + 1;
			return acc;
		}, {} as Record<BurnoutLevel, number>);

		const avgBurnoutIndex = results.length > 0
			? results.reduce((sum, r) => sum + r.fatigueIndex, 0) / results.length
			: 0;

		return NextResponse.json({
			success: true,
			processed: results.length,
			failed: errors.length,
			results,
			errors,
			summary: {
				avgBurnoutIndex: Math.round(avgBurnoutIndex * 10) / 5,
				burnoutDistribution,
				trend: 'STABLE' // TODO: Implement trend calculation
			}
		});

	} catch (error) {
		console.error('[Batch Calculate] Error:', error);
		return NextResponse.json(
			{ error: 'Internal server error' },
			{ status: 500 }
		);
	}
}