import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
	req: NextRequest,
	{ params }: { params: Promise<{ materiId: string }> } // Changed to Promise
) {
	try {
		const session = await auth();
		if (!session?.user) {
			return NextResponse.json(
				{ error: "Unauthorized" },
				{ status: 401 }
			);
		}

		// Await params
		const { materiId } = await params;

		const { sessionId, soalLatihanId, pilihanId, timeSpent, isSkipped } = await req.json();

		if (!sessionId || !soalLatihanId) {
			return NextResponse.json(
				{ error: 'Session ID and Soal ID are required' },
				{ status: 400 }
			);
		}

		// Validasi session belongs to user
		const latihanSession = await prisma.latihanSession.findFirst({
			where: {
				id: sessionId,
				userId: session.user.id
			}
		});

		if (!latihanSession) {
			return NextResponse.json(
				{ error: 'Session not found or unauthorized' },
				{ status: 404 }
			);
		}

		// Get soal dengan kunci jawaban
		const soal = await prisma.soalLatihanSoal.findUnique({
			where: {
				id: soalLatihanId,
				materiId: materiId // Use awaited materiId
			},
			include: {
				pilihanJawaban: true,
			},
		});

		if (!soal) {
			return NextResponse.json(
				{ error: 'Soal not found in this materi' },
				{ status: 404 }
			);
		}

		// Hitung isCorrect
		let isCorrect: boolean | null = null;
		if (pilihanId && !isSkipped) {
			const selectedPilihan = soal.pilihanJawaban.find(
				(p) => p.id === pilihanId
			);
			isCorrect = selectedPilihan?.label === soal.kunciJawaban;
		}

		// Upsert jawaban
		const jawaban = await prisma.latihanJawabanUser.upsert({
			where: {
				sessionId_soalLatihanId: {
					sessionId,
					soalLatihanId,
				},
			},
			update: {
				pilihanId: isSkipped ? null : pilihanId,
				isCorrect,
				answeredAt: new Date(),
				timeSpent,
				isSkipped
			},
			create: {
				sessionId,
				soalLatihanId,
				pilihanId: isSkipped ? null : pilihanId,
				isCorrect,
				answeredAt: new Date(),
				timeSpent,
				isSkipped
			},
		});

		return NextResponse.json({
			success: true,
			data: {
				id: jawaban.id,
				isCorrect: jawaban.isCorrect,
				kunciJawaban: soal.kunciJawaban, // Return setelah dijawab
				answeredAt: jawaban.answeredAt
			}
		});

	} catch (error) {
		console.error('Error submitting answer:', error);
		return NextResponse.json(
			{ error: 'Failed to submit answer' },
			{ status: 500 }
		);
	}
}