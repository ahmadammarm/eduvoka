/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { auth } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
	try {
		const session = await auth();
		const user = session?.user;

		console.log("Session user:", user);

		if (!user) {
			return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
		}

		const body = await request.json();
		console.log("Request body:", body);
		
		const { answers }: { answers: { pertanyaanId: string; jawabanKuisVAKId: string }[] } = body;

		if (!answers || answers.length === 0) {
			return NextResponse.json(
				{ message: "Jawaban kosong" },
				{ status: 400 }
			);
		}

		console.log("Answers count:", answers.length);

		const jawabanIds = answers.map((ans) => ans.jawabanKuisVAKId);
		console.log("Jawaban IDs:", jawabanIds);

		const jawabanKuis = await prisma.jawabanKuisVAK.findMany({
			where: {
				id: { in: jawabanIds },
			},
			select: {
				id: true,
				tipeJawaban: true,
			}
		});

		console.log("Found jawaban kuis:", jawabanKuis);

		if (jawabanKuis.length !== answers.length) {
			return NextResponse.json(
				{ message: "Beberapa jawaban tidak valid" },
				{ status: 400 }
			);
		}

		const totalGayaBelajar: Record<'VISUAL' | 'AUDITORY' | 'KINESTHETIC', number> = {
			VISUAL: 0,
			AUDITORY: 0,
			KINESTHETIC: 0,
		}

		for (const jawaban of jawabanKuis) {
			if (jawaban && jawaban.tipeJawaban && jawaban.tipeJawaban in totalGayaBelajar) {
				totalGayaBelajar[jawaban.tipeJawaban as keyof typeof totalGayaBelajar]++;
			}
		}

		console.log("Total gaya belajar:", totalGayaBelajar);

		const maximum = Math.max(...Object.values(totalGayaBelajar));
		const gayaBelajarTerpilih = Object.entries(totalGayaBelajar)
			.filter(([_, v]) => v === maximum)
			.map(([k]) => k);

		console.log("Gaya belajar terpilih:", gayaBelajarTerpilih);

		const pertanyaanIds = answers.map(a => a.pertanyaanId);
		console.log("Pertanyaan IDs:", pertanyaanIds);

		const validPertanyaan = await prisma.pertanyaanKuisVAK.findMany({
			where: {
				id: { in: pertanyaanIds }
			},
			select: { id: true }
		});

		console.log("Valid pertanyaan count:", validPertanyaan.length);

		if (validPertanyaan.length !== answers.length) {
			return NextResponse.json(
				{ message: "Beberapa pertanyaan tidak valid" },
				{ status: 400 }
			);
		}

		console.log("Starting transaction...");

		await prisma.$transaction([
			prisma.jawabanUserKuisVAK.deleteMany({
				where: { userId: user.id }
			}),
			prisma.jawabanUserKuisVAK.createMany({
				data: answers.map(a => ({
					userId: user.id,
					pertanyaanKuisVAKId: a.pertanyaanId,
					jawabanKuisVAKId: a.jawabanKuisVAKId,
				})),
			}),
		]);

		console.log("Transaction completed");

		if (gayaBelajarTerpilih.length === 1) {
			console.log("Updating user gaya belajar:", gayaBelajarTerpilih[0]);
			
			await prisma.user.update({
				where: { id: user.id },
				data: { gayaBelajar: gayaBelajarTerpilih[0] as any }
			});

			return NextResponse.json({
				result: gayaBelajarTerpilih[0],
				needChoose: false,
			});
		}

		return NextResponse.json({
			options: gayaBelajarTerpilih,
			needChoose: true,
		});

	} catch (error) {
		console.error("=== ERROR DETAIL ===");
		console.error("Error:", error);
		console.error("Error name:", error instanceof Error ? error.name : 'Unknown');
		console.error("Error message:", error instanceof Error ? error.message : 'Unknown');
		console.error("Error stack:", error instanceof Error ? error.stack : 'Unknown');
		
		return NextResponse.json({ 
			message: error instanceof Error ? error.message : "Internal Server Error",
			errorType: error instanceof Error ? error.name : 'Unknown',
			...(process.env.NODE_ENV === 'development' && { 
				stack: error instanceof Error ? error.stack : undefined 
			})
		}, { status: 500 });
	}
}