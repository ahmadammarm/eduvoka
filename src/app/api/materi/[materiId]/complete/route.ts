import { auth } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from '@/lib/prisma';

interface RequestBody {
	studyTimeInSeconds?: number;
}

export async function POST(
	request: NextRequest,
	{ params }: { params: Promise<{ materiId: string }> }
) {
	try {
		const session = await auth();
		const user = session?.user;

		if (!user) {
			return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
		}

		const { materiId } = await params;
		const body: RequestBody = await request.json().catch(() => ({}));

		const materi = await prisma.materi.findUnique({
			where: { id: materiId }
		});

		if (!materi) {
			return NextResponse.json({ message: 'Materi not found' }, { status: 404 });
		}

		const studyTime = body.studyTimeInSeconds || 300;

		if (studyTime < 0 || studyTime > 7200) {
			return NextResponse.json({
				message: 'Invalid study time. Must be between 0 and 7200 seconds'
			}, { status: 400 });
		}

		// Get today's date in local timezone
		const now = new Date();
		const localDateString = now.toLocaleDateString('en-CA'); // YYYY-MM-DD
		const today = new Date(localDateString + 'T00:00:00.000Z');

		// ✅ PERBAIKAN: Gunakan userId_materiId_date (sesuai schema baru)
		const materiMetrics = await prisma.learningMetrics.upsert({
			where: {
				userId_materiId_date: {
					userId: user.id,
					materiId: materiId,
					date: today
				}
			},
			update: {
				totalStudyTime: { increment: studyTime },
				isActiveDay: true,
				updatedAt: new Date()
			},
			create: {
				userId: user.id,
				materiId: materiId,
				date: today,
				totalStudyTime: studyTime,
				isActiveDay: true,
				currentStreak: 0,
				totalQuestions: 0,
				correctAnswers: 0,
				sessionsCount: 0
			}
		});

		// === UPDATE DAILY AGGREGATE ===
		const yesterday = new Date(today);
		yesterday.setUTCDate(yesterday.getUTCDate() - 1);

		// Get yesterday's aggregate for streak calculation
		const yesterdayMetrics = await prisma.learningMetrics.findFirst({
			where: {
				userId: user.id,
				materiId: null,
				date: yesterday
			}
		});

		// Calculate streak
		const yesterdayStreak = yesterdayMetrics?.isActiveDay 
			? (yesterdayMetrics.currentStreak || 0) 
			: 0;
		const currentStreak = yesterdayStreak > 0 ? yesterdayStreak + 1 : 1;

		// ✅ PERBAIKAN: Untuk daily aggregate (materiId = null)
		const dailyMetrics = await prisma.learningMetrics.upsert({
			where: {
				userId_materiId_date: {
					userId: user.id,
					materiId: "",
					date: today
				}
			},
			update: {
				totalStudyTime: { increment: studyTime },
				isActiveDay: true,
				currentStreak: currentStreak,
				updatedAt: new Date()
			},
			create: {
				userId: user.id,
				materiId: null,
				date: today,
				totalStudyTime: studyTime,
				isActiveDay: true,
				currentStreak: currentStreak,
				totalQuestions: 0,
				correctAnswers: 0,
				sessionsCount: 0
			}
		});

		return NextResponse.json({
			success: true,
			message: 'Learning metrics updated successfully',
			data: {
				materi: {
					id: materi.id,
					name: materi.nama,
					studyTime: materiMetrics.totalStudyTime
				},
				daily: {
					totalStudyTime: dailyMetrics.totalStudyTime,
					isActiveDay: dailyMetrics.isActiveDay,
					currentStreak: dailyMetrics.currentStreak,
					date: dailyMetrics.date
				}
			}
		}, { status: 200 });

	} catch (error) {
		console.error('Error updating learning metrics:', error);
		return NextResponse.json({
			message: error instanceof Error ? error.message : "Internal Server Error"
		}, { status: 500 });
	}
}