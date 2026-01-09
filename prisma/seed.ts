import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { GayaBelajar, SoalUTBKType } from "../generated/prisma/enums";
import { MapTypeToSesi } from "@/lib/map-type-to-session";

async function CreateUser() {
	const email = "admineduvoka@example.com";
	const existing = await prisma.user.findUnique({ where: { email } });
	if (existing) return;

	const hashedPassword = await bcrypt.hash("admineduvoka123", 10);
	await prisma.user.create({
		data: {
			email,
			password: hashedPassword,
			name: "Admin User",
		},
	});
}

async function CreatePertanyaanVAK() {
	const pertanyaanData = [
		{
			pertanyaan: "Saya paling suka belajar dengan cara:",
			jawabanKuisVAKs: {
				create: [
					{ jawaban: "Melihat catatan atau gambar", tipeJawaban: GayaBelajar.VISUAL },
					{ jawaban: "Mendengarkan penjelasan", tipeJawaban: GayaBelajar.AUDITORY },
					{ jawaban: "Melakukan langsung", tipeJawaban: GayaBelajar.KINESTHETIC },
				],
			},
		},
		{
			pertanyaan: "Saat membaca, saya biasanya:",
			jawabanKuisVAKs: {
				create: [
					{ jawaban: "Membaca cepat dalam hati", tipeJawaban: GayaBelajar.VISUAL },
					{ jawaban: "Membaca dengan suara", tipeJawaban: GayaBelajar.AUDITORY },
					{ jawaban: "Mengikuti teks dengan jari", tipeJawaban: GayaBelajar.KINESTHETIC },
				],
			},
		},
		{
			pertanyaan: "Saya lebih mudah mengingat jika:",
			jawabanKuisVAKs: {
				create: [
					{ jawaban: "Melihat bentuk atau warna", tipeJawaban: GayaBelajar.VISUAL },
					{ jawaban: "Mendengar penjelasan", tipeJawaban: GayaBelajar.AUDITORY },
					{ jawaban: "Menulis atau bergerak", tipeJawaban: GayaBelajar.KINESTHETIC },
				],
			},
		},
		{
			pertanyaan: "Ketika mencatat pelajaran, saya:",
			jawabanKuisVAKs: {
				create: [
					{ jawaban: "Membuat catatan rapi dan bergambar", tipeJawaban: GayaBelajar.VISUAL },
					{ jawaban: "Lebih fokus mendengarkan", tipeJawaban: GayaBelajar.AUDITORY },
					{ jawaban: "Menulis sambil bergerak", tipeJawaban: GayaBelajar.KINESTHETIC },
				],
			},
		},
		{
			pertanyaan: "Saat menjawab pertanyaan, saya biasanya:",
			jawabanKuisVAKs: {
				create: [
					{ jawaban: "Menjawab singkat", tipeJawaban: GayaBelajar.VISUAL },
					{ jawaban: "Menjelaskan panjang", tipeJawaban: GayaBelajar.AUDITORY },
					{ jawaban: "Menggunakan gerakan tubuh", tipeJawaban: GayaBelajar.KINESTHETIC },
				],
			},
		},
		{
			pertanyaan: "Saat belajar di tempat ramai, saya:",
			jawabanKuisVAKs: {
				create: [
					{ jawaban: "Tetap fokus", tipeJawaban: GayaBelajar.VISUAL },
					{ jawaban: "Mudah terganggu suara", tipeJawaban: GayaBelajar.AUDITORY },
					{ jawaban: "Sulit duduk diam", tipeJawaban: GayaBelajar.KINESTHETIC },
				],
			},
		},
		{
			pertanyaan: "Saya menghafal dengan cara:",
			jawabanKuisVAKs: {
				create: [
					{ jawaban: "Membayangkan", tipeJawaban: GayaBelajar.VISUAL },
					{ jawaban: "Mengucapkan berulang", tipeJawaban: GayaBelajar.AUDITORY },
					{ jawaban: "Berjalan atau bergerak", tipeJawaban: GayaBelajar.KINESTHETIC },
				],
			},
		},
		{
			pertanyaan: "Saat berbicara dengan orang lain, saya lebih suka:",
			jawabanKuisVAKs: {
				create: [
					{ jawaban: "Bertatap muka", tipeJawaban: GayaBelajar.VISUAL },
					{ jawaban: "Berbicara lewat suara", tipeJawaban: GayaBelajar.AUDITORY },
					{ jawaban: "Memperhatikan gerakan tubuh", tipeJawaban: GayaBelajar.KINESTHETIC },
				],
			},
		},
		{
			pertanyaan: "Cara saya berbicara biasanya:",
			jawabanKuisVAKs: {
				create: [
					{ jawaban: "Cepat dan langsung", tipeJawaban: GayaBelajar.VISUAL },
					{ jawaban: "Berirama dan jelas", tipeJawaban: GayaBelajar.AUDITORY },
					{ jawaban: "Pelan dan santai", tipeJawaban: GayaBelajar.KINESTHETIC },
				],
			},
		},
		{
			pertanyaan: "Saat mengikuti petunjuk, saya lebih mudah jika:",
			jawabanKuisVAKs: {
				create: [
					{ jawaban: "Ada contoh gambar", tipeJawaban: GayaBelajar.VISUAL },
					{ jawaban: "Dijelaskan secara lisan", tipeJawaban: GayaBelajar.AUDITORY },
					{ jawaban: "Langsung dicoba", tipeJawaban: GayaBelajar.KINESTHETIC },
				],
			},
		},
		{
			pertanyaan: "Di waktu luang, saya lebih suka:",
			jawabanKuisVAKs: {
				create: [
					{ jawaban: "Menonton video", tipeJawaban: GayaBelajar.VISUAL },
					{ jawaban: "Mendengarkan musik", tipeJawaban: GayaBelajar.AUDITORY },
					{ jawaban: "Bermain atau bergerak", tipeJawaban: GayaBelajar.KINESTHETIC },
				],
			},
		},
		{
			pertanyaan: "Saya lebih mudah paham pelajaran jika:",
			jawabanKuisVAKs: {
				create: [
					{ jawaban: "Melihat contoh", tipeJawaban: GayaBelajar.VISUAL },
					{ jawaban: "Berdiskusi", tipeJawaban: GayaBelajar.AUDITORY },
					{ jawaban: "Melakukan praktik", tipeJawaban: GayaBelajar.KINESTHETIC },
				],
			},
		},
		{
			pertanyaan: "Saya paling tertarik dengan:",
			jawabanKuisVAKs: {
				create: [
					{ jawaban: "Gambar dan warna", tipeJawaban: GayaBelajar.VISUAL },
					{ jawaban: "Suara dan musik", tipeJawaban: GayaBelajar.AUDITORY },
					{ jawaban: "Aktivitas fisik", tipeJawaban: GayaBelajar.KINESTHETIC },
				],
			},
		},
		{
			pertanyaan: "Saat belajar lama, saya biasanya:",
			jawabanKuisVAKs: {
				create: [
					{ jawaban: "Fokus melihat materi", tipeJawaban: GayaBelajar.VISUAL },
					{ jawaban: "Berbicara atau membaca keras", tipeJawaban: GayaBelajar.AUDITORY },
					{ jawaban: "Sering bergerak", tipeJawaban: GayaBelajar.KINESTHETIC },
				],
			},
		},
	];

	for (const pertanyaan of pertanyaanData) {
		const exists = await prisma.pertanyaanKuisVAK.findFirst({
			where: { pertanyaan: pertanyaan.pertanyaan },
		});
		if (exists) continue;

		await prisma.pertanyaanKuisVAK.create({ data: pertanyaan });
	}
}

export async function CreateSoalUTBK() {
	const soalData = [
		{
			id: "soal-pu-1",
			tipe: SoalUTBKType.PU,
			content:
				"Proklamasi kemerdekaan Indonesia dibacakan pada tanggal 17 Agustus 1945. Siapakah yang mengetik naskah proklamasi tersebut?",
			kunciJawaban: "B",
			pilihan: [
				["A", "Soekarno"],
				["B", "Sayuti Melik"],
				["C", "Mohammad Hatta"],
				["D", "Sutan Sjahrir"],
				["E", "Ahmad Soebardjo"],
			],
		},
		{
			id: "soal-pbm-1",
			tipe: SoalUTBKType.PBM,
			content:
				"Ide pokok paragraf adalah gagasan utama yang menjadi dasar pengembangan paragraf. Letak ide pokok biasanya terdapat pada...",
			kunciJawaban: "A",
			pilihan: [
				["A", "Kalimat utama"],
				["B", "Kalimat penjelas"],
				["C", "Kalimat penutup"],
				["D", "Kalimat transisi"],
				["E", "Kalimat contoh"],
			],
		},
		{
			id: "soal-ppu-1",
			tipe: SoalUTBKType.PPU,
			content: "Tujuan utama pembentukan Undang-Undang Dasar 1945 adalah...",
			kunciJawaban: "C",
			pilihan: [
				["A", "Mengatur pajak negara"],
				["B", "Mengatur sistem perdagangan"],
				["C", "Menjadi dasar hukum negara"],
				["D", "Mengatur sistem pendidikan"],
				["E", "Mengatur hubungan internasional"],
			],
		},
		{
			id: "soal-pk-1",
			tipe: SoalUTBKType.PK,
			content: "Jika 2x + 6 = 14, maka nilai x adalah...",
			kunciJawaban: "B",
			pilihan: [
				["A", "2"],
				["B", "4"],
				["C", "6"],
				["D", "8"],
				["E", "10"],
			],
		},
		{
			id: "soal-litindo-1",
			tipe: SoalUTBKType.LITERASIBINDO,
			content:
				"Makna kata \"akurat\" dalam kalimat 'Data yang disajikan harus akurat' adalah...",
			kunciJawaban: "D",
			pilihan: [
				["A", "Cepat"],
				["B", "Menarik"],
				["C", "Lengkap"],
				["D", "Tepat dan benar"],
				["E", "Ringkas"],
			],
		},
		{
			id: "soal-litbing-1",
			tipe: SoalUTBKType.LITERASIBINGG,
			content: "Choose the correct meaning of the word \"reliable\".",
			kunciJawaban: "A",
			pilihan: [
				["A", "Can be trusted"],
				["B", "Very fast"],
				["C", "Expensive"],
				["D", "Beautiful"],
				["E", "Complicated"],
			],
		},
	];

	for (const soal of soalData) {
		await prisma.soalUTBK.upsert({
			where: { id: soal.id },
			update: {},
			create: {
				id: soal.id,
				tipe: soal.tipe,
				tipeSesi: MapTypeToSesi(soal.tipe),
				content: soal.content,
				kunciJawaban: soal.kunciJawaban,

				pilihanJawaban: {
					createMany: {
						data: soal.pilihan.map(([label, text]) => ({
							id: `${soal.id}-${label}`,
							label,
							pilihan: text,
						})),
						skipDuplicates: true,
					},
				},

				pembahasan: {
					createMany: {
						data: [
							{
								id: `${soal.id}-visual`,
								gayaBelajar: GayaBelajar.VISUAL,
								konten: "Penjelasan disajikan dalam bentuk visual dan ringkas.",
								updatedAt: new Date(),
							},
							{
								id: `${soal.id}-auditori`,
								gayaBelajar: GayaBelajar.AUDITORY,
								konten: "Penjelasan disampaikan melalui narasi bertahap.",
								updatedAt: new Date(),
							},
						],
						skipDuplicates: true,
					},
				},
			},
		});
	}
}


async function main() {
	await CreateUser();
	await CreatePertanyaanVAK();
	await CreateSoalUTBK();
}

main()
	.then(() => {
		console.log("Seeding selesai!");
	})
	.catch((e) => {
		console.error(e);
		process.exit(1);
	})
	.finally(async () => {
		await prisma.$disconnect();
		process.exit(0);
	});