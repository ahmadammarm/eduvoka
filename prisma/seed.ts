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
			pertanyaan:
				"Ketika saya belajar sesuatu yang baru, saya lebih suka:",
			jawabanKuisVAKs: {
				create: [
					{
						jawaban:
							"Melihat diagram atau gambar yang menjelaskan konsep tersebut.",
						tipeJawaban: GayaBelajar.VISUAL,
					},
					{
						jawaban:
							"Mendengarkan penjelasan atau ceramah tentang konsep tersebut.",
						tipeJawaban: GayaBelajar.AUDITORY,
					},
					{
						jawaban:
							"Melakukan praktik langsung atau eksperimen terkait konsep tersebut.",
						tipeJawaban: GayaBelajar.KINESTHETIC,
					},
				],
			},
		},
		{
			pertanyaan: "Dalam situasi sosial, saya cenderung:",
			jawabanKuisVAKs: {
				create: [
					{
						jawaban:
							"Mengamati dan memperhatikan apa yang terjadi di sekitar saya.",
						tipeJawaban: GayaBelajar.VISUAL,
					},
					{
						jawaban:
							"Mendengarkan apa yang dikatakan orang lain dan berdiskusi.",
						tipeJawaban: GayaBelajar.AUDITORY,
					},
					{
						jawaban:
							"Terlibat langsung dalam aktivitas atau interaksi sosial.",
						tipeJawaban: GayaBelajar.KINESTHETIC,
					},
				],
			},
		},
	];

	for (const pertanyaan of pertanyaanData) {
		await prisma.pertanyaanKuisVAK.create({
			data: pertanyaan,
		});
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