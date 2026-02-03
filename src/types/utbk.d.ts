export type SoalUTBKType =
	| 'PU'
	| 'PBM'
	| 'PPU'
	| 'PK'
	| 'LITERASIBINDO'
	| 'LITERASIBINGG';

export type GayaBelajar = 'VISUAL' | 'AUDITORI' | 'KINESTETIK';

export interface PilihanJawaban {
	id: string;
	label: string;
	pilihan: string;
}

export interface Soal {
	id: string;
	tipe: SoalUTBKType;
	content: string;
	pilihanJawaban: PilihanJawaban[];
}

export interface Pembahasan {
	id: string;
	gayaBelajar: GayaBelajar;
	konten: string;
}

export interface SessionData {
	id: string;
	startedAt: Date;
}

export interface JawabanUser {
	soalId: string;
	pilihanId: string | null;
}

export interface Result {
	soalId: string;
	soalContent: string;
	soalTipe: SoalUTBKType;
	kunciJawaban: string;
	pilihanJawaban: PilihanJawaban[];
	userAnswer: string | null;
	isCorrect: boolean | null;
	pembahasan: Pembahasan[];
}

export interface SessionResult {
	session: {
		id: string;
		startedAt: Date;
		endedAt: Date;
		score: number;
	};
	stats: {
		total: number;
		correct: number;
		incorrect: number;
		score: number;
	};
	results: Result[];
}