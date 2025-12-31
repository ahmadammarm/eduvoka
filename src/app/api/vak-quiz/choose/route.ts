import { auth } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
	try {
		const session = await auth();
		const user = session?.user;

		if (!user) {
			return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
		}

		const { gayaBelajar }: { gayaBelajar: string } = await request.json();

		if (!gayaBelajar) {
			return NextResponse.json(
				{ message: "Gaya belajar tidak boleh kosong" },
				{ status: 400 }
			);
		}

		const validGayaBelajar = ['VISUAL', 'AUDITORY', 'KINESTHETIC'];
		if (!validGayaBelajar.includes(gayaBelajar)) {
			return NextResponse.json(
				{ message: "Gaya belajar tidak valid" },
				{ status: 400 }
			);
		}

		await prisma.user.update({
			where: { id: user.id },
			data: {
				gayaBelajar: gayaBelajar as 'VISUAL' | 'AUDITORY' | 'KINESTHETIC'
			}
		});

		return NextResponse.json({
			message: "Gaya belajar berhasil disimpan",
			gayaBelajar: gayaBelajar
		});

	} catch (error) {
		console.error("Error saving gaya belajar choice:", error);

		return NextResponse.json({
			message: error instanceof Error ? error.message : "Internal Server Error",
			...(process.env.NODE_ENV === 'development' && { error })
		}, { status: 500 });
	}
}