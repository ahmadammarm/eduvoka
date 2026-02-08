import { NextRequest, NextResponse } from "next/server";
import { prisma } from '@/lib/prisma';
import { auth } from "@/lib/auth";

export async function GET(request: NextRequest, { params }: { params: Promise<{ materiId: string }> }) {
    try {
        const session = await auth();
        const user = session?.user;

        if (!user) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        const { materiId } = await params;

        const materiById = await prisma.materi.findUnique({
            where: {
                id: materiId
            }
        });

        if (!materiById) {
            return NextResponse.json({ message: 'Materi not found' }, { status: 404 });
        }

        // Get user's learning metrics for this materi
        const learningMetrics = await prisma.learningMetrics.findMany({
            where: {
                userId: user.id,
                materiId: materiId
            },
            orderBy: {
                date: 'desc'
            },
            take: 30 // Last 30 days
        });

        const totalStudyTime = learningMetrics.reduce((sum, m) => sum + m.totalStudyTime, 0);
        const activeDays = learningMetrics.filter(m => m.isActiveDay).length;

        return NextResponse.json({
            ...materiById,
            userProgress: {
                totalStudyTime,
                activeDays,
                lastStudied: learningMetrics[0]?.date || null,
                history: learningMetrics
            }
        });
    } catch (error) {
        return NextResponse.json({ 
            message: error instanceof Error ? error.message : "Internal Server Error" 
        }, { status: 500 });
    }
}