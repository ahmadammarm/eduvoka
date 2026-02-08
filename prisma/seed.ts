import bcrypt from "bcryptjs";
import { prisma } from "../src/lib/prisma";
import { Role, PaketUser, LatihanSoalType, SessionType } from "../src/generated/prisma/enums";

// ==================== USER SEEDER ====================
async function CreateUsers() {
	console.log("👤 Seeding Users...");
	
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
		console.log(`  ✓ User: ${user.email}`);
	}

	console.log("✅ Users seeded successfully\n");
}

// ==================== MATERI SEEDER ====================
async function CreateMateri() {
	console.log("📚 Seeding Materi...");
	
	const materiData = [
		{
			id: "materi-pu-001",
			nama: "Penalaran Logis",
			kategori: LatihanSoalType.PU,
			deskripsi:
				"Materi tentang penalaran logis, silogisme, dan analisis argumen. Pelajari cara berpikir sistematis dan menarik kesimpulan yang valid.",
			urutan: 1,
		},
		{
			id: "materi-pu-002",
			nama: "Penalaran Analitis",
			kategori: LatihanSoalType.PU,
			deskripsi:
				"Materi tentang analisis data, grafik, dan tabel untuk pengambilan keputusan.",
			urutan: 2,
		},
		{
			id: "materi-pbm-001",
			nama: "Struktur Paragraf",
			kategori: LatihanSoalType.PBM,
			deskripsi:
				"Materi tentang ide pokok, kalimat utama, dan pengembangan paragraf yang efektif.",
			urutan: 3,
		},
		{
			id: "materi-pbm-002",
			nama: "Teks Argumentasi",
			kategori: LatihanSoalType.PBM,
			deskripsi:
				"Materi tentang struktur argumentasi, premis, dan kesimpulan dalam teks.",
			urutan: 4,
		},
		{
			id: "materi-ppu-001",
			nama: "Sejarah Indonesia",
			kategori: LatihanSoalType.PPU,
			deskripsi:
				"Materi tentang sejarah kemerdekaan dan perkembangan Indonesia dari masa ke masa.",
			urutan: 5,
		},
		{
			id: "materi-ppu-002",
			nama: "Geografi Indonesia",
			kategori: LatihanSoalType.PPU,
			deskripsi:
				"Materi tentang kondisi geografis, iklim, dan sumber daya alam Indonesia.",
			urutan: 6,
		},
		{
			id: "materi-pk-001",
			nama: "Aljabar Dasar",
			kategori: LatihanSoalType.PK,
			deskripsi:
				"Materi tentang persamaan linear, kuadrat, dan sistem persamaan.",
			urutan: 7,
		},
		{
			id: "materi-pk-002",
			nama: "Geometri",
			kategori: LatihanSoalType.PK,
			deskripsi:
				"Materi tentang bangun datar, bangun ruang, dan perhitungan luas serta volume.",
			urutan: 8,
		},
		{
			id: "materi-litindo-001",
			nama: "Pemahaman Kosakata",
			kategori: LatihanSoalType.LITERASIBINDO,
			deskripsi:
				"Materi tentang makna kata, sinonim, antonim, dan konteks penggunaan dalam Bahasa Indonesia.",
			urutan: 9,
		},
		{
			id: "materi-litindo-002",
			nama: "Bacaan Pemahaman",
			kategori: LatihanSoalType.LITERASIBINDO,
			deskripsi:
				"Materi tentang teknik membaca cepat dan memahami isi bacaan secara komprehensif.",
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
		console.log(`  ✓ Materi: ${materi.nama}`);
	}

	console.log("✅ Materi seeded successfully\n");
}

// ==================== LATIHAN SOAL SEEDER ====================
async function CreateLatihanSoal() {
	console.log("📝 Seeding Latihan Soal...");
	
	// ========== PENALARAN LOGIS (15 soal) ==========
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
			tipeSesi: SessionType.LATIHAN,
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
			materiId: "materi-pu-001",
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
			materiId: "materi-pu-001",
			tipe: LatihanSoalType.PU,
			tipeSesi: SessionType.LATIHAN,
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
		{
			id: "latihan-pu-006",
			materiId: "materi-pu-001",
			tipe: LatihanSoalType.PU,
			tipeSesi: SessionType.LATIHAN,
			content: "Semua burung memiliki sayap. Pinguin memiliki sayap. Kesimpulannya...",
			kunciJawaban: "E",
			tingkatKesulitan: 2,
			pilihan: [
				["A", "Pinguin adalah burung"],
				["B", "Semua yang bersayap adalah burung"],
				["C", "Pinguin bisa terbang"],
				["D", "Burung tidak bisa berenang"],
				["E", "Pinguin mungkin burung"],
			],
		},
		{
			id: "latihan-pu-007",
			materiId: "materi-pu-001",
			tipe: LatihanSoalType.PU,
			tipeSesi: SessionType.TRY_OUT,
			content: "Jika rajin belajar, maka nilai bagus. Nilai tidak bagus. Maka...",
			kunciJawaban: "B",
			tingkatKesulitan: 3,
			pilihan: [
				["A", "Rajin belajar"],
				["B", "Tidak rajin belajar"],
				["C", "Nilai bagus"],
				["D", "Malas belajar"],
				["E", "Tidak dapat disimpulkan"],
			],
		},
		{
			id: "latihan-pu-008",
			materiId: "materi-pu-001",
			tipe: LatihanSoalType.PU,
			tipeSesi: SessionType.TRY_OUT,
			content: "Tidak ada ikan yang hidup di darat. Paus hidup di air. Kesimpulannya...",
			kunciJawaban: "E",
			tingkatKesulitan: 3,
			pilihan: [
				["A", "Paus adalah ikan"],
				["B", "Paus bukan ikan"],
				["C", "Semua yang di air adalah ikan"],
				["D", "Ikan hanya hidup di air"],
				["E", "Tidak dapat disimpulkan apakah paus ikan"],
			],
		},
		{
			id: "latihan-pu-009",
			materiId: "materi-pu-001",
			tipe: LatihanSoalType.PU,
			tipeSesi: SessionType.LATIHAN,
			content: "Semua kucing adalah mamalia. Beberapa mamalia berkaki empat. Maka...",
			kunciJawaban: "C",
			tingkatKesulitan: 2,
			pilihan: [
				["A", "Semua kucing berkaki empat"],
				["B", "Semua mamalia adalah kucing"],
				["C", "Beberapa kucing mungkin berkaki empat"],
				["D", "Tidak ada kucing berkaki empat"],
				["E", "Mamalia pasti kucing"],
			],
		},
		{
			id: "latihan-pu-010",
			materiId: "materi-pu-001",
			tipe: LatihanSoalType.PU,
			tipeSesi: SessionType.LATIHAN,
			content: "Jika X = Y dan Y = Z, maka...",
			kunciJawaban: "A",
			tingkatKesulitan: 1,
			pilihan: [
				["A", "X = Z"],
				["B", "X ≠ Z"],
				["C", "X > Z"],
				["D", "X < Z"],
				["E", "Tidak dapat disimpulkan"],
			],
		},
		{
			id: "latihan-pu-011",
			materiId: "materi-pu-002",
			tipe: LatihanSoalType.PU,
			tipeSesi: SessionType.LATIHAN,
			content: "Dalam sebuah barisan: 2, 4, 8, 16, ... Angka berikutnya adalah...",
			kunciJawaban: "C",
			tingkatKesulitan: 2,
			pilihan: [
				["A", "20"],
				["B", "24"],
				["C", "32"],
				["D", "36"],
				["E", "40"],
			],
		},
		{
			id: "latihan-pu-012",
			materiId: "materi-pu-002",
			tipe: LatihanSoalType.PU,
			tipeSesi: SessionType.LATIHAN,
			content: "Barisan: 5, 10, 20, 40, ... Pola yang digunakan adalah...",
			kunciJawaban: "A",
			tingkatKesulitan: 2,
			pilihan: [
				["A", "Dikali 2"],
				["B", "Ditambah 5"],
				["C", "Dikuadratkan"],
				["D", "Ditambah 10"],
				["E", "Dikali 3"],
			],
		},
		{
			id: "latihan-pu-013",
			materiId: "materi-pu-002",
			tipe: LatihanSoalType.PU,
			tipeSesi: SessionType.TRY_OUT,
			content: "Jika semua A adalah B, dan semua B adalah C, maka...",
			kunciJawaban: "B",
			tingkatKesulitan: 2,
			pilihan: [
				["A", "Beberapa A adalah C"],
				["B", "Semua A adalah C"],
				["C", "Tidak ada A yang C"],
				["D", "Semua C adalah A"],
				["E", "Tidak dapat disimpulkan"],
			],
		},
		{
			id: "latihan-pu-014",
			materiId: "materi-pu-002",
			tipe: LatihanSoalType.PU,
			tipeSesi: SessionType.TRY_OUT,
			content: "Dalam sebuah grafik, jika X meningkat maka Y menurun. Hubungan ini disebut...",
			kunciJawaban: "D",
			tingkatKesulitan: 3,
			pilihan: [
				["A", "Korelasi positif"],
				["B", "Tidak berkorelasi"],
				["C", "Kausalitas"],
				["D", "Korelasi negatif"],
				["E", "Korelasi linear"],
			],
		},
		{
			id: "latihan-pu-015",
			materiId: "materi-pu-002",
			tipe: LatihanSoalType.PU,
			tipeSesi: SessionType.TRY_OUT,
			content: "Barisan: 1, 1, 2, 3, 5, 8, ... Angka berikutnya adalah...",
			kunciJawaban: "C",
			tingkatKesulitan: 3,
			pilihan: [
				["A", "10"],
				["B", "11"],
				["C", "13"],
				["D", "15"],
				["E", "16"],
			],
		},
	];

	// ========== STRUKTUR PARAGRAF & TEKS ARGUMENTASI (15 soal) ==========
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
			materiId: "materi-pbm-001",
			tipe: LatihanSoalType.PBM,
			tipeSesi: SessionType.LATIHAN,
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
			materiId: "materi-pbm-001",
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
		{
			id: "latihan-pbm-005",
			materiId: "materi-pbm-001",
			tipe: LatihanSoalType.PBM,
			tipeSesi: SessionType.LATIHAN,
			content: "Ciri utama paragraf yang baik adalah...",
			kunciJawaban: "D",
			tingkatKesulitan: 2,
			pilihan: [
				["A", "Panjang"],
				["B", "Banyak kata"],
				["C", "Rumit"],
				["D", "Koheren dan kohesif"],
				["E", "Banyak istilah"],
			],
		},
		{
			id: "latihan-pbm-006",
			materiId: "materi-pbm-001",
			tipe: LatihanSoalType.PBM,
			tipeSesi: SessionType.TRY_OUT,
			content: "Paragraf yang ide pokoknya berada di awal dan akhir disebut...",
			kunciJawaban: "C",
			tingkatKesulitan: 3,
			pilihan: [
				["A", "Induktif"],
				["B", "Deduktif"],
				["C", "Campuran"],
				["D", "Naratif"],
				["E", "Deskriptif"],
			],
		},
		{
			id: "latihan-pbm-007",
			materiId: "materi-pbm-001",
			tipe: LatihanSoalType.PBM,
			tipeSesi: SessionType.TRY_OUT,
			content: "Konjungsi yang menunjukkan hubungan sebab-akibat adalah...",
			kunciJawaban: "B",
			tingkatKesulitan: 2,
			pilihan: [
				["A", "Tetapi"],
				["B", "Karena"],
				["C", "Dan"],
				["D", "Atau"],
				["E", "Namun"],
			],
		},
		{
			id: "latihan-pbm-008",
			materiId: "materi-pbm-002",
			tipe: LatihanSoalType.PBM,
			tipeSesi: SessionType.LATIHAN,
			content: "Struktur teks argumentasi yang benar adalah...",
			kunciJawaban: "A",
			tingkatKesulitan: 2,
			pilihan: [
				["A", "Tesis - Argumen - Penegasan ulang"],
				["B", "Orientasi - Komplikasi - Resolusi"],
				["C", "Pembuka - Isi - Penutup"],
				["D", "Pernyataan - Data - Kesimpulan"],
				["E", "Judul - Paragraf - Akhir"],
			],
		},
		{
			id: "latihan-pbm-009",
			materiId: "materi-pbm-002",
			tipe: LatihanSoalType.PBM,
			tipeSesi: SessionType.LATIHAN,
			content: "Tesis dalam teks argumentasi berfungsi sebagai...",
			kunciJawaban: "C",
			tingkatKesulitan: 2,
			pilihan: [
				["A", "Penutup"],
				["B", "Data pendukung"],
				["C", "Pernyataan pendapat"],
				["D", "Kesimpulan"],
				["E", "Daftar pustaka"],
			],
		},
		{
			id: "latihan-pbm-010",
			materiId: "materi-pbm-002",
			tipe: LatihanSoalType.PBM,
			tipeSesi: SessionType.LATIHAN,
			content: "Argumen yang baik harus didukung oleh...",
			kunciJawaban: "D",
			tingkatKesulitan: 2,
			pilihan: [
				["A", "Opini pribadi"],
				["B", "Asumsi"],
				["C", "Gossip"],
				["D", "Fakta dan data"],
				["E", "Cerita"],
			],
		},
		{
			id: "latihan-pbm-011",
			materiId: "materi-pbm-002",
			tipe: LatihanSoalType.PBM,
			tipeSesi: SessionType.TRY_OUT,
			content: "Ciri khas teks argumentasi adalah...",
			kunciJawaban: "B",
			tingkatKesulitan: 3,
			pilihan: [
				["A", "Menghibur pembaca"],
				["B", "Meyakinkan pembaca"],
				["C", "Mendeskripsikan sesuatu"],
				["D", "Menceritakan pengalaman"],
				["E", "Memberikan instruksi"],
			],
		},
		{
			id: "latihan-pbm-012",
			materiId: "materi-pbm-002",
			tipe: LatihanSoalType.PBM,
			tipeSesi: SessionType.TRY_OUT,
			content: "Penegasan ulang dalam teks argumentasi bertujuan untuk...",
			kunciJawaban: "A",
			tingkatKesulitan: 3,
			pilihan: [
				["A", "Memperkuat pendapat"],
				["B", "Membuka topik baru"],
				["C", "Mengkritik lawan"],
				["D", "Menghibur pembaca"],
				["E", "Memberikan data tambahan"],
			],
		},
		{
			id: "latihan-pbm-013",
			materiId: "materi-pbm-002",
			tipe: LatihanSoalType.PBM,
			tipeSesi: SessionType.LATIHAN,
			content: "Kata yang menunjukkan pendapat dalam argumentasi adalah...",
			kunciJawaban: "C",
			tingkatKesulitan: 2,
			pilihan: [
				["A", "Adalah"],
				["B", "Terdapat"],
				["C", "Menurut saya"],
				["D", "Berdasarkan"],
				["E", "Terbukti"],
			],
		},
		{
			id: "latihan-pbm-014",
			materiId: "materi-pbm-002",
			tipe: LatihanSoalType.PBM,
			tipeSesi: SessionType.TRY_OUT,
			content: "Konjungsi yang tepat untuk menyatakan pertentangan adalah...",
			kunciJawaban: "E",
			tingkatKesulitan: 2,
			pilihan: [
				["A", "Lalu"],
				["B", "Kemudian"],
				["C", "Sehingga"],
				["D", "Oleh karena itu"],
				["E", "Namun"],
			],
		},
		{
			id: "latihan-pbm-015",
			materiId: "materi-pbm-002",
			tipe: LatihanSoalType.PBM,
			tipeSesi: SessionType.TRY_OUT,
			content: "Bagian yang berisi penguatan argumen dengan data adalah...",
			kunciJawaban: "B",
			tingkatKesulitan: 3,
			pilihan: [
				["A", "Tesis"],
				["B", "Argumentasi"],
				["C", "Orientasi"],
				["D", "Abstrak"],
				["E", "Koda"],
			],
		},
	];

	// ========== SEJARAH & GEOGRAFI INDONESIA (15 soal) ==========
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
			materiId: "materi-ppu-001",
			tipe: LatihanSoalType.PPU,
			tipeSesi: SessionType.LATIHAN,
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
		{
			id: "latihan-ppu-004",
			materiId: "materi-ppu-001",
			tipe: LatihanSoalType.PPU,
			tipeSesi: SessionType.LATIHAN,
			content: "Proklamasi kemerdekaan Indonesia dibacakan oleh...",
			kunciJawaban: "A",
			tingkatKesulitan: 1,
			pilihan: [
				["A", "Soekarno-Hatta"],
				["B", "Soekarno-Sjahrir"],
				["C", "Hatta-Sjahrir"],
				["D", "Soekarno saja"],
				["E", "Hatta saja"],
			],
		},
		{
			id: "latihan-ppu-005",
			materiId: "materi-ppu-001",
			tipe: LatihanSoalType.PPU,
			tipeSesi: SessionType.LATIHAN,
			content: "Sumpah Pemuda dideklarasikan pada tahun...",
			kunciJawaban: "D",
			tingkatKesulitan: 2,
			pilihan: [
				["A", "1908"],
				["B", "1920"],
				["C", "1926"],
				["D", "1928"],
				["E", "1945"],
			],
		},
		{
			id: "latihan-ppu-006",
			materiId: "materi-ppu-001",
			tipe: LatihanSoalType.PPU,
			tipeSesi: SessionType.TRY_OUT,
			content: "Agresi Militer Belanda I terjadi pada tahun...",
			kunciJawaban: "B",
			tingkatKesulitan: 3,
			pilihan: [
				["A", "1946"],
				["B", "1947"],
				["C", "1948"],
				["D", "1949"],
				["E", "1950"],
			],
		},
		{
			id: "latihan-ppu-007",
			materiId: "materi-ppu-001",
			tipe: LatihanSoalType.PPU,
			tipeSesi: SessionType.TRY_OUT,
			content: "Perjanjian Linggarjati menghasilkan kesepakatan...",
			kunciJawaban: "C",
			tingkatKesulitan: 3,
			pilihan: [
				["A", "Belanda mengakui kemerdekaan penuh Indonesia"],
				["B", "Indonesia menjadi negara federal"],
				["C", "Belanda mengakui RI atas Jawa, Madura, Sumatra"],
				["D", "Perang dihentikan total"],
				["E", "Indonesia kembali dijajah"],
			],
		},
		{
			id: "latihan-ppu-008",
			materiId: "materi-ppu-002",
			tipe: LatihanSoalType.PPU,
			tipeSesi: SessionType.LATIHAN,
			content: "Indonesia terletak di antara dua benua, yaitu...",
			kunciJawaban: "A",
			tingkatKesulitan: 1,
			pilihan: [
				["A", "Asia dan Australia"],
				["B", "Asia dan Afrika"],
				["C", "Australia dan Amerika"],
				["D", "Asia dan Eropa"],
				["E", "Afrika dan Australia"],
			],
		},
		{
			id: "latihan-ppu-009",
			materiId: "materi-ppu-002",
			tipe: LatihanSoalType.PPU,
			tipeSesi: SessionType.LATIHAN,
			content: "Gunung tertinggi di Indonesia adalah...",
			kunciJawaban: "C",
			tingkatKesulitan: 2,
			pilihan: [
				["A", "Gunung Semeru"],
				["B", "Gunung Rinjani"],
				["C", "Puncak Jaya"],
				["D", "Gunung Kerinci"],
				["E", "Gunung Merapi"],
			],
		},
		{
			id: "latihan-ppu-010",
			materiId: "materi-ppu-002",
			tipe: LatihanSoalType.PPU,
			tipeSesi: SessionType.LATIHAN,
			content: "Indonesia memiliki iklim...",
			kunciJawaban: "B",
			tingkatKesulitan: 1,
			pilihan: [
				["A", "Subtropis"],
				["B", "Tropis"],
				["C", "Kutub"],
				["D", "Sedang"],
				["E", "Dingin"],
			],
		},
		{
			id: "latihan-ppu-011",
			materiId: "materi-ppu-002",
			tipe: LatihanSoalType.PPU,
			tipeSesi: SessionType.TRY_OUT,
			content: "Pulau terbesar di Indonesia adalah...",
			kunciJawaban: "D",
			tingkatKesulitan: 2,
			pilihan: [
				["A", "Jawa"],
				["B", "Sumatra"],
				["C", "Sulawesi"],
				["D", "Kalimantan"],
				["E", "Papua"],
			],
		},
		{
			id: "latihan-ppu-012",
			materiId: "materi-ppu-002",
			tipe: LatihanSoalType.PPU,
			tipeSesi: SessionType.TRY_OUT,
			content: "Indonesia terletak di antara dua samudra, yaitu...",
			kunciJawaban: "A",
			tingkatKesulitan: 2,
			pilihan: [
				["A", "Pasifik dan Hindia"],
				["B", "Atlantik dan Hindia"],
				["C", "Pasifik dan Atlantik"],
				["D", "Hindia dan Arktik"],
				["E", "Pasifik dan Arktik"],
			],
		},
		{
			id: "latihan-ppu-013",
			materiId: "materi-ppu-002",
			tipe: LatihanSoalType.PPU,
			tipeSesi: SessionType.LATIHAN,
			content: "Indonesia dilalui oleh garis...",
			kunciJawaban: "C",
			tingkatKesulitan: 2,
			pilihan: [
				["A", "Lintang utara"],
				["B", "Kutub selatan"],
				["C", "Khatulistiwa"],
				["D", "Bujur barat"],
				["E", "Meridian"],
			],
		},
		{
			id: "latihan-ppu-014",
			materiId: "materi-ppu-002",
			tipe: LatihanSoalType.PPU,
			tipeSesi: SessionType.TRY_OUT,
			content: "Hasil tambang utama Indonesia adalah...",
			kunciJawaban: "E",
			tingkatKesulitan: 2,
			pilihan: [
				["A", "Berlian"],
				["B", "Platinum"],
				["C", "Perak"],
				["D", "Uranium"],
				["E", "Minyak bumi, gas, batubara"],
			],
		},
		{
			id: "latihan-ppu-015",
			materiId: "materi-ppu-002",
			tipe: LatihanSoalType.PPU,
			tipeSesi: SessionType.TRY_OUT,
			content: "Indonesia memiliki ... zona waktu.",
			kunciJawaban: "B",
			tingkatKesulitan: 2,
			pilihan: [
				["A", "2"],
				["B", "3"],
				["C", "4"],
				["D", "5"],
				["E", "6"],
			],
		},
	];

	// ========== ALJABAR & GEOMETRI (15 soal) ==========
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
			materiId: "materi-pk-001",
			tipe: LatihanSoalType.PK,
			tipeSesi: SessionType.LATIHAN,
			content: "Jika 2x - 7 = 13, maka x = ...",
			kunciJawaban: "D",
			tingkatKesulitan: 2,
			pilihan: [
				["A", "5"],
				["B", "7"],
				["C", "8"],
				["D", "10"],
				["E", "12"],
			],
		},
		{
			id: "latihan-pk-004",
			materiId: "materi-pk-001",
			tipe: LatihanSoalType.PK,
			tipeSesi: SessionType.LATIHAN,
			content: "Hasil dari (x + 2)² adalah...",
			kunciJawaban: "A",
			tingkatKesulitan: 2,
			pilihan: [
				["A", "x² + 4x + 4"],
				["B", "x² + 2x + 4"],
				["C", "x² + 4"],
				["D", "x² + 2x + 2"],
				["E", "x² + 4x + 2"],
			],
		},
		{
			id: "latihan-pk-005",
			materiId: "materi-pk-001",
			tipe: LatihanSoalType.PK,
			tipeSesi: SessionType.TRY_OUT,
			content: "Akar-akar dari persamaan x² - 5x + 6 = 0 adalah...",
			kunciJawaban: "C",
			tingkatKesulitan: 3,
			pilihan: [
				["A", "1 dan 6"],
				["B", "1 dan 5"],
				["C", "2 dan 3"],
				["D", "3 dan 4"],
				["E", "4 dan 5"],
			],
		},
		{
			id: "latihan-pk-006",
			materiId: "materi-pk-001",
			tipe: LatihanSoalType.PK,
			tipeSesi: SessionType.TRY_OUT,
			content: "Jika x + y = 10 dan x - y = 2, maka x = ...",
			kunciJawaban: "D",
			tingkatKesulitan: 3,
			pilihan: [
				["A", "4"],
				["B", "5"],
				["C", "5.5"],
				["D", "6"],
				["E", "7"],
			],
		},
		{
			id: "latihan-pk-007",
			materiId: "materi-pk-001",
			tipe: LatihanSoalType.PK,
			tipeSesi: SessionType.LATIHAN,
			content: "Bentuk sederhana dari 3x + 2x - x adalah...",
			kunciJawaban: "B",
			tingkatKesulitan: 1,
			pilihan: [
				["A", "3x"],
				["B", "4x"],
				["C", "5x"],
				["D", "6x"],
				["E", "x"],
			],
		},
		{
			id: "latihan-pk-008",
			materiId: "materi-pk-002",
			tipe: LatihanSoalType.PK,
			tipeSesi: SessionType.LATIHAN,
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
		{
			id: "latihan-pk-009",
			materiId: "materi-pk-002",
			tipe: LatihanSoalType.PK,
			tipeSesi: SessionType.LATIHAN,
			content: "Keliling lingkaran dengan jari-jari 7 cm (π = 22/7) adalah...",
			kunciJawaban: "C",
			tingkatKesulitan: 2,
			pilihan: [
				["A", "22 cm"],
				["B", "38 cm"],
				["C", "44 cm"],
				["D", "88 cm"],
				["E", "154 cm"],
			],
		},
		{
			id: "latihan-pk-010",
			materiId: "materi-pk-002",
			tipe: LatihanSoalType.PK,
			tipeSesi: SessionType.LATIHAN,
			content: "Volume kubus dengan sisi 4 cm adalah...",
			kunciJawaban: "B",
			tingkatKesulitan: 2,
			pilihan: [
				["A", "16 cm³"],
				["B", "64 cm³"],
				["C", "24 cm³"],
				["D", "48 cm³"],
				["E", "32 cm³"],
			],
		},
		{
			id: "latihan-pk-011",
			materiId: "materi-pk-002",
			tipe: LatihanSoalType.PK,
			tipeSesi: SessionType.TRY_OUT,
			content: "Luas segitiga dengan alas 10 cm dan tinggi 6 cm adalah...",
			kunciJawaban: "A",
			tingkatKesulitan: 2,
			pilihan: [
				["A", "30 cm²"],
				["B", "60 cm²"],
				["C", "40 cm²"],
				["D", "50 cm²"],
				["E", "20 cm²"],
			],
		},
		{
			id: "latihan-pk-012",
			materiId: "materi-pk-002",
			tipe: LatihanSoalType.PK,
			tipeSesi: SessionType.TRY_OUT,
			content: "Pythagoras menyatakan bahwa untuk segitiga siku-siku berlaku...",
			kunciJawaban: "C",
			tingkatKesulitan: 2,
			pilihan: [
				["A", "a + b = c"],
				["B", "a × b = c"],
				["C", "a² + b² = c²"],
				["D", "a - b = c"],
				["E", "a / b = c"],
			],
		},
		{
			id: "latihan-pk-013",
			materiId: "materi-pk-002",
			tipe: LatihanSoalType.PK,
			tipeSesi: SessionType.LATIHAN,
			content: "Jumlah sudut dalam segitiga adalah...",
			kunciJawaban: "D",
			tingkatKesulitan: 1,
			pilihan: [
				["A", "90°"],
				["B", "120°"],
				["C", "150°"],
				["D", "180°"],
				["E", "360°"],
			],
		},
		{
			id: "latihan-pk-014",
			materiId: "materi-pk-002",
			tipe: LatihanSoalType.PK,
			tipeSesi: SessionType.TRY_OUT,
			content: "Volume tabung dengan jari-jari 7 cm dan tinggi 10 cm (π = 22/7) adalah...",
			kunciJawaban: "E",
			tingkatKesulitan: 3,
			pilihan: [
				["A", "1100 cm³"],
				["B", "1200 cm³"],
				["C", "1400 cm³"],
				["D", "1500 cm³"],
				["E", "1540 cm³"],
			],
		},
		{
			id: "latihan-pk-015",
			materiId: "materi-pk-002",
			tipe: LatihanSoalType.PK,
			tipeSesi: SessionType.TRY_OUT,
			content: "Luas permukaan balok dengan p = 5 cm, l = 4 cm, t = 3 cm adalah...",
			kunciJawaban: "B",
			tingkatKesulitan: 3,
			pilihan: [
				["A", "60 cm²"],
				["B", "94 cm²"],
				["C", "100 cm²"],
				["D", "120 cm²"],
				["E", "150 cm²"],
			],
		},
	];

	// ========== LITERASI BAHASA INDONESIA (15 soal) ==========
	const soalLitIndo = [
		{
			id: "latihan-litindo-001",
			materiId: "materi-litindo-001",
			tipe: LatihanSoalType.LITERASIBINDO,
			tipeSesi: SessionType.LATIHAN,
			content: 'Sinonim dari kata "antusias" adalah...',
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
			content: 'Antonim dari kata "optimis" adalah...',
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
			materiId: "materi-litindo-001",
			tipe: LatihanSoalType.LITERASIBINDO,
			tipeSesi: SessionType.LATIHAN,
			content: 'Makna kata "empiris" adalah...',
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
		{
			id: "latihan-litindo-004",
			materiId: "materi-litindo-001",
			tipe: LatihanSoalType.LITERASIBINDO,
			tipeSesi: SessionType.LATIHAN,
			content: 'Sinonim dari kata "kompeten" adalah...',
			kunciJawaban: "A",
			tingkatKesulitan: 2,
			pilihan: [
				["A", "Cakap"],
				["B", "Bodoh"],
				["C", "Lemah"],
				["D", "Malas"],
				["E", "Gagal"],
			],
		},
		{
			id: "latihan-litindo-005",
			materiId: "materi-litindo-001",
			tipe: LatihanSoalType.LITERASIBINDO,
			tipeSesi: SessionType.LATIHAN,
			content: 'Antonim dari kata "modern" adalah...',
			kunciJawaban: "E",
			tingkatKesulitan: 2,
			pilihan: [
				["A", "Baru"],
				["B", "Canggih"],
				["C", "Maju"],
				["D", "Berkembang"],
				["E", "Tradisional"],
			],
		},
		{
			id: "latihan-litindo-006",
			materiId: "materi-litindo-001",
			tipe: LatihanSoalType.LITERASIBINDO,
			tipeSesi: SessionType.TRY_OUT,
			content: 'Makna kata "paradoks" adalah...',
			kunciJawaban: "C",
			tingkatKesulitan: 3,
			pilihan: [
				["A", "Persamaan"],
				["B", "Keselarasan"],
				["C", "Pertentangan"],
				["D", "Kebenaran"],
				["E", "Kesederhanaan"],
			],
		},
		{
			id: "latihan-litindo-007",
			materiId: "materi-litindo-001",
			tipe: LatihanSoalType.LITERASIBINDO,
			tipeSesi: SessionType.TRY_OUT,
			content: 'Sinonim dari kata "skeptis" adalah...',
			kunciJawaban: "B",
			tingkatKesulitan: 3,
			pilihan: [
				["A", "Yakin"],
				["B", "Ragu"],
				["C", "Percaya"],
				["D", "Optimis"],
				["E", "Antusias"],
			],
		},
		{
			id: "latihan-litindo-008",
			materiId: "materi-litindo-002",
			tipe: LatihanSoalType.LITERASIBINDO,
			tipeSesi: SessionType.LATIHAN,
			content: "Ide pokok paragraf biasanya terdapat pada...",
			kunciJawaban: "A",
			tingkatKesulitan: 2,
			pilihan: [
				["A", "Kalimat utama"],
				["B", "Kalimat penjelas"],
				["C", "Kalimat terakhir"],
				["D", "Semua kalimat"],
				["E", "Kalimat tengah"],
			],
		},
		{
			id: "latihan-litindo-009",
			materiId: "materi-litindo-002",
			tipe: LatihanSoalType.LITERASIBINDO,
			tipeSesi: SessionType.LATIHAN,
			content: "Teknik membaca cepat disebut juga...",
			kunciJawaban: "C",
			tingkatKesulitan: 2,
			pilihan: [
				["A", "Reading"],
				["B", "Observing"],
				["C", "Skimming"],
				["D", "Writing"],
				["E", "Listening"],
			],
		},
		{
			id: "latihan-litindo-010",
			materiId: "materi-litindo-002",
			tipe: LatihanSoalType.LITERASIBINDO,
			tipeSesi: SessionType.LATIHAN,
			content: "Tujuan membaca intensif adalah...",
			kunciJawaban: "D",
			tingkatKesulitan: 2,
			pilihan: [
				["A", "Mencari hiburan"],
				["B", "Menghabiskan waktu"],
				["C", "Melatih mata"],
				["D", "Memahami detail isi"],
				["E", "Membaca cepat"],
			],
		},
		{
			id: "latihan-litindo-011",
			materiId: "materi-litindo-002",
			tipe: LatihanSoalType.LITERASIBINDO,
			tipeSesi: SessionType.TRY_OUT,
			content: "Membaca dengan tujuan mencari informasi tertentu disebut...",
			kunciJawaban: "B",
			tingkatKesulitan: 3,
			pilihan: [
				["A", "Skimming"],
				["B", "Scanning"],
				["C", "Reading"],
				["D", "Reviewing"],
				["E", "Browsing"],
			],
		},
		{
			id: "latihan-litindo-012",
			materiId: "materi-litindo-002",
			tipe: LatihanSoalType.LITERASIBINDO,
			tipeSesi: SessionType.TRY_OUT,
			content: "Langkah pertama dalam membaca pemahaman adalah...",
			kunciJawaban: "A",
			tingkatKesulitan: 2,
			pilihan: [
				["A", "Membaca judul dan paragraf pertama"],
				["B", "Membaca kesimpulan"],
				["C", "Membaca semua detail"],
				["D", "Mencatat semua kalimat"],
				["E", "Menghapal isi"],
			],
		},
		{
			id: "latihan-litindo-013",
			materiId: "materi-litindo-002",
			tipe: LatihanSoalType.LITERASIBINDO,
			tipeSesi: SessionType.LATIHAN,
			content: "Simpulan bacaan biasanya terdapat pada...",
			kunciJawaban: "E",
			tingkatKesulitan: 2,
			pilihan: [
				["A", "Judul"],
				["B", "Paragraf pertama"],
				["C", "Paragraf tengah"],
				["D", "Kalimat pertama"],
				["E", "Paragraf akhir"],
			],
		},
		{
			id: "latihan-litindo-014",
			materiId: "materi-litindo-002",
			tipe: LatihanSoalType.LITERASIBINDO,
			tipeSesi: SessionType.TRY_OUT,
			content: "Jenis bacaan yang menyajikan fakta disebut teks...",
			kunciJawaban: "C",
			tingkatKesulitan: 3,
			pilihan: [
				["A", "Fiksi"],
				["B", "Narasi"],
				["C", "Eksposisi"],
				["D", "Deskripsi"],
				["E", "Puisi"],
			],
		},
		{
			id: "latihan-litindo-015",
			materiId: "materi-litindo-002",
			tipe: LatihanSoalType.LITERASIBINDO,
			tipeSesi: SessionType.TRY_OUT,
			content: "Untuk memahami bacaan dengan baik, pembaca perlu memiliki...",
			kunciJawaban: "D",
			tingkatKesulitan: 2,
			pilihan: [
				["A", "Waktu luang"],
				["B", "Buku banyak"],
				["C", "Tempat nyaman"],
				["D", "Pengetahuan latar belakang"],
				["E", "Kacamata"],
			],
		},
	];

	const allSoal = [
		...soalPU,
		...soalPBM,
		...soalPPU,
		...soalPK,
		...soalLitIndo,
	];

	console.log(`📊 Total soal to seed: ${allSoal.length}`);

	for (let i = 0; i < allSoal.length; i++) {
		const soal = allSoal[i];
		
		try {
			console.log(`  [${i + 1}/${allSoal.length}] Seeding: ${soal.id}...`);
			
			// Upsert soal terlebih dahulu
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
				},
			});

			// Seed pilihan jawaban secara terpisah
			for (const [label, text] of soal.pilihan) {
				await prisma.pilihanJawaban.upsert({
					where: { id: `${soal.id}-${label}` },
					update: {
						label,
						pilihan: text,
					},
					create: {
						id: `${soal.id}-${label}`,
						soalLatihanId: soal.id,
						label,
						pilihan: text,
					},
				});
			}

			// Seed pembahasan secara terpisah
			await prisma.pembahasanSoalLatihan.upsert({
				where: { id: `${soal.id}-pembahasan` },
				update: {
					konten: `<div class="pembahasan">
						<h4>Pembahasan</h4>
						<p>Jawaban yang benar adalah <strong>${soal.kunciJawaban}</strong>.</p>
						<p>Penjelasan: ${soal.content}</p>
					</div>`,
				},
				create: {
					id: `${soal.id}-pembahasan`,
					soalLatihanId: soal.id,
					konten: `<div class="pembahasan">
						<h4>Pembahasan</h4>
						<p>Jawaban yang benar adalah <strong>${soal.kunciJawaban}</strong>.</p>
						<p>Penjelasan: ${soal.content}</p>
					</div>`,
				},
			});
			
		} catch (error) {
			console.error(`    ❌ Error seeding soal ${soal.id}:`, error);
			throw error;
		}
	}

	console.log("✅ Latihan Soal seeded successfully\n");
}

// ==================== MAIN SEEDER ====================
async function main() {
	console.log("🌱 Starting comprehensive seeding...\n");

	await CreateUsers();
	await CreateMateri();
	await CreateLatihanSoal();

	console.log("\n🎉 Seeding completed!");
	console.log("📊 Summary:");
	console.log("  • 4 Users");
	console.log("  • 10 Materi (5 categories)");
	console.log("  • 75 Soal (15 per materi)");
	console.log("  • 375 Pilihan Jawaban (5 per soal)");
	console.log("  • 75 Pembahasan (1 per soal)");
}

main()
	.then(() => {
		console.log("\n✨ All done!");
	})
	.catch((e) => {
		console.error("\n❌ Error during seeding:", e);
		process.exit(1);
	})
	.finally(async () => {
		await prisma.$disconnect();
		process.exit(0);
	});