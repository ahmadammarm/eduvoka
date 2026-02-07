import { auth } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest, { params }: { params: Promise<{ materiId: string }> }) {
	try {
		const session = await auth();
		const user = session?.user;

		if (!user) {
			return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
		}

		const { materiId } = await params;

		const metrics = await prisma.learningMetrics.findMany({
			where: {
				userId: user.id,
				materiId: materiId
			},
			orderBy: {
				date: 'desc'
			},
			take: 30 // last 30 days
		});

		const totalStudyTime = metrics.reduce((sum, m) => sum + m.totalStudyTime, 0);
		const activeDays = metrics.filter(m => m.isActiveDay).length;

		return NextResponse.json({
			success: true,
			data: {
				totalStudyTime,
				activeDays,
				history: metrics
			}
		});

	} catch (error) {
		console.error('Error fetching metrics:', error);
		return NextResponse.json({
			message: error instanceof Error ? error.message : "Internal Server Error"
		}, { status: 500 });
	}
}