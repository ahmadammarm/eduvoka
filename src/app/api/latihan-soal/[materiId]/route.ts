/* eslint-disable @typescript-eslint/no-explicit-any */
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
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

		const { searchParams } = new URL(req.url);
		const tipeSesi = searchParams.get('tipeSesi'); // 'LATIHAN' | 'TRY_OUT'
		const limit = parseInt(searchParams.get('limit') || '10');
		const tingkatKesulitan = searchParams.get('tingkatKesulitan');

		// Validasi materi exists
		const materi = await prisma.materi.findUnique({
			where: { id: materiId }, // Use awaited materiId
			select: {
				id: true,
				nama: true,
				kategori: true,
				deskripsi: true
			}
		});

		if (!materi) {
			return NextResponse.json(
				{ error: "Materi not found" },
				{ status: 404 }
			);
		}

		// Build query filter
		const whereClause: any = {
			materiId: materiId, // Use awaited materiId
			tipe: materi.kategori
		};

		if (tipeSesi) {
			whereClause.tipeSesi = tipeSesi;
		}

		if (tingkatKesulitan) {
			whereClause.tingkatKesulitan = parseInt(tingkatKesulitan);
		}

		// Get soal-soal
		const soalList = await prisma.soalLatihanSoal.findMany({
			where: whereClause,
			include: {
				pilihanJawaban: {
					select: {
						id: true,
						label: true,
						pilihan: true,
					}
				},
				materi: {
					select: {
						id: true,
						nama: true,
						kategori: true
					}
				}
			},
			take: limit,
			orderBy: {
				createdAt: 'desc'
			}
		});

		// Remove kunciJawaban dari response untuk keamanan
		const soalResponse = soalList.map(soal => {
			const { kunciJawaban, ...soalWithoutKunci } = soal;
			return soalWithoutKunci;
		});

		return NextResponse.json({
			success: true,
			data: {
				materi,
				soal: soalResponse,
				total: soalResponse.length
			}
		});

	} catch (error) {
		console.error('Error fetching soal:', error);
		return NextResponse.json(
			{ error: "Internal Server Error" },
			{ status: 500 }
		);
	}
}