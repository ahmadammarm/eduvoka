import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
	try {
		const session = await auth();
		if (!session?.user) {
			return NextResponse.json(
				{ error: "Unauthorized" },
				{ status: 401 }
			);
		}

		const body = await req.json();
		const { type, materiId } = body; // Terima materiId dari frontend

		if (!type) {
			return NextResponse.json(
				{ error: "Session type is required" },
				{ status: 400 }
			);
		}

		// Buat session dengan materiId
		const newSession = await prisma.latihanSession.create({
			data: {
				userId: session.user.id,
				type,
				materiId: materiId || null, // Simpan materiId
				startedAt: new Date()
			}
		});

		console.log('Session created:', newSession);

		return NextResponse.json({
			success: true,
			data: {
				sessionId: newSession.id,
				type: newSession.type,
				materiId: newSession.materiId,
				startedAt: newSession.startedAt
			}
		});

	} catch (error) {
		console.error('Error creating session:', error);
		return NextResponse.json(
			{
				error: 'Failed to create session',
				details: error instanceof Error ? error.message : 'Unknown error'
			},
			{ status: 500 }
		);
	}
}