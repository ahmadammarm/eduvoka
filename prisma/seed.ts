import bcrypt from "bcryptjs";
import { prisma,} from "../src/lib/prisma";
import { Role, PaketUser, LatihanSoalType, SessionType } from "../src/generated/prisma/enums";

// ==================== USER SEEDER ====================
async function CreateUsers() {
	const users = [
		{
			id: "user-admin-001",
			email: "admineduvoka@example.com",
			password: await bcrypt.hash("admineduvoka123", 10),
			name: "Admin User",
			role: Role.ADMIN,
			paketUser: PaketUser.EDUVOKA,
			isSubscribed: true,
			subscriptionEndAt: new Date("2025-12-31"),
		},
		{
			id: "user-001",
			email: "student1@example.com",
			password: await bcrypt.hash("student123", 10),
			name: "Budi Santoso",
			role: Role.USER,
			paketUser: PaketUser.ACTIVE,
			isSubscribed: true,
			subscriptionEndAt: new Date("2025-06-30"),
		},
		{
			id: "user-002",
			email: "student2@example.com",
			password: await bcrypt.hash("student123", 10),
			name: "Siti Nurhaliza",
			role: Role.USER,
			paketUser: PaketUser.LITE,
			isSubscribed: true,
			subscriptionEndAt: new Date("2025-03-31"),
		},
		{
			id: "user-003",
			email: "student3@example.com",
			password: await bcrypt.hash("student123", 10),
			name: "Ahmad Wijaya",
			role: Role.USER,
			paketUser: PaketUser.BASIC,
			isSubscribed: false,
		},
	];

	for (const user of users) {
		await prisma.user.upsert({
			where: { email: user.email },
			update: {},
			create: user,
		});
	}

	console.log("✅ Users seeded successfully");
}

// ==================== MATERI SEEDER ====================
async function CreateMateri() {
	const materiData = [
		{
			id: "materi-pu-001",
			nama: "Penalaran Logis",
			kategori: LatihanSoalType.PU,
			deskripsi: "Materi tentang penalaran logis, silogisme, dan analisis argumen. Pelajari cara berpikir sistematis dan menarik kesimpulan yang valid.",
			urutan: 1,
		},
		{
			id: "materi-pu-002",
			nama: "Penalaran Analitis",
			kategori: LatihanSoalType.PU,
			deskripsi: "Materi tentang analisis data, grafik, dan tabel untuk pengambilan keputusan.",
			urutan: 2,
		},
		{
			id: "materi-pbm-001",
			nama: "Struktur Paragraf",
			kategori: LatihanSoalType.PBM,
			deskripsi: "Materi tentang ide pokok, kalimat utama, dan pengembangan paragraf yang efektif.",
			urutan: 3,
		},
		{
			id: "materi-pbm-002",
			nama: "Teks Argumentasi",
			kategori: LatihanSoalType.PBM,
			deskripsi: "Materi tentang struktur argumentasi, premis, dan kesimpulan dalam teks.",
			urutan: 4,
		},
		{
			id: "materi-ppu-001",
			nama: "Sejarah Indonesia",
			kategori: LatihanSoalType.PPU,
			deskripsi: "Materi tentang sejarah kemerdekaan dan perkembangan Indonesia dari masa ke masa.",
			urutan: 5,
		},
		{
			id: "materi-ppu-002",
			nama: "Geografi Indonesia",
			kategori: LatihanSoalType.PPU,
			deskripsi: "Materi tentang kondisi geografis, iklim, dan sumber daya alam Indonesia.",
			urutan: 6,
		},
		{
			id: "materi-pk-001",
			nama: "Aljabar Dasar",
			kategori: LatihanSoalType.PK,
			deskripsi: "Materi tentang persamaan linear, kuadrat, dan sistem persamaan.",
			urutan: 7,
		},
		{
			id: "materi-pk-002",
			nama: "Geometri",
			kategori: LatihanSoalType.PK,
			deskripsi: "Materi tentang bangun datar, bangun ruang, dan perhitungan luas serta volume.",
			urutan: 8,
		},
		{
			id: "materi-litindo-001",
			nama: "Pemahaman Kosakata",
			kategori: LatihanSoalType.LITERASIBINDO,
			deskripsi: "Materi tentang makna kata, sinonim, antonim, dan konteks penggunaan dalam Bahasa Indonesia.",
			urutan: 9,
		},
		{
			id: "materi-litindo-002",
			nama: "Bacaan Pemahaman",
			kategori: LatihanSoalType.LITERASIBINDO,
			deskripsi: "Materi tentang teknik membaca cepat dan memahami isi bacaan secara komprehensif.",
			urutan: 10,
		},
	];

	for (const materi of materiData) {
		await prisma.materi.upsert({
			where: { id: materi.id },
			update: {
				nama: materi.nama,
				deskripsi: materi.deskripsi,
				urutan: materi.urutan,
			},
			create: materi,
		});
	}

	console.log("✅ Materi seeded successfully");
}

// ==================== LATIHAN SOAL SEEDER ====================
async function CreateLatihanSoal() {
	// Soal untuk Penalaran Logis (PU)
	const soalPU = [
		{
			id: "latihan-pu-001",
			materiId: "materi-pu-001",
			tipe: LatihanSoalType.PU,
			tipeSesi: SessionType.LATIHAN,
			content: "Semua mahasiswa adalah pelajar. Budi adalah mahasiswa. Kesimpulannya adalah...",
			kunciJawaban: "A",
			tingkatKesulitan: 2,
			pilihan: [
				["A", "Budi adalah pelajar"],
				["B", "Budi bukan pelajar"],
				["C", "Semua pelajar adalah mahasiswa"],
				["D", "Tidak ada kesimpulan"],
				["E", "Budi adalah dosen"],
			],
		},
		{
			id: "latihan-pu-002",
			materiId: "materi-pu-001",
			tipe: LatihanSoalType.PU,
			tipeSesi: SessionType.LATIHAN,
			content: "Jika hari ini hujan, maka jalanan basah. Jalanan tidak basah. Maka...",
			kunciJawaban: "B",
			tingkatKesulitan: 3,
			pilihan: [
				["A", "Hari ini hujan"],
				["B", "Hari ini tidak hujan"],
				["C", "Jalanan kering"],
				["D", "Besok hujan"],
				["E", "Tidak dapat disimpulkan"],
			],
		},
		{
			id: "latihan-pu-003",
			materiId: "materi-pu-001",
			tipe: LatihanSoalType.PU,
			tipeSesi: SessionType.TRY_OUT,
			content: "Semua dokter adalah sarjana. Sebagian sarjana adalah PNS. Kesimpulannya...",
			kunciJawaban: "C",
			tingkatKesulitan: 3,
			pilihan: [
				["A", "Semua dokter adalah PNS"],
				["B", "Semua PNS adalah dokter"],
				["C", "Sebagian dokter mungkin PNS"],
				["D", "Tidak ada dokter yang PNS"],
				["E", "Semua sarjana adalah dokter"],
			],
		},
		{
			id: "latihan-pu-004",
			materiId: "materi-pu-002",
			tipe: LatihanSoalType.PU,
			tipeSesi: SessionType.LATIHAN,
			content: "Tidak ada siswa yang bodoh. Ani adalah siswa. Maka...",
			kunciJawaban: "A",
			tingkatKesulitan: 2,
			pilihan: [
				["A", "Ani tidak bodoh"],
				["B", "Ani bodoh"],
				["C", "Semua siswa pintar"],
				["D", "Ani bukan siswa"],
				["E", "Tidak dapat disimpulkan"],
			],
		},
		{
			id: "latihan-pu-005",
			materiId: "materi-pu-002",
			tipe: LatihanSoalType.PU,
			tipeSesi: SessionType.TRY_OUT,
			content: "Jika A > B dan B > C, maka...",
			kunciJawaban: "D",
			tingkatKesulitan: 1,
			pilihan: [
				["A", "C > A"],
				["B", "A = C"],
				["C", "B > A"],
				["D", "A > C"],
				["E", "C > B"],
			],
		},
	];

	// Soal untuk Struktur Paragraf (PBM)
	const soalPBM = [
		{
			id: "latihan-pbm-001",
			materiId: "materi-pbm-001",
			tipe: LatihanSoalType.PBM,
			tipeSesi: SessionType.LATIHAN,
			content: "Kalimat yang mengandung ide pokok biasanya disebut...",
			kunciJawaban: "A",
			tingkatKesulitan: 1,
			pilihan: [
				["A", "Kalimat utama"],
				["B", "Kalimat penjelas"],
				["C", "Kalimat penutup"],
				["D", "Kalimat transisi"],
				["E", "Kalimat tanya"],
			],
		},
		{
			id: "latihan-pbm-002",
			materiId: "materi-pbm-001",
			tipe: LatihanSoalType.PBM,
			tipeSesi: SessionType.LATIHAN,
			content: "Paragraf yang ide pokoknya terletak di awal paragraf disebut paragraf...",
			kunciJawaban: "B",
			tingkatKesulitan: 2,
			pilihan: [
				["A", "Induktif"],
				["B", "Deduktif"],
				["C", "Campuran"],
				["D", "Naratif"],
				["E", "Deskriptif"],
			],
		},
		{
			id: "latihan-pbm-003",
			materiId: "materi-pbm-002",
			tipe: LatihanSoalType.PBM,
			tipeSesi: SessionType.TRY_OUT,
			content: "Fungsi kalimat penjelas dalam paragraf adalah...",
			kunciJawaban: "C",
			tingkatKesulitan: 2,
			pilihan: [
				["A", "Membuka paragraf"],
				["B", "Menutup paragraf"],
				["C", "Mendukung ide pokok"],
				["D", "Membuat kesimpulan"],
				["E", "Membuat pertanyaan"],
			],
		},
		{
			id: "latihan-pbm-004",
			materiId: "materi-pbm-002",
			tipe: LatihanSoalType.PBM,
			tipeSesi: SessionType.LATIHAN,
			content: "Paragraf yang ide pokoknya di akhir disebut paragraf...",
			kunciJawaban: "A",
			tingkatKesulitan: 2,
			pilihan: [
				["A", "Induktif"],
				["B", "Deduktif"],
				["C", "Campuran"],
				["D", "Argumentatif"],
				["E", "Persuasif"],
			],
		},
	];

	// Soal untuk Sejarah Indonesia (PPU)
	const soalPPU = [
		{
			id: "latihan-ppu-001",
			materiId: "materi-ppu-001",
			tipe: LatihanSoalType.PPU,
			tipeSesi: SessionType.LATIHAN,
			content: "Organisasi pergerakan nasional pertama di Indonesia adalah...",
			kunciJawaban: "B",
			tingkatKesulitan: 2,
			pilihan: [
				["A", "Sarekat Islam"],
				["B", "Budi Utomo"],
				["C", "Muhammadiyah"],
				["D", "Indische Partij"],
				["E", "PNI"],
			],
		},
		{
			id: "latihan-ppu-002",
			materiId: "materi-ppu-001",
			tipe: LatihanSoalType.PPU,
			tipeSesi: SessionType.LATIHAN,
			content: "Peristiwa Rengasdengklok terjadi pada tanggal...",
			kunciJawaban: "A",
			tingkatKesulitan: 3,
			pilihan: [
				["A", "16 Agustus 1945"],
				["B", "17 Agustus 1945"],
				["C", "18 Agustus 1945"],
				["D", "15 Agustus 1945"],
				["E", "19 Agustus 1945"],
			],
		},
		{
			id: "latihan-ppu-003",
			materiId: "materi-ppu-002",
			tipe: LatihanSoalType.PPU,
			tipeSesi: SessionType.TRY_OUT,
			content: "Konferensi Meja Bundar (KMB) menghasilkan keputusan...",
			kunciJawaban: "C",
			tingkatKesulitan: 3,
			pilihan: [
				["A", "Indonesia merdeka penuh"],
				["B", "Belanda tetap berkuasa"],
				["C", "Pengakuan kedaulatan Indonesia"],
				["D", "Pembentukan federasi"],
				["E", "Perang berlanjut"],
			],
		},
	];

	// Soal untuk Aljabar Dasar (PK)
	const soalPK = [
		{
			id: "latihan-pk-001",
			materiId: "materi-pk-001",
			tipe: LatihanSoalType.PK,
			tipeSesi: SessionType.LATIHAN,
			content: "Jika 3x + 5 = 20, maka nilai x adalah...",
			kunciJawaban: "C",
			tingkatKesulitan: 2,
			pilihan: [
				["A", "3"],
				["B", "4"],
				["C", "5"],
				["D", "6"],
				["E", "7"],
			],
		},
		{
			id: "latihan-pk-002",
			materiId: "materi-pk-001",
			tipe: LatihanSoalType.PK,
			tipeSesi: SessionType.LATIHAN,
			content: "Hasil dari (x + 3)(x - 3) adalah...",
			kunciJawaban: "B",
			tingkatKesulitan: 2,
			pilihan: [
				["A", "x² + 9"],
				["B", "x² - 9"],
				["C", "x² - 6x + 9"],
				["D", "x² + 6x - 9"],
				["E", "2x"],
			],
		},
		{
			id: "latihan-pk-003",
			materiId: "materi-pk-002",
			tipe: LatihanSoalType.PK,
			tipeSesi: SessionType.TRY_OUT,
			content: "Luas persegi panjang dengan panjang 8 cm dan lebar 5 cm adalah...",
			kunciJawaban: "D",
			tingkatKesulitan: 1,
			pilihan: [
				["A", "13 cm²"],
				["B", "26 cm²"],
				["C", "30 cm²"],
				["D", "40 cm²"],
				["E", "48 cm²"],
			],
		},
	];

	// Soal untuk Literasi Indonesia
	const soalLitIndo = [
		{
			id: "latihan-litindo-001",
			materiId: "materi-litindo-001",
			tipe: LatihanSoalType.LITERASIBINDO,
			tipeSesi: SessionType.LATIHAN,
			content: "Sinonim dari kata \"antusias\" adalah...",
			kunciJawaban: "C",
			tingkatKesulitan: 2,
			pilihan: [
				["A", "Malas"],
				["B", "Ragu"],
				["C", "Bersemangat"],
				["D", "Takut"],
				["E", "Sedih"],
			],
		},
		{
			id: "latihan-litindo-002",
			materiId: "materi-litindo-001",
			tipe: LatihanSoalType.LITERASIBINDO,
			tipeSesi: SessionType.LATIHAN,
			content: "Antonim dari kata \"optimis\" adalah...",
			kunciJawaban: "B",
			tingkatKesulitan: 2,
			pilihan: [
				["A", "Gembira"],
				["B", "Pesimis"],
				["C", "Senang"],
				["D", "Bahagia"],
				["E", "Ceria"],
			],
		},
		{
			id: "latihan-litindo-003",
			materiId: "materi-litindo-002",
			tipe: LatihanSoalType.LITERASIBINDO,
			tipeSesi: SessionType.TRY_OUT,
			content: "Makna kata \"empiris\" adalah...",
			kunciJawaban: "D",
			tingkatKesulitan: 3,
			pilihan: [
				["A", "Berdasarkan teori"],
				["B", "Berdasarkan asumsi"],
				["C", "Berdasarkan opini"],
				["D", "Berdasarkan pengalaman"],
				["E", "Berdasarkan dongeng"],
			],
		},
	];

	const allSoal = [...soalPU, ...soalPBM, ...soalPPU, ...soalPK, ...soalLitIndo];

	for (const soal of allSoal) {
		await prisma.soalLatihanSoal.upsert({
			where: { id: soal.id },
			update: {
				content: soal.content,
				kunciJawaban: soal.kunciJawaban,
				tingkatKesulitan: soal.tingkatKesulitan,
			},
			create: {
				id: soal.id,
				materiId: soal.materiId,
				tipe: soal.tipe,
				tipeSesi: soal.tipeSesi,
				content: soal.content,
				kunciJawaban: soal.kunciJawaban,
				tingkatKesulitan: soal.tingkatKesulitan,

				pilihanJawaban: {
					createMany: {
						data: soal.pilihan.map(([label, text]) => ({
							id: `${soal.id}-${label}`,
							soalUTBKId: soal.id,
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
								id: `${soal.id}-pembahasan`,
								konten: `<div class="pembahasan">
									<h4>Pembahasan</h4>
									<p>Jawaban yang benar adalah <strong>${soal.kunciJawaban}</strong>.</p>
									<p>Penjelasan: ${soal.content}</p>
								</div>`,
							},
						],
						skipDuplicates: true,
					},
				},
			},
		});
	}

	console.log("✅ Latihan Soal seeded successfully");
}

// ==================== MAIN SEEDER ====================
async function main() {
	console.log("🌱 Starting comprehensive seeding...");

	await CreateUsers();
	await CreateMateri();
	await CreateLatihanSoal();

	console.log("🎉 Seeding completed!");
}

main()
	.then(() => {
		console.log("✨ All done!");
	})
	.catch((e) => {
		console.error("❌ Error during seeding:", e);
		process.exit(1);
	})
	.finally(async () => {
		await prisma.$disconnect();
		process.exit(0);
	});