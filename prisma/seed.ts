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
	console.log("📚 Seeding Material Topics...");

	const materiData = [
		{
			id: "materi-pu-001",
			nama: "Logical Reasoning",
			kategori: LatihanSoalType.PU,
			deskripsi:
				"Topics on logical reasoning, syllogisms, and argument analysis. Learn to think systematically and draw valid conclusions.",
			urutan: 1,
		},
		{
			id: "materi-pu-002",
			nama: "Analytical Reasoning",
			kategori: LatihanSoalType.PU,
			deskripsi:
				"Topics on data analysis, graphs, and tables for decision making.",
			urutan: 2,
		},
		{
			id: "materi-pbm-001",
			nama: "Paragraph Structure",
			kategori: LatihanSoalType.PBM,
			deskripsi:
				"Topics on main ideas, topic sentences, and effective paragraph development.",
			urutan: 3,
		},
		{
			id: "materi-pbm-002",
			nama: "Argumentative Text",
			kategori: LatihanSoalType.PBM,
			deskripsi:
				"Topics on argumentation structure, premises, and conclusions in texts.",
			urutan: 4,
		},
		{
			id: "materi-ppu-001",
			nama: "History of Indonesia",
			kategori: LatihanSoalType.PPU,
			deskripsi:
				"Topics on the history of independence and the development of Indonesia over time.",
			urutan: 5,
		},
		{
			id: "materi-ppu-002",
			nama: "Geography of Indonesia",
			kategori: LatihanSoalType.PPU,
			deskripsi:
				"Topics on geographical conditions, climate, and natural resources of Indonesia.",
			urutan: 6,
		},
		{
			id: "materi-pk-001",
			nama: "Basic Algebra",
			kategori: LatihanSoalType.PK,
			deskripsi:
				"Topics on linear equations, quadratic equations, and systems of equations.",
			urutan: 7,
		},
		{
			id: "materi-pk-002",
			nama: "Geometry",
			kategori: LatihanSoalType.PK,
			deskripsi:
				"Topics on flat shapes, spatial shapes, and calculations of area and volume.",
			urutan: 8,
		},
		{
			id: "materi-litindo-001",
			nama: "Vocabulary Comprehension",
			kategori: LatihanSoalType.LITERASIBINDO,
			deskripsi:
				"Topics on word meanings, synonyms, antonyms, and context of use in Indonesian.",
			urutan: 9,
		},
		{
			id: "materi-litindo-002",
			nama: "Reading Comprehension",
			kategori: LatihanSoalType.LITERASIBINDO,
			deskripsi:
				"Topics on speed reading techniques and comprehensive understanding of reading content.",
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
		console.log(`  ✓ Material: ${materi.nama}`);
	}

	console.log("✅ Topics seeded successfully\n");
}

// ==================== LATIHAN SOAL SEEDER ====================
async function CreateLatihanSoal() {
	console.log("📝 Seeding Latihan Soal...");

	// ========== LOGICAL REASONING (15 questions) ==========
	const soalPU = [
		{
			id: "latihan-pu-001",
			materiId: "materi-pu-001",
			tipe: LatihanSoalType.PU,
			tipeSesi: SessionType.LATIHAN,
			content: "All university students are learners. Budi is a university student. The conclusion is...",
			kunciJawaban: "A",
			tingkatKesulitan: 2,
			pilihan: [
				["A", "Budi is a learner"],
				["B", "Budi is not a learner"],
				["C", "All learners are university students"],
				["D", "No conclusion can be drawn"],
				["E", "Budi is a lecturer"],
			],
		},
		{
			id: "latihan-pu-002",
			materiId: "materi-pu-001",
			tipe: LatihanSoalType.PU,
			tipeSesi: SessionType.LATIHAN,
			content: "If it rains today, the streets will be wet. The streets are not wet. Therefore...",
			kunciJawaban: "B",
			tingkatKesulitan: 3,
			pilihan: [
				["A", "It is raining today"],
				["B", "It is not raining today"],
				["C", "The streets are dry"],
				["D", "It will rain tomorrow"],
				["E", "Cannot be concluded"],
			],
		},
		{
			id: "latihan-pu-003",
			materiId: "materi-pu-001",
			tipe: LatihanSoalType.PU,
			tipeSesi: SessionType.LATIHAN,
			content: "All doctors are graduates. Some graduates are civil servants. The conclusion is...",
			kunciJawaban: "C",
			tingkatKesulitan: 3,
			pilihan: [
				["A", "All doctors are civil servants"],
				["B", "All civil servants are doctors"],
				["C", "Some doctors may be civil servants"],
				["D", "No doctor is a civil servant"],
				["E", "All graduates are doctors"],
			],
		},
		{
			id: "latihan-pu-004",
			materiId: "materi-pu-001",
			tipe: LatihanSoalType.PU,
			tipeSesi: SessionType.LATIHAN,
			content: "No student is unintelligent. Ani is a student. Therefore...",
			kunciJawaban: "A",
			tingkatKesulitan: 2,
			pilihan: [
				["A", "Ani is not unintelligent"],
				["B", "Ani is unintelligent"],
				["C", "All students are smart"],
				["D", "Ani is not a student"],
				["E", "Cannot be concluded"],
			],
		},
		{
			id: "latihan-pu-005",
			materiId: "materi-pu-001",
			tipe: LatihanSoalType.PU,
			tipeSesi: SessionType.LATIHAN,
			content: "If A > B and B > C, then...",
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
			content: "All birds have wings. Penguins have wings. The conclusion is...",
			kunciJawaban: "E",
			tingkatKesulitan: 2,
			pilihan: [
				["A", "Penguins are birds"],
				["B", "Everything with wings is a bird"],
				["C", "Penguins can fly"],
				["D", "Birds cannot swim"],
				["E", "Penguins might be birds"],
			],
		},
		{
			id: "latihan-pu-007",
			materiId: "materi-pu-001",
			tipe: LatihanSoalType.PU,
			tipeSesi: SessionType.TRY_OUT,
			content: "If one studies hard, they will get good grades. The grades are not good. Therefore...",
			kunciJawaban: "B",
			tingkatKesulitan: 3,
			pilihan: [
				["A", "Studied hard"],
				["B", "Did not study hard"],
				["C", "Good grades"],
				["D", "Is lazy to study"],
				["E", "Cannot be concluded"],
			],
		},
		{
			id: "latihan-pu-008",
			materiId: "materi-pu-001",
			tipe: LatihanSoalType.PU,
			tipeSesi: SessionType.TRY_OUT,
			content: "No fish lives on land. Whales live in the water. The conclusion is...",
			kunciJawaban: "E",
			tingkatKesulitan: 3,
			pilihan: [
				["A", "Whales are fish"],
				["B", "Whales are not fish"],
				["C", "Everything in the water is a fish"],
				["D", "Fish only live in the water"],
				["E", "It cannot be concluded whether whales are fish"],
			],
		},
		{
			id: "latihan-pu-009",
			materiId: "materi-pu-001",
			tipe: LatihanSoalType.PU,
			tipeSesi: SessionType.LATIHAN,
			content: "All cats are mammals. Some mammals are four-legged. Therefore...",
			kunciJawaban: "C",
			tingkatKesulitan: 2,
			pilihan: [
				["A", "All cats are four-legged"],
				["B", "All mammals are cats"],
				["C", "Some cats may be four-legged"],
				["D", "No cat is four-legged"],
				["E", "Mammals are definitely cats"],
			],
		},
		{
			id: "latihan-pu-010",
			materiId: "materi-pu-001",
			tipe: LatihanSoalType.PU,
			tipeSesi: SessionType.LATIHAN,
			content: "If X = Y and Y = Z, then...",
			kunciJawaban: "A",
			tingkatKesulitan: 1,
			pilihan: [
				["A", "X = Z"],
				["B", "X ≠ Z"],
				["C", "X > Z"],
				["D", "X < Z"],
				["E", "Cannot be concluded"],
			],
		},
		{
			id: "latihan-pu-011",
			materiId: "materi-pu-002",
			tipe: LatihanSoalType.PU,
			tipeSesi: SessionType.LATIHAN,
			content: "In a sequence: 2, 4, 8, 16, ... The next number is...",
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
			content: "Sequence: 5, 10, 20, 40, ... The pattern used is...",
			kunciJawaban: "A",
			tingkatKesulitan: 2,
			pilihan: [
				["A", "Multiplied by 2"],
				["B", "Plus 5"],
				["C", "Squared"],
				["D", "Plus 10"],
				["E", "Multiplied by 3"],
			],
		},
		{
			id: "latihan-pu-013",
			materiId: "materi-pu-002",
			tipe: LatihanSoalType.PU,
			tipeSesi: SessionType.TRY_OUT,
			content: "If all A are B, and all B are C, then...",
			kunciJawaban: "B",
			tingkatKesulitan: 2,
			pilihan: [
				["A", "Some A are C"],
				["B", "All A are C"],
				["C", "No A is C"],
				["D", "All C are A"],
				["E", "Cannot be concluded"],
			],
		},
		{
			id: "latihan-pu-014",
			materiId: "materi-pu-002",
			tipe: LatihanSoalType.PU,
			tipeSesi: SessionType.TRY_OUT,
			content: "In a graph, if X increases then Y decreases. This relationship is called...",
			kunciJawaban: "D",
			tingkatKesulitan: 3,
			pilihan: [
				["A", "Positive correlation"],
				["B", "Not correlated"],
				["C", "Causality"],
				["D", "Negative correlation"],
				["E", "Linear correlation"],
			],
		},
		{
			id: "latihan-pu-015",
			materiId: "materi-pu-002",
			tipe: LatihanSoalType.PU,
			tipeSesi: SessionType.TRY_OUT,
			content: "Sequence: 1, 1, 2, 3, 5, 8, ... The next number is...",
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

	// ========== PARAGRAPH STRUCTURE & ARGUMENTATIVE TEXT (15 questions) ==========
	const soalPBM = [
		{
			id: "latihan-pbm-001",
			materiId: "materi-pbm-001",
			tipe: LatihanSoalType.PBM,
			tipeSesi: SessionType.LATIHAN,
			content: "A sentence that contains the main idea is usually called...",
			kunciJawaban: "A",
			tingkatKesulitan: 1,
			pilihan: [
				["A", "Topic sentence"],
				["B", "Supporting sentence"],
				["C", "Closing sentence"],
				["D", "Transition sentence"],
				["E", "Interrogative sentence"],
			],
		},
		{
			id: "latihan-pbm-002",
			materiId: "materi-pbm-001",
			tipe: LatihanSoalType.PBM,
			tipeSesi: SessionType.LATIHAN,
			content: "A paragraph that has its main idea at the beginning is called a/an...",
			kunciJawaban: "B",
			tingkatKesulitan: 2,
			pilihan: [
				["A", "Inductive paragraph"],
				["B", "Deductive paragraph"],
				["C", "Mixed paragraph"],
				["D", "Narrative paragraph"],
				["E", "Descriptive paragraph"],
			],
		},
		{
			id: "latihan-pbm-003",
			materiId: "materi-pbm-001",
			tipe: LatihanSoalType.PBM,
			tipeSesi: SessionType.LATIHAN,
			content: "The function of supporting sentences in a paragraph is to...",
			kunciJawaban: "C",
			tingkatKesulitan: 2,
			pilihan: [
				["A", "Open the paragraph"],
				["B", "Close the paragraph"],
				["C", "Support the main idea"],
				["D", "Draw a conclusion"],
				["E", "Pose a question"],
			],
		},
		{
			id: "latihan-pbm-004",
			materiId: "materi-pbm-001",
			tipe: LatihanSoalType.PBM,
			tipeSesi: SessionType.LATIHAN,
			content: "A paragraph with the main idea at the end is called a/an...",
			kunciJawaban: "A",
			tingkatKesulitan: 2,
			pilihan: [
				["A", "Inductive paragraph"],
				["B", "Deductive paragraph"],
				["C", "Mixed paragraph"],
				["D", "Argumentative paragraph"],
				["E", "Persuasive paragraph"],
			],
		},
		{
			id: "latihan-pbm-005",
			materiId: "materi-pbm-001",
			tipe: LatihanSoalType.PBM,
			tipeSesi: SessionType.LATIHAN,
			content: "The main characteristic of a good paragraph is...",
			kunciJawaban: "D",
			tingkatKesulitan: 2,
			pilihan: [
				["A", "Long length"],
				["B", "High word count"],
				["C", "Complexity"],
				["D", "Coherence and cohesion"],
				["E", "Frequent use of jargon"],
			],
		},
		{
			id: "latihan-pbm-006",
			materiId: "materi-pbm-001",
			tipe: LatihanSoalType.PBM,
			tipeSesi: SessionType.TRY_OUT,
			content: "A paragraph where the main idea is at the beginning and the end is called...",
			kunciJawaban: "C",
			tingkatKesulitan: 3,
			pilihan: [
				["A", "Inductive paragraph"],
				["B", "Deductive paragraph"],
				["C", "Mixed paragraph"],
				["D", "Narrative paragraph"],
				["E", "Descriptive paragraph"],
			],
		},
		{
			id: "latihan-pbm-007",
			materiId: "materi-pbm-001",
			tipe: LatihanSoalType.PBM,
			tipeSesi: SessionType.TRY_OUT,
			content: "A conjunction that shows a cause-effect relationship is...",
			kunciJawaban: "B",
			tingkatKesulitan: 2,
			pilihan: [
				["A", "But"],
				["B", "Because"],
				["C", "And"],
				["D", "Or"],
				["E", "However"],
			],
		},
		{
			id: "latihan-pbm-008",
			materiId: "materi-pbm-002",
			tipe: LatihanSoalType.PBM,
			tipeSesi: SessionType.LATIHAN,
			content: "The correct structure of an argumentative text is...",
			kunciJawaban: "A",
			tingkatKesulitan: 2,
			pilihan: [
				["A", "Thesis - Argument - Reiteration"],
				["B", "Orientation - Complication - Resolution"],
				["C", "Introduction - Body - Conclusion"],
				["D", "Statement - Data - Conclusion"],
				["E", "Title - Paragraph - End"],
			],
		},
		{
			id: "latihan-pbm-009",
			materiId: "materi-pbm-002",
			tipe: LatihanSoalType.PBM,
			tipeSesi: SessionType.LATIHAN,
			content: "A thesis in an argumentative text serves as...",
			kunciJawaban: "C",
			tingkatKesulitan: 2,
			pilihan: [
				["A", "Closing"],
				["B", "Supporting data"],
				["C", "Statement of opinion"],
				["D", "Conclusion"],
				["E", "Bibliography"],
			],
		},
		{
			id: "latihan-pbm-010",
			materiId: "materi-pbm-002",
			tipe: LatihanSoalType.PBM,
			tipeSesi: SessionType.LATIHAN,
			content: "A good argument should be supported by...",
			kunciJawaban: "D",
			tingkatKesulitan: 2,
			pilihan: [
				["A", "Personal opinion"],
				["B", "Assumptions"],
				["C", "Gossip"],
				["D", "Facts and data"],
				["E", "Stories"],
			],
		},
		{
			id: "latihan-pbm-011",
			materiId: "materi-pbm-002",
			tipe: LatihanSoalType.PBM,
			tipeSesi: SessionType.TRY_OUT,
			content: "The characteristic feature of an argumentative text is...",
			kunciJawaban: "B",
			tingkatKesulitan: 3,
			pilihan: [
				["A", "To entertain the reader"],
				["B", "To convince the reader"],
				["C", "To describe something"],
				["D", "To tell an experience"],
				["E", "To provide instructions"],
			],
		},
		{
			id: "latihan-pbm-012",
			materiId: "materi-pbm-002",
			tipe: LatihanSoalType.PBM,
			tipeSesi: SessionType.TRY_OUT,
			content: "Reiteration in an argumentative text aims to...",
			kunciJawaban: "A",
			tingkatKesulitan: 3,
			pilihan: [
				["A", "Strengthen the opinion"],
				["B", "Introduce a new topic"],
				["C", "Criticize the opponent"],
				["D", "Entertain the reader"],
				["E", "Provide additional data"],
			],
		},
		{
			id: "latihan-pbm-013",
			materiId: "materi-pbm-002",
			tipe: LatihanSoalType.PBM,
			tipeSesi: SessionType.LATIHAN,
			content: "A word that indicates an opinion in an argument is...",
			kunciJawaban: "C",
			tingkatKesulitan: 2,
			pilihan: [
				["A", "Is"],
				["B", "Exists"],
				["C", "In my opinion"],
				["D", "Based on"],
				["E", "Proven"],
			],
		},
		{
			id: "latihan-pbm-014",
			materiId: "materi-pbm-002",
			tipe: LatihanSoalType.PBM,
			tipeSesi: SessionType.TRY_OUT,
			content: "Correct conjunction to express contrast is...",
			kunciJawaban: "E",
			tingkatKesulitan: 2,
			pilihan: [
				["A", "Then"],
				["B", "Next"],
				["C", "So that"],
				["D", "Therefore"],
				["E", "However"],
			],
		},
		{
			id: "latihan-pbm-015",
			materiId: "materi-pbm-002",
			tipe: LatihanSoalType.PBM,
			tipeSesi: SessionType.TRY_OUT,
			content: "The section containing the reinforcement of arguments with data is...",
			kunciJawaban: "B",
			tingkatKesulitan: 3,
			pilihan: [
				["A", "Thesis"],
				["B", "Argumentation"],
				["C", "Orientation"],
				["D", "Abstract"],
				["E", "Coda"],
			],
		},
	];

	// ========== INDONESIAN HISTORY & GEOGRAPHY (15 questions) ==========
	const soalPPU = [
		{
			id: "latihan-ppu-001",
			materiId: "materi-ppu-001",
			tipe: LatihanSoalType.PPU,
			tipeSesi: SessionType.LATIHAN,
			content: "The first national movement organization in Indonesia was...",
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
			content: "The Rengasdengklok incident occurred on...",
			kunciJawaban: "A",
			tingkatKesulitan: 3,
			pilihan: [
				["A", "August 16, 1945"],
				["B", "August 17, 1945"],
				["C", "August 18, 1945"],
				["D", "August 15, 1945"],
				["E", "August 19, 1945"],
			],
		},
		{
			id: "latihan-ppu-003",
			materiId: "materi-ppu-001",
			tipe: LatihanSoalType.PPU,
			tipeSesi: SessionType.LATIHAN,
			content: "The Round Table Conference (KMB) resulted in the following decision...",
			kunciJawaban: "C",
			tingkatKesulitan: 3,
			pilihan: [
				["A", "Full independence for Indonesia"],
				["B", "The Netherlands remained in power"],
				["C", "Recognition of Indonesian sovereignty"],
				["D", "Formation of a federation"],
				["E", "War continues"],
			],
		},
		{
			id: "latihan-ppu-004",
			materiId: "materi-ppu-001",
			tipe: LatihanSoalType.PPU,
			tipeSesi: SessionType.LATIHAN,
			content: "The proclamation of Indonesian independence was read by...",
			kunciJawaban: "A",
			tingkatKesulitan: 1,
			pilihan: [
				["A", "Soekarno-Hatta"],
				["B", "Soekarno-Sjahrir"],
				["C", "Hatta-Sjahrir"],
				["D", "Soekarno only"],
				["E", "Hatta only"],
			],
		},
		{
			id: "latihan-ppu-005",
			materiId: "materi-ppu-001",
			tipe: LatihanSoalType.PPU,
			tipeSesi: SessionType.LATIHAN,
			content: "The Youth Pledge (Sumpah Pemuda) was declared in the year...",
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
			content: "Dutch Military Aggression I occurred in the year...",
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
			content: "The Linggarjati Agreement resulted in the following agreement...",
			kunciJawaban: "C",
			tingkatKesulitan: 3,
			pilihan: [
				["A", "The Netherlands recognized full independence of Indonesia"],
				["B", "Indonesia became a federal state"],
				["C", "The Netherlands recognized RI authority over Java, Madura, Sumatra"],
				["D", "War was completely halted"],
				["E", "Indonesia was recolonized"],
			],
		},
		{
			id: "latihan-ppu-008",
			materiId: "materi-ppu-002",
			tipe: LatihanSoalType.PPU,
			tipeSesi: SessionType.LATIHAN,
			content: "Indonesia is located between two continents, namely...",
			kunciJawaban: "A",
			tingkatKesulitan: 1,
			pilihan: [
				["A", "Asia and Australia"],
				["B", "Asia and Africa"],
				["C", "Australia and America"],
				["D", "Asia and Europe"],
				["E", "Africa and Australia"],
			],
		},
		{
			id: "latihan-ppu-009",
			materiId: "materi-ppu-002",
			tipe: LatihanSoalType.PPU,
			tipeSesi: SessionType.LATIHAN,
			content: "The highest mountain in Indonesia is...",
			kunciJawaban: "C",
			tingkatKesulitan: 2,
			pilihan: [
				["A", "Mount Semeru"],
				["B", "Mount Rinjani"],
				["C", "Puncak Jaya"],
				["D", "Mount Kerinci"],
				["E", "Mount Merapi"],
			],
		},
		{
			id: "latihan-ppu-010",
			materiId: "materi-ppu-002",
			tipe: LatihanSoalType.PPU,
			tipeSesi: SessionType.LATIHAN,
			content: "Indonesia has a ... climate.",
			kunciJawaban: "B",
			tingkatKesulitan: 1,
			pilihan: [
				["A", "Subtropical"],
				["B", "Tropical"],
				["C", "Polar"],
				["D", "Temperate"],
				["E", "Cold"],
			],
		},
		{
			id: "latihan-ppu-011",
			materiId: "materi-ppu-002",
			tipe: LatihanSoalType.PPU,
			tipeSesi: SessionType.TRY_OUT,
			content: "The largest island in Indonesia is...",
			kunciJawaban: "D",
			tingkatKesulitan: 2,
			pilihan: [
				["A", "Java"],
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
			content: "Indonesia is located between two oceans, namely...",
			kunciJawaban: "A",
			tingkatKesulitan: 2,
			pilihan: [
				["A", "Pacific and Indian"],
				["B", "Atlantic and Indian"],
				["C", "Pacific and Atlantic"],
				["D", "Indian and Arctic"],
				["E", "Pacific and Arctic"],
			],
		},
		{
			id: "latihan-ppu-013",
			materiId: "materi-ppu-002",
			tipe: LatihanSoalType.PPU,
			tipeSesi: SessionType.LATIHAN,
			content: "Indonesia is crossed by the ... line.",
			kunciJawaban: "C",
			tingkatKesulitan: 2,
			pilihan: [
				["A", "North latitude"],
				["B", "South pole"],
				["C", "Equator"],
				["D", "West longitude"],
				["E", "Meridian"],
			],
		},
		{
			id: "latihan-ppu-014",
			materiId: "materi-ppu-002",
			tipe: LatihanSoalType.PPU,
			tipeSesi: SessionType.TRY_OUT,
			content: "The main mining products of Indonesia are...",
			kunciJawaban: "E",
			tingkatKesulitan: 2,
			pilihan: [
				["A", "Diamond"],
				["B", "Platinum"],
				["C", "Silver"],
				["D", "Uranium"],
				["E", "Petroleum, gas, coal"],
			],
		},
		{
			id: "latihan-ppu-015",
			materiId: "materi-ppu-002",
			tipe: LatihanSoalType.PPU,
			tipeSesi: SessionType.TRY_OUT,
			content: "Indonesia has ... time zones.",
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

	// ========== BASIC ALGEBRA & GEOMETRY (15 questions) ==========
	const soalPK = [
		{
			id: "latihan-pk-001",
			materiId: "materi-pk-001",
			tipe: LatihanSoalType.PK,
			tipeSesi: SessionType.LATIHAN,
			content: "If 3x + 5 = 20, then the value of x is...",
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
			content: "The result of (x + 3)(x - 3) is...",
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
			content: "If 2x - 7 = 13, then x = ...",
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
			content: "The result of (x + 2)² is...",
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
			content: "The roots of the equation x² - 5x + 6 = 0 are...",
			kunciJawaban: "C",
			tingkatKesulitan: 3,
			pilihan: [
				["A", "1 and 6"],
				["B", "1 and 5"],
				["C", "2 and 3"],
				["D", "3 and 4"],
				["E", "4 and 5"],
			],
		},
		{
			id: "latihan-pk-006",
			materiId: "materi-pk-001",
			tipe: LatihanSoalType.PK,
			tipeSesi: SessionType.TRY_OUT,
			content: "If x + y = 10 and x - y = 2, then x = ...",
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
			content: "The simplified form of 3x + 2x - x is...",
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
			content: "The area of a rectangle with length 8 cm and width 5 cm is...",
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
			content: "The circumference of a circle with radius 7 cm (π = 22/7) is...",
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
			content: "The volume of a cube with side 4 cm is...",
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
			content: "The area of a triangle with base 10 cm and height 6 cm is...",
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
			content: "Pythagoras states that for a right-angled triangle, the following applies...",
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
			content: "The sum of angles in a triangle is...",
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
			content: "The volume of a cylinder with radius 7 cm and height 10 cm (π = 22/7) is...",
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
			content: "Surface area of a cuboid with l = 5 cm, w = 4 cm, h = 3 cm is...",
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

	// ========== INDONESIAN LITERACY (15 questions) ==========
	const soalLitIndo = [
		{
			id: "latihan-litindo-001",
			materiId: "materi-litindo-001",
			tipe: LatihanSoalType.LITERASIBINDO,
			tipeSesi: SessionType.LATIHAN,
			content: 'The synonym of the word "enthusiastic" is...',
			kunciJawaban: "C",
			tingkatKesulitan: 2,
			pilihan: [
				["A", "Lazy"],
				["B", "Hesitant"],
				["C", "Passionate"],
				["D", "Fearful"],
				["E", "Sad"],
			],
		},
		{
			id: "latihan-litindo-002",
			materiId: "materi-litindo-001",
			tipe: LatihanSoalType.LITERASIBINDO,
			tipeSesi: SessionType.LATIHAN,
			content: 'The antonym of the word "optimistic" is...',
			kunciJawaban: "B",
			tingkatKesulitan: 2,
			pilihan: [
				["A", "Happy"],
				["B", "Pessimistic"],
				["C", "Glad"],
				["D", "Joyful"],
				["E", "Cheerful"],
			],
		},
		{
			id: "latihan-litindo-003",
			materiId: "materi-litindo-001",
			tipe: LatihanSoalType.LITERASIBINDO,
			tipeSesi: SessionType.LATIHAN,
			content: 'The meaning of the word "empirical" is...',
			kunciJawaban: "D",
			tingkatKesulitan: 3,
			pilihan: [
				["A", "Based on theory"],
				["B", "Based on assumption"],
				["C", "Based on opinion"],
				["D", "Based on experience"],
				["E", "Based on fairy tales"],
			],
		},
		{
			id: "latihan-litindo-004",
			materiId: "materi-litindo-001",
			tipe: LatihanSoalType.LITERASIBINDO,
			tipeSesi: SessionType.LATIHAN,
			content: 'The synonym of the word "competent" is...',
			kunciJawaban: "A",
			tingkatKesulitan: 2,
			pilihan: [
				["A", "Capable"],
				["B", "Unintelligent"],
				["C", "Weak"],
				["D", "Lazy"],
				["E", "Failed"],
			],
		},
		{
			id: "latihan-litindo-005",
			materiId: "materi-litindo-001",
			tipe: LatihanSoalType.LITERASIBINDO,
			tipeSesi: SessionType.LATIHAN,
			content: 'The antonym of the word "modern" is...',
			kunciJawaban: "E",
			tingkatKesulitan: 2,
			pilihan: [
				["A", "New"],
				["B", "Sophisticated"],
				["C", "Advanced"],
				["D", "Developing"],
				["E", "Traditional"],
			],
		},
		{
			id: "latihan-litindo-006",
			materiId: "materi-litindo-001",
			tipe: LatihanSoalType.LITERASIBINDO,
			tipeSesi: SessionType.TRY_OUT,
			content: 'The meaning of the word "paradox" is...',
			kunciJawaban: "C",
			tingkatKesulitan: 3,
			pilihan: [
				["A", "Equation"],
				["B", "Harmony"],
				["C", "Contradiction"],
				["D", "Truth"],
				["E", "Simplicity"],
			],
		},
		{
			id: "latihan-litindo-007",
			materiId: "materi-litindo-001",
			tipe: LatihanSoalType.LITERASIBINDO,
			tipeSesi: SessionType.TRY_OUT,
			content: 'The synonym of the word "skeptical" is...',
			kunciJawaban: "B",
			tingkatKesulitan: 3,
			pilihan: [
				["A", "Convinced"],
				["B", "Doubtful"],
				["C", "Trusting"],
				["D", "Optimistic"],
				["E", "Enthusiastic"],
			],
		},
		{
			id: "latihan-litindo-008",
			materiId: "materi-litindo-002",
			tipe: LatihanSoalType.LITERASIBINDO,
			tipeSesi: SessionType.LATIHAN,
			content: "The main idea of a paragraph is usually found in the...",
			kunciJawaban: "A",
			tingkatKesulitan: 2,
			pilihan: [
				["A", "Topic sentence"],
				["B", "Supporting sentence"],
				["C", "Final sentence"],
				["D", "All sentences"],
				["E", "Middle sentence"],
			],
		},
		{
			id: "latihan-litindo-009",
			materiId: "materi-litindo-002",
			tipe: LatihanSoalType.LITERASIBINDO,
			tipeSesi: SessionType.LATIHAN,
			content: "Rapid reading technique is also called...",
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
			content: "The purpose of intensive reading is to...",
			kunciJawaban: "D",
			tingkatKesulitan: 2,
			pilihan: [
				["A", "Seek entertainment"],
				["B", "Pass time"],
				["C", "Train eyes"],
				["D", "Understand detailed content"],
				["E", "Read quickly"],
			],
		},
		{
			id: "latihan-litindo-011",
			materiId: "materi-litindo-002",
			tipe: LatihanSoalType.LITERASIBINDO,
			tipeSesi: SessionType.TRY_OUT,
			content: "Reading with the goal of finding specific information is called...",
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
			content: "The first step in reading comprehension is...",
			kunciJawaban: "A",
			tingkatKesulitan: 2,
			pilihan: [
				["A", "Read the title and first paragraph"],
				["B", "Read the conclusion"],
				["C", "Read all details"],
				["D", "Note all sentences"],
				["E", "Memorize the content"],
			],
		},
		{
			id: "latihan-litindo-013",
			materiId: "materi-litindo-002",
			tipe: LatihanSoalType.LITERASIBINDO,
			tipeSesi: SessionType.LATIHAN,
			content: "The conclusion of a text is usually found in the...",
			kunciJawaban: "E",
			tingkatKesulitan: 2,
			pilihan: [
				["A", "Title"],
				["B", "First paragraph"],
				["C", "Middle paragraph"],
				["D", "First sentence"],
				["E", "Final paragraph"],
			],
		},
		{
			id: "latihan-litindo-014",
			materiId: "materi-litindo-002",
			tipe: LatihanSoalType.LITERASIBINDO,
			tipeSesi: SessionType.TRY_OUT,
			content: "A type of reading that presents facts is called a/an ... text.",
			kunciJawaban: "C",
			tingkatKesulitan: 3,
			pilihan: [
				["A", "Fiction"],
				["B", "Narration"],
				["C", "Exposition"],
				["D", "Description"],
				["E", "Poetry"],
			],
		},
		{
			id: "latihan-litindo-015",
			materiId: "materi-litindo-002",
			tipe: LatihanSoalType.LITERASIBINDO,
			tipeSesi: SessionType.TRY_OUT,
			content: "To understand a text well, a reader needs to have...",
			kunciJawaban: "D",
			tingkatKesulitan: 2,
			pilihan: [
				["A", "Spare time"],
				["B", "Many books"],
				["C", "Comfortable place"],
				["D", "Background knowledge"],
				["E", "Glasses"],
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

	console.log(`📊 Total questions to seed: ${allSoal.length}`);

	for (let i = 0; i < allSoal.length; i++) {
		const soal = allSoal[i];

		try {
			console.log(`  [${i + 1}/${allSoal.length}] Seeding: ${soal.id}...`);

			// Upsert question first
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

			// Seed answer options separately
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

			// Seed explanation separately
			await prisma.pembahasanSoalLatihan.upsert({
				where: { soalLatihanId: soal.id },
				update: {
					konten: `<div class="pembahasan">
						<h4>Explanation</h4>
						<p>The correct answer is <strong>${soal.kunciJawaban}</strong>.</p>
						<p>Explanation: ${soal.content}</p>
					</div>`,
				},
				create: {
					id: `${soal.id}-pembahasan`,
					soalLatihanId: soal.id,
					konten: `<div class="pembahasan">
						<h4>Explanation</h4>
						<p>The correct answer is <strong>${soal.kunciJawaban}</strong>.</p>
						<p>Explanation: ${soal.content}</p>
					</div>`,
				},
			});

		} catch (error) {
			console.error(`    ❌ Error seeding soal ${soal.id}:`, error);
			throw error;
		}
	}

	console.log("✅ Practice Questions seeded successfully\n");
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
	console.log("  • 10 Topics (5 categories)");
	console.log("  • 75 Questions (15 per topic)");
	console.log("  • 375 Answer Options (5 per question)");
	console.log("  • 75 Explanations (1 per question)");
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