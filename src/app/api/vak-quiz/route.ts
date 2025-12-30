import { prisma } from '@/lib/prisma';
import { auth } from "@/lib/auth"
import { NextResponse } from "next/server";

export async function GET() {
	try {
		const session = await auth();
		const user = session?.user;

		if (!user) {
			return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
		}

		const pertanyaan = await prisma.pertanyaanKuisVAK.findMany({
			include: {
				jawabanKuisVAKs: {
					select: {
						id: true,
						jawaban: true,
						tipeJawaban: true
					}
				}
			},
			orderBy: { createdAt: "asc" },
		});

		return NextResponse.json(pertanyaan);

	} catch (error) {
		return NextResponse.json({ message: error || "Internal Server Error" }, { status: 500 });
	}
}