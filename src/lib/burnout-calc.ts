import type {
	AnswerData,
	BurnoutCalculationInput,
	BurnoutCalculationResult,
	BurnoutLevel,
	QuartileStats,
	ValidationResult,
	NextAction
} from '../types/burnout';

// ==================== VALIDATION ====================

export function validateBurnoutInput(answers: AnswerData[]): ValidationResult {
	// Minimal 10 soal untuk hitung burnout
	if (answers.length < 10) {
		return {
			valid: false,
			reason: `Butuh minimal 10 soal untuk analisis burnout. Saat ini baru ${answers.length} soal.`
		};
	}

	// Filter out soal yang diskip atau timeSpent = 0
	const validAnswers = answers.filter(a => !a.isSkipped && a.timeSpent > 0);

	if (validAnswers.length < 8) {
		return {
			valid: false,
			reason: `Terlalu banyak soal yang diskip (${answers.length - validAnswers.length} soal diskip). Butuh minimal 8 soal yang dijawab.`
		};
	}

	// Deteksi outlier waktu (mungkin user idle)
	const times = validAnswers.map(a => a.timeSpent);
	const median = getMedian(times);

	// Jika median terlalu kecil, mungkin ada masalah tracking
	if (median < 5) {
		return {
			valid: false,
			reason: 'Waktu pengerjaan terlalu singkat. Kemungkinan ada masalah tracking waktu.'
		};
	}

	const outliers = times.filter(t => t > median * 5); // 5x median = outlier

	if (outliers.length > validAnswers.length * 0.3) {
		return {
			valid: false,
			reason: `Terlalu banyak waktu tidak konsisten (${outliers.length} soal). Kemungkinan ada idle/distraksi.`
		};
	}

	return { valid: true };
}

// ==================== QUARTILE HELPERS ====================

function splitIntoQuartiles<T>(array: T[]): [T[], T[], T[]] {
	const third = Math.floor(array.length / 3);
	return [
		array.slice(0, third),
		array.slice(third, third * 2),
		array.slice(third * 2)
	];
}

function calculateQuartileStats(answers: AnswerData[]): QuartileStats {
	if (answers.length === 0) {
		return { avgTime: 0, accuracy: 0, skipRate: 0 };
	}

	const validAnswers = answers.filter(a => !a.isSkipped && a.timeSpent > 0);

	if (validAnswers.length === 0) {
		return { avgTime: 0, accuracy: 0, skipRate: 100 };
	}

	const avgTime = validAnswers.reduce((sum, a) => sum + a.timeSpent, 0) / validAnswers.length;
	const correctCount = validAnswers.filter(a => a.isCorrect).length;
	const accuracy = (correctCount / validAnswers.length) * 100;
	const skipRate = ((answers.length - validAnswers.length) / answers.length) * 100;

	return {
		avgTime: Math.round(avgTime),
		accuracy: Math.round(accuracy * 10) / 10,
		skipRate: Math.round(skipRate * 10) / 10
	};
}

// ==================== COMPONENT CALCULATIONS ====================

function calculateCFI(q1: QuartileStats, q3: QuartileStats): number {
	// Cognitive Fatigue Index: perlambatan waktu
	if (q1.avgTime === 0 || q3.avgTime === 0) return 0;

	const cfi = ((q3.avgTime - q1.avgTime) / q1.avgTime) * 100;

	// Cap maksimal di 100%
	return Math.max(0, Math.min(100, Math.round(cfi * 10) / 10));
}

function calculateDQI(q1: QuartileStats, q3: QuartileStats): number {
	// Decision Quality Index: penurunan akurasi
	const dqi = q1.accuracy - q3.accuracy;

	// Cap maksimal di 100%
	return Math.max(0, Math.min(100, Math.round(dqi * 10) / 10));
}

function calculateEDI(q3: QuartileStats, answers: AnswerData[]): number {
	// Engagement Drop Index
	const q3Answers = answers.slice(Math.floor(answers.length * 2 / 3));
	const rapidAnswers = q3Answers.filter(a => !a.isSkipped && a.timeSpent < 10 && a.timeSpent > 0);
	const rapidRate = q3Answers.length > 0
		? (rapidAnswers.length / q3Answers.length) * 100
		: 0;

	const edi = (q3.skipRate * 0.5) + (rapidRate * 0.5);
	return Math.max(0, Math.min(100, Math.round(edi * 10) / 10));
}

function calculateTPC(answers: AnswerData[]): number {
	// Time Pattern Consistency
	const validAnswers = answers.filter(a => !a.isSkipped && a.timeSpent > 0);
	const times = validAnswers.map(a => a.timeSpent);

	if (times.length < 2) return 100;

	const mean = times.reduce((sum, t) => sum + t, 0) / times.length;
	const variance = times.reduce((sum, t) => sum + Math.pow(t - mean, 2), 0) / times.length;
	const stdDev = Math.sqrt(variance);
	const cv = mean > 0 ? (stdDev / mean) * 100 : 0; // Coefficient of Variation

	const tpc = 100 - Math.min(cv, 100);
	return Math.round(tpc * 10) / 10;
}

// ==================== MAIN CALCULATION ====================

export function calculateBurnout(input: BurnoutCalculationInput): BurnoutCalculationResult {
	const { answers } = input;

	// Validasi
	const validation = validateBurnoutInput(answers);
	if (!validation.valid) {
		throw new Error(validation.reason);
	}

	// Filter valid answers untuk perhitungan
	const validAnswers = answers.filter(a => !a.isSkipped && a.timeSpent > 0);

	// Split into quartiles
	const [q1Answers, q2Answers, q3Answers] = splitIntoQuartiles(validAnswers);

	// Calculate quartile stats
	const q1Stats = calculateQuartileStats(q1Answers);
	const q2Stats = calculateQuartileStats(q2Answers);
	const q3Stats = calculateQuartileStats(q3Answers);

	// Calculate components
	const cfi = calculateCFI(q1Stats, q3Stats);
	const dqi = calculateDQI(q1Stats, q3Stats);
	const edi = calculateEDI(q3Stats, validAnswers);
	const tpc = calculateTPC(validAnswers);

	// Weights - disesuaikan untuk lebih sensitive
	const weights = {
		cfi: 0.35,  // Cognitive load paling penting
		dqi: 0.30,  // Decision quality
		edi: 0.20,  // Engagement
		tpc: 0.15   // Consistency
	};

	// Composite score
	const fatigueIndex = Math.round(
		(cfi * weights.cfi +
			dqi * weights.dqi +
			edi * weights.edi +
			(100 - tpc) * weights.tpc) * 10
	) / 10;

	// Determine burnout level - threshold disesuaikan
	const burnoutLevel: BurnoutLevel =
		fatigueIndex >= 50 ? 'SEVERE' :    // Lebih strict
			fatigueIndex >= 35 ? 'MODERATE' :
				fatigueIndex >= 20 ? 'MILD' :
					'NONE';

	// Generate recommendations
	const recommendations = generateRecommendations(burnoutLevel, fatigueIndex);

	// Session stats
	const totalDuration = validAnswers.reduce((sum, a) => sum + a.timeSpent, 0);
	const avgTimePerQ = validAnswers.length > 0 ? totalDuration / validAnswers.length : 0;
	const correctCount = validAnswers.filter(a => a.isCorrect).length;
	const accuracyRate = validAnswers.length > 0 ? (correctCount / validAnswers.length) * 100 : 0;
	const skipRate = answers.length > 0 ? ((answers.length - validAnswers.length) / answers.length) * 100 : 0;

	return {
		burnoutLevel,
		fatigueIndex,
		components: {
			cognitiveLoad: {
				value: cfi,
				weight: weights.cfi,
				contribution: Math.round(cfi * weights.cfi * 10) / 10,
				interpretation: `Perlambatan ${cfi.toFixed(1)}% dari awal ke akhir`
			},
			decisionQuality: {
				value: dqi,
				weight: weights.dqi,
				contribution: Math.round(dqi * weights.dqi * 10) / 10,
				interpretation: `Akurasi turun ${dqi.toFixed(1)}% dari Q1 ke Q3`
			},
			engagement: {
				value: edi,
				weight: weights.edi,
				contribution: Math.round(edi * weights.edi * 10) / 10,
				interpretation: `${edi.toFixed(1)}% soal di akhir diskip atau dijawab terburu-buru`
			},
			consistency: {
				value: tpc,
				weight: weights.tpc,
				contribution: Math.round((100 - tpc) * weights.tpc * 10) / 10,
				interpretation: `Konsistensi waktu: ${tpc.toFixed(1)}%`
			}
		},
		recommendations,
		sessionStats: {
			totalQuestions: answers.length,
			totalDuration: Math.round(totalDuration),
			avgTimePerQ: Math.round(avgTimePerQ),
			accuracyRate: Math.round(accuracyRate * 10) / 10,
			skipRate: Math.round(skipRate * 10) / 10,
			quartiles: {
				q1: q1Stats,
				q2: q2Stats,
				q3: q3Stats
			}
		}
	};
}

// ==================== RECOMMENDATIONS ====================

function generateRecommendations(
	level: BurnoutLevel, fatigueIndex: number
) {
	const recommendations: Record<BurnoutLevel, {
		shouldRest: boolean;
		restDuration: number;
		message: string;
		nextAction: NextAction;
	}> = {
		NONE: {
			shouldRest: false,
			restDuration: 0,
			message: '🎯 Kondisi prima! Fokus dan energi masih sangat baik. Lanjutkan dengan performa terbaikmu!',
			nextAction: 'CONTINUE'
		},
		MILD: {
			shouldRest: true,
			restDuration: 5,
			message: '💡 Mulai ada tanda-tanda kelelahan ringan. Istirahat 5 menit akan refresh fokusmu.',
			nextAction: 'REST'
		},
		MODERATE: {
			shouldRest: true,
			restDuration: 15,
			message: '⚠️ Kelelahan cukup terdeteksi. Istirahat 10-15 menit atau ganti topik dulu untuk recovery.',
			nextAction: 'SWITCH_TOPIC'
		},
		SEVERE: {
			shouldRest: true,
			restDuration: 30,
			message: '🛑 Burnout terdeteksi! Otakmu butuh istirahat serius. Better stop dan lanjut besok setelah tidur cukup.',
			nextAction: 'STOP_SESSION'
		}
	};

	return recommendations[level];
}

// ==================== UTILITY FUNCTIONS ====================

function getMedian(numbers: number[]): number {
	if (numbers.length === 0) return 0;

	const sorted = [...numbers].sort((a, b) => a - b);
	const mid = Math.floor(sorted.length / 2);
	return sorted.length % 2 === 0
		? (sorted[mid - 1] + sorted[mid]) / 2
		: sorted[mid];
}