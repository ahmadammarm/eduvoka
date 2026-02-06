import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const { materiId } = await req.json();

        if (!materiId) {
            return NextResponse.json(
                { error: 'materiId is required' },
                { status: 400 }
            );
        }

        // Verify materi exists
        const materi = await prisma.materi.findUnique({
            where: { id: materiId },
        });

        if (!materi) {
            return NextResponse.json(
                { error: 'Materi not found' },
                { status: 404 }
            );
        }

        const studySession = await prisma.studySession.create({
            data: {
                userId: session.user.id,
                materiId,
            },
        });

        return NextResponse.json({
            sessionId: studySession.id,
        });
    } catch (error) {
        console.error('[StudySession Create] Error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}