import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import type { EventSyncPayload, CaptureEvent } from '@/types/data-capture';

export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const body: EventSyncPayload = await req.json();

        if (!body.events || !Array.isArray(body.events) || body.events.length === 0) {
            return NextResponse.json(
                { error: 'No events to process' },
                { status: 400 }
            );
        }

        // Cap batch size to prevent abuse
        const MAX_BATCH_SIZE = 200;
        const events = body.events.slice(0, MAX_BATCH_SIZE);

        // Bulk insert raw events
        const rawEvents = events.map((event: CaptureEvent) => ({
            userId: session.user.id,
            eventType: event.type,
            payload: JSON.stringify(event.payload),
            timestamp: new Date(event.timestamp),
            sessionRef: event.sessionRef ?? null,
        }));

        await prisma.rawEventLog.createMany({
            data: rawEvents,
        });

        return NextResponse.json({
            success: true,
            processed: rawEvents.length,
            batchId: body.batchId,
        });
    } catch (error) {
        console.error('[Capture Sync] Error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}