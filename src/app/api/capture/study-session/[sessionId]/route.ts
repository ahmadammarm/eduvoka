import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

async function handleUpdate(req: NextRequest, sessionId: string) {
    try {
        const session = await getServerSession(authOptions);

        console.log('[StudySession Update] sessionId:', sessionId);
        console.log('[StudySession Update] auth:', session?.user?.id ?? 'NO_AUTH');

        if (!session?.user?.id) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const body = await req.json();
        console.log('[StudySession Update] payload:', JSON.stringify(body));

        // Verify ownership
        const studySession = await prisma.studySession.findFirst({
            where: {
                id: sessionId,
                userId: session.user.id,
            },
        });

        if (!studySession) {
            return NextResponse.json(
                { error: 'Study session not found' },
                { status: 404 }
            );
        }

        const updated = await prisma.studySession.update({
            where: { id: sessionId },
            data: {
                endedAt: new Date(),
                totalDuration: body.totalDuration ?? studySession.totalDuration,
                idleDuration: body.idleDuration ?? studySession.idleDuration,
                scrollDepthMax: body.scrollDepthMax ?? studySession.scrollDepthMax,
                scrollDepthAvg: body.scrollDepthAvg ?? studySession.scrollDepthAvg,
                totalScrollEvents: body.totalScrollEvents ?? studySession.totalScrollEvents,
                totalVisibleTime: body.totalVisibleTime ?? studySession.totalVisibleTime,
                totalHiddenTime: body.totalHiddenTime ?? studySession.totalHiddenTime,
                visibilityChanges: body.visibilityChanges ?? studySession.visibilityChanges,
                isCompleted: body.isCompleted ?? studySession.isCompleted,
                isAbandoned: body.isAbandoned ?? studySession.isAbandoned,
            },
        });

        return NextResponse.json({ success: true, session: updated });
    } catch (error) {
        console.error('[StudySession Update] Error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

// PATCH — normal update
export async function PATCH(
    req: NextRequest,
    { params }: { params: Promise<{ sessionId: string }> }
) {
    const { sessionId } = await params;
    return handleUpdate(req, sessionId);
}

// POST — sendBeacon fallback (sendBeacon only supports POST)
export async function POST(
    req: NextRequest,
    { params }: { params: Promise<{ sessionId: string }> }
) {
    const { sessionId } = await params;
    return handleUpdate(req, sessionId);
}