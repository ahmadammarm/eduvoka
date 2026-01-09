import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
	try {
		const { sessionId, soalUTBKId, pilihanId } = await req.json();

		if (!sessionId || !soalUTBKId) {
			return NextResponse.json(
				{ error: 'Session ID and Soal ID are required' },
				{ status: 400 }
			);
		}

		const soal = await prisma.soalUTBK.findUnique({
			where: { id: soalUTBKId },
			include: {
				pilihanJawaban: true,
			},
		});

		if (!soal) {
			return NextResponse.json(
				{ error: 'Soal not found' },
				{ status: 404 }
			);
		}

		let isCorrect = null;
		if (pilihanId) {
			const selectedPilihan = soal.pilihanJawaban.find(
				(p) => p.id === pilihanId
			);
			isCorrect = selectedPilihan?.label === soal.kunciJawaban;
		}

		const jawaban = await prisma.utbkJawabanUser.upsert({
			where: {
				sessionId_soalUTBKId: {
					sessionId,
					soalUTBKId,
				},
			},
			update: {
				pilihanId,
				isCorrect,
				answeredAt: new Date(),
			},
			create: {
				id: `jawaban-${sessionId}-${soalUTBKId}`,
				sessionId,
				soalUTBKId,
				pilihanId,
				isCorrect,
				answeredAt: new Date(),
			},
		});

		return NextResponse.json({
			success: true,
			jawaban: {
				id: jawaban.id,
				pilihanId: jawaban.pilihanId,
				answeredAt: jawaban.answeredAt,
			},
		});
	} catch (error) {
		console.error('Error submitting answer:', error);
		return NextResponse.json(
			{ error: 'Failed to submit answer' },
			{ status: 500 }
		);
	}
}