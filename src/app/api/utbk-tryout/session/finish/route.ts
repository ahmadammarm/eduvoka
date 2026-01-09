import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function POST(req: NextRequest) {
	try {
		const { sessionId } = await req.json();

		if (!sessionId) {
			return NextResponse.json(
				{ error: "Session ID is required" },
				{ status: 400 }
			);
		}

		const userSession = await auth();
		const userId = userSession?.user?.id;

		if (!userId) {
			return NextResponse.json(
				{ error: "Unauthorized" },
				{ status: 401 }
			);
		}

		const session = await prisma.utbkSession.findFirst({
			where: {
				id: sessionId,
				userId,
			},
		});

		if (!session) {
			return NextResponse.json(
				{ error: "Session not found" },
				{ status: 404 }
			);
		}

		const jawabanList = await prisma.utbkJawabanUser.findMany({
			where: { sessionId },
			include: {
				soalUTBK: {
					include: { pilihanJawaban: true },
				},
				pilihanJawaban: true,
			},
		});

		if (jawabanList.length === 0) {
			return NextResponse.json(
				{ error: "Tidak ada soal pada sesi ini" },
				{ status: 400 }
			);
		}

		const totalSoal = jawabanList.length;
		const correctAnswers = jawabanList.filter(j => j.isCorrect === true).length;
		const score = Math.round((correctAnswers / totalSoal) * 100);

		const updatedSession = await prisma.utbkSession.update({
			where: { id: sessionId },
			data: {
				endedAt: new Date(),
				score,
			},
		});

		const results = await Promise.all(
			jawabanList.map(async (jawaban) => {
				const pembahasan = await prisma.pembahasanSoalUTBK.findMany({
					where: { soalUTBKId: jawaban.soalUTBKId },
				});

				return {
					soalId: jawaban.soalUTBK.id,
					soalContent: jawaban.soalUTBK.content,
					soalTipe: jawaban.soalUTBK.tipe,
					kunciJawaban: jawaban.soalUTBK.kunciJawaban,
					pilihanJawaban: jawaban.soalUTBK.pilihanJawaban,
					userAnswer: jawaban.pilihanJawaban?.label ?? null,
					isCorrect: jawaban.isCorrect,
					pembahasan,
				};
			})
		);

		return NextResponse.json({
			session: {
				id: updatedSession.id,
				type: updatedSession.type,
				startedAt: updatedSession.startedAt,
				endedAt: updatedSession.endedAt,
				score: updatedSession.score,
			},
			stats: {
				total: totalSoal,
				correct: correctAnswers,
				incorrect: totalSoal - correctAnswers,
				score,
			},
			results,
		});
	} catch (error) {
		console.error("Error finishing UTBK session:", error);
		return NextResponse.json(
			{ error: "Failed to finish session" },
			{ status: 500 }
		);
	}
}
