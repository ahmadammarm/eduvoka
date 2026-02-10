import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
	try {
		const session = await auth();
		if (!session?.user) {
			return NextResponse.json(
				{ error: "Unauthorized" },
				{ status: 401 }
			);
		}

		const materiList = await prisma.materi.findMany({
			select: {
				id: true,
				nama: true,
				kategori: true,
				deskripsi: true,
				urutan: true,
				_count: {
					select: {
						soalLatihan: true
					}
				}
			},
			orderBy: {
				urutan: 'asc'
			}
		});

		const categoryOrder = ["PU", "PBM", "PPU", "PK", "LITERASIBINDO", "LITERASIBINGG"];
		const sortedMateri = materiList.sort((a, b) => {
			const indexA = categoryOrder.indexOf(a.kategori);
			const indexB = categoryOrder.indexOf(b.kategori);
			if (indexA !== indexB) return indexA - indexB;
			return a.urutan - b.urutan;
		});

		return NextResponse.json({
			success: true,
			data: sortedMateri
		});

	} catch (error) {
		console.error('Error fetching materi:', error);
		return NextResponse.json(
			{ error: "Internal Server Error" },
			{ status: 500 }
		);
	}
}