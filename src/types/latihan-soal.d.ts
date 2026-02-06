export type LatihanSoalType = 
  | "PU" 
  | "PBM" 
  | "PPU" 
  | "PK" 
  | "LITERASIBINDO" 
  | "LITERASIBINGG";

export type SessionType = "LATIHAN" | "TRY_OUT";

export type GayaBelajar = "VISUAL" | "AUDITORI" | "KINESTETIK";

export interface Materi {
  id: string;
  nama: string;
  kategori: LatihanSoalType;
  deskripsi?: string;
  urutan: number;
  _count?: {
    soalLatihan: number;
  };
}

export interface PilihanJawaban {
  id: string;
  label: string; // A, B, C, D, E
  pilihan: string;
}

export interface SoalLatihan {
  id: string;
  tipe: LatihanSoalType;
  tipeSesi: SessionType;
  materiId?: string;
  content: string;
  tingkatKesulitan: number;
  pilihanJawaban: PilihanJawaban[];
  materi?: {
    id: string;
    nama: string;
    kategori: LatihanSoalType;
  };
}

export interface LatihanSession {
  id: string;
  type: SessionType;
  startedAt: Date;
  endedAt?: Date;
  score?: number;
  totalDuration?: number;
  averageTimePerQ?: number;
  accuracyRate?: number;
  completionRate?: number;
}

export interface JawabanUser {
  id: string;
  pilihanId?: string;
  isCorrect?: boolean;
  kunciJawaban?: string;
  answeredAt: Date;
}

export interface SessionResult {
  sessionId: string;
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  accuracyRate: number;
  completionRate: number;
  totalDuration: number;
  averageTimePerQ: number;
}

export interface SoalProgress {
  soalId: string;
  answered: boolean;
  isCorrect?: boolean;
  pilihanId?: string;
  timeSpent?: number;
}