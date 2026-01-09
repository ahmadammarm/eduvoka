import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { UTBKSessionType } from "../../../../../../generated/prisma/enums";

const MIN_SCORE_TO_CONTINUE = 70;

export async function POST(req: NextRequest) {
	try {
		const body = await req.json();
		const sessionType: UTBKSessionType = body.sessionType || "TPS";

		const userSession = await auth();
		const userId = userSession?.user?.id;

		if (!userId) {
			return NextResponse.json(
				{ error: "Unauthorized" },
				{ status: 401 }
			);
		}

		if (!["TPS", "LITERASI"].includes(sessionType)) {
			return NextResponse.json(
				{ error: "Invalid session type" },
				{ status: 400 }
			);
		}


		if (sessionType === "LITERASI") {
			const lastTPS = await prisma.utbkSession.findFirst({
				where: {
					userId,
					type: "TPS",
					endedAt: {
						not: null,
					},
				},
				orderBy: {
					endedAt: "desc",
				},
			});

			if (!lastTPS) {
				return NextResponse.json(
					{ error: "Sesi TPS belum diselesaikan" },
					{ status: 400 }
				);
			}

			if (lastTPS.score === null || lastTPS.score < MIN_SCORE_TO_CONTINUE) {
				return NextResponse.json(
					{
						error: "Skor TPS tidak memenuhi syarat",
						minScore: MIN_SCORE_TO_CONTINUE,
						yourScore: lastTPS.score,
					},
					{ status: 403 }
				);
			}
		}


		const session = await prisma.utbkSession.create({
			data: {
				userId,
				type: sessionType,
			},
		});


		const soalList = await prisma.soalUTBK.findMany({
			where: {
				tipeSesi: sessionType,
			},
			include: {
				pilihanJawaban: {
					orderBy: { label: "asc" },
				},
			},
			orderBy: { id: "asc" },
		});

		if (!soalList || soalList.length === 0) {
			await prisma.utbkSession.delete({
				where: { id: session.id },
			});

			return NextResponse.json(
				{ error: "No soal available for this session type" },
				{ status: 404 }
			);
		}


		await prisma.utbkJawabanUser.createMany({
			data: soalList.map((soal) => ({
				id: `jawaban-${session.id}-${soal.id}`,
				sessionId: session.id,
				soalUTBKId: soal.id,
				pilihanId: null,
				isCorrect: null,
				answeredAt: null,
			})),
		});


		const soalWithoutKunci = soalList.map((soal) => ({
			id: soal.id,
			tipe: soal.tipe,
			tipeSesi: soal.tipeSesi,
			content: soal.content,
			pilihanJawaban: soal.pilihanJawaban,
		}));

		return NextResponse.json({
			session: {
				id: session.id,
				type: session.type,
				startedAt: session.startedAt,
			},
			soal: soalWithoutKunci,
		});
	} catch (error) {
		console.error("Error starting UTBK session:", error);
		return NextResponse.json(
			{
				error: "Failed to start session",
				details:
					process.env.NODE_ENV === "development"
						? String(error)
						: undefined,
			},
			{ status: 500 }
		);
	}
}
