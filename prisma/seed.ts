import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { GayaBelajar } from "../generated/prisma/enums";

async function CreateUser() {
	const hashedPassword = await bcrypt.hash("admineduvoka123", 10);

	await prisma.user.create({
		data: {
			email: "admineduvoka@example.com",
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
		await prisma.pertanyaanKuisVAK.create({ data: pertanyaan });
	}
}

async function main() {
	await CreateUser();
	await CreatePertanyaanVAK();
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