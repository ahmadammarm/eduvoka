"use server";

import { prisma } from "@/lib/prisma";
import { unstable_cache } from "next/cache";

const PAGE_SIZE = 10;

export async function getLeaderboardData(page: number = 1) {
	return unstable_cache(
		async (page: number = 1) => {
			const pageSize = PAGE_SIZE;
			const skip = (page - 1) * pageSize;

			const bestScores = await prisma.utbkSession.groupBy({
				by: ["userId"],
				where: {
					endedAt: {
						not: null,
					},
				},
				_max: {
					score: true,
				},
				orderBy: {
					_max: {
						score: "desc",
					},
				},
			});

			const totalCount = bestScores.length;
			const totalPages = Math.ceil(totalCount / pageSize);

			const paginatedScores = bestScores.slice(skip, skip + pageSize);

			const userIds = paginatedScores.map((score) => score.userId);
			const users = await prisma.user.findMany({
				where: { id: { in: userIds } },
			});

			const usersById = new Map<string, (typeof users)[number]>();
			for (const user of users) {
				usersById.set(user.id, user);
			}
			const sessions = await prisma.utbkSession.findMany({
				where: {
					OR: paginatedScores.map((score) => ({
						userId: score.userId,
						score: score._max.score,
						endedAt: {
							not: null,
						},
					})),
				},
				orderBy: {
					endedAt: "desc",
				},
			});

			const sessionsByUserId = new Map<
				string,
				(typeof sessions)[number]
			>();
			for (const session of sessions) {
				if (!sessionsByUserId.has(session.userId)) {
					sessionsByUserId.set(session.userId, session);
				}
			}

			const leaderboard = paginatedScores.map((score, index) => {
				const user = usersById.get(score.userId) || null;
				const session = sessionsByUserId.get(score.userId);

				return {
					rank: skip + index + 1,
					userId: score.userId,
					score: score._max.score || 0,
					user: user || null,
					startedAt: session?.startedAt || null,
					endedAt: session?.endedAt || null,
				};
			});

			return {
				leaderboard,
				totalPages,
				totalCount,
			};
		},
		["leaderboard-data", page.toString()],
		{ revalidate: 60 }
	)(page);
}

export async function getLeaderboardToday() {
	return unstable_cache(
		async () => {
			const today = new Date();
			today.setHours(0, 0, 0, 0);

			const bestScores = await prisma.utbkSession.groupBy({
				by: ["userId"],
				where: {
					startedAt: {
						gte: today,
					},
					endedAt: {
						not: null,
					},
				},
				_max: {
					score: true,
				},
				orderBy: {
					_max: {
						score: "desc",
					},
				},
				take: 10,
			});

			const userIds = bestScores.map((score) => score.userId);
			const users = await prisma.user.findMany({
				where: { id: { in: userIds } },
			});
			const userMap = new Map(users.map((user) => [user.id, user]));

			const sessions = await prisma.utbkSession.findMany({
				where: {
					userId: { in: userIds },
					startedAt: { gte: today },
					endedAt: { not: null },
				},
				orderBy: {
					endedAt: "desc",
				},
			});

			const sessionMap = new Map<string, (typeof sessions)[0]>();
			for (const session of sessions) {
				if (!sessionMap.has(session.userId)) {
					sessionMap.set(session.userId, session);
				}
			}

			const leaderboard = bestScores.map((score, index) => {
				const user = userMap.get(score.userId);
				const session = sessionMap.get(score.userId);

				return {
					rank: index + 1,
					userId: score.userId,
					score: score._max.score || 0,
					user: user || null,
					startedAt: session?.startedAt || null,
					endedAt: session?.endedAt || null,
				};
			});

			return leaderboard;
		},
		["leaderboard-today"],
		{ revalidate: 300 }
	)();
}

export async function getCurrentUserRank(userId: string) {
	return unstable_cache(
		async (userId: string) => {
			const userBestScore = await prisma.utbkSession.groupBy({
				by: ["userId"],
				where: {
					endedAt: {
						not: null,
					},
				},
				_max: {
					score: true,
				},
			});

			if (!userBestScore.length || !userBestScore[0]._max.score) {
				return null;
			}

			const userScore = userBestScore[0]._max.score;

			const rankResult = await prisma.$queryRaw<[{ rank: bigint }]>`
					SELECT CAST(COUNT(*) + 1 AS UNSIGNED) as \`rank\`
					FROM (
							SELECT userId, MAX(CAST(score AS DECIMAL(10,2))) as maxScore
							FROM UtbkSession
							WHERE endedAt IS NOT NULL
							GROUP BY userId
					) as bestScores
					WHERE bestScores.maxScore > CAST(${userScore} AS DECIMAL(10,2))
			`;

			const rank = Number(rankResult[0].rank);

			const [user, session] = await Promise.all([
				prisma.user.findUnique({
					where: { id: userId },
				}),
				prisma.utbkSession.findFirst({
					where: {
						userId: userId,
						score: userScore,
						endedAt: {
							not: null,
						},
					},
					orderBy: {
						endedAt: "desc",
					},
				}),
			]);

			return {
				rank,
				userId: userId,
				score: userScore,
				user: user,
				startedAt: session?.startedAt,
				endedAt: session?.endedAt,
			};
		},
		["current-user-rank", userId],
		{ revalidate: 60 }
	)(userId);
}

export async function getCurrentUserRankToday(userId: string) {
	return unstable_cache(
		async (userId: string) => {
			const today = new Date();
			today.setHours(0, 0, 0, 0);

			const userBestScore = await prisma.utbkSession.groupBy({
				by: ["userId"],
				where: {
					userId: userId,
					startedAt: {
						gte: today,
					},
					endedAt: {
						not: null,
					},
				},
				_max: {
					score: true,
				},
			});

			if (!userBestScore.length || !userBestScore[0]._max.score) {
				return null;
			}

			const userScore = userBestScore[0]._max.score;

			const rankResult = await prisma.$queryRaw<[{ rank: bigint }]>`
					SELECT CAST(COUNT(*) + 1 AS UNSIGNED) as \`rank\`
					FROM (
							SELECT userId, MAX(CAST(score AS DECIMAL(10,2))) as maxScore
							FROM UtbkSession
							WHERE startedAt >= ${today}
							AND endedAt IS NOT NULL
							GROUP BY userId
					) as bestScores
					WHERE bestScores.maxScore > CAST(${userScore} AS DECIMAL(10,2))
			`;

			const rank = Number(rankResult[0].rank);

			const [user, session] = await Promise.all([
				prisma.user.findUnique({
					where: { id: userId },
				}),
				prisma.utbkSession.findFirst({
					where: {
						userId: userId,
						score: userScore,
						startedAt: {
							gte: today,
						},
						endedAt: {
							not: null,
						},
					},
					orderBy: {
						endedAt: "desc",
					},
				}),
			]);

			return {
				rank,
				userId: userId,
				score: userScore,
				user: user,
				startedAt: session?.startedAt,
				endedAt: session?.endedAt,
			};
		},
		["current-user-rank-today", userId],
		{ revalidate: 300 }
	)(userId);
}
