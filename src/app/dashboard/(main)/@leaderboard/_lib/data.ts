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

			const leaderboard = await Promise.all(
				paginatedScores.map(async (score, index) => {
					const user = await prisma.user.findUnique({
						where: { id: score.userId },
					});

					const session = await prisma.utbkSession.findFirst({
						where: {
							userId: score.userId,
							score: score._max.score,
							endedAt: {
								not: null,
							},
						},
						orderBy: {
							endedAt: "desc",
						},
					});

					return {
						rank: skip + index + 1,
						userId: score.userId,
						score: score._max.score || 0,
						user: user,
						startedAt: session?.startedAt,
						endedAt: session?.endedAt,
					};
				})
			);

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

			const leaderboard = await Promise.all(
				bestScores.map(async (score, index) => {
					const user = await prisma.user.findUnique({
						where: { id: score.userId },
					});

					const session = await prisma.utbkSession.findFirst({
						where: {
							userId: score.userId,
							score: score._max.score,
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
					});

					return {
						rank: index + 1,
						userId: score.userId,
						score: score._max.score || 0,
						user: user,
						startedAt: session?.startedAt,
						endedAt: session?.endedAt,
					};
				})
			);

			return leaderboard;
		},
		["leaderboard-today"],
		{ revalidate: 300 }
	)();
}

export async function getCurrentUserRank(userId: string) {
	return unstable_cache(
		async (userId: string) => {
			const allBestScores = await prisma.utbkSession.groupBy({
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

			const userIndex = allBestScores.findIndex(
				(s) => s.userId === userId
			);

			if (userIndex === -1) {
				return null;
			}

			const userScore = allBestScores[userIndex];
			const user = await prisma.user.findUnique({
				where: { id: userId },
			});

			const session = await prisma.utbkSession.findFirst({
				where: {
					userId: userId,
					score: userScore._max.score,
					endedAt: {
						not: null,
					},
				},
				orderBy: {
					endedAt: "desc",
				},
			});

			return {
				rank: userIndex + 1,
				userId: userId,
				score: userScore._max.score || 0,
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

			const allBestScores = await prisma.utbkSession.groupBy({
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
			});

			const userIndex = allBestScores.findIndex(
				(s) => s.userId === userId
			);

			if (userIndex === -1) {
				return null;
			}

			const userScore = allBestScores[userIndex];
			const user = await prisma.user.findUnique({
				where: { id: userId },
			});

			const session = await prisma.utbkSession.findFirst({
				where: {
					userId: userId,
					score: userScore._max.score,
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
			});

			return {
				rank: userIndex + 1,
				userId: userId,
				score: userScore._max.score || 0,
				user: user,
				startedAt: session?.startedAt,
				endedAt: session?.endedAt,
			};
		},
		["current-user-rank-today", userId],
		{ revalidate: 300 }
	)(userId);
}
