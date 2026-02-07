'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import {
	Trophy,
	Target,
	Clock,
	CheckCircle2,
	XCircle,
	BarChart3,
	ArrowRight,
	Home,
	RotateCcw,
	Loader2,
	TrendingUp,
	AlertCircle,
	BookOpen
} from 'lucide-react';
import Link from 'next/link';

interface SessionResultData {
	sessionId: string;
	userId: string;
	userName: string;
	type: string;
	materiId: string | null;
	score: number;
	totalQuestions: number;
	totalAnswered: number;
	answeredQuestions: number;
	correctAnswers: number;
	wrongAnswers: number;
	skippedQuestions: number;
	accuracyRate: number;
	completionRate: number;
	totalDuration: number;
	averageTimePerQ: number;
	startedAt: string;
	endedAt: string | null;
	difficultyBreakdown: Array<{
		level: number;
		total: number;
		correct: number;
		accuracy: number;
	}>;
	answers: Array<{
		soalId: string;
		pilihanId: string | null;
		pilihanLabel: string | null;
		kunciJawaban: string;
		isCorrect: boolean | null;
		isSkipped: boolean;
		timeSpent: number | null;
		answeredAt: string | null;
		tingkatKesulitan: number;
	}>;
}

export default function ResultPage() {
	const params = useParams();
	const searchParams = useSearchParams();
	const router = useRouter();

	const materiId = params.materiId as string;
	const sessionId = searchParams.get('sessionId');

	const [result, setResult] = useState<SessionResultData | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		if (!sessionId) {
			router.push(`/dashboard/latihan-soal/${materiId}`);
			return;
		}

		const fetchResult = async () => {
			try {
				setLoading(true);
				setError(null);

				const response = await fetch(`/api/latihan-soal/session/${sessionId}/result`);

				if (!response.ok) {
					throw new Error('Failed to fetch result');
				}

				const data = await response.json();
				console.log('Result data:', data);

				setResult(data.data);
			} catch (err) {
				console.error('Error fetching result:', err);
				setError(err instanceof Error ? err.message : 'Failed to load results');
			} finally {
				setLoading(false);
			}
		};

		fetchResult();
	}, [sessionId, materiId, router]);

	const formatTime = (seconds: number) => {
		const mins = Math.floor(seconds / 60);
		const secs = seconds % 60;
		return `${mins}m ${secs}s`;
	};

	const getScoreColor = (score: number) => {
		if (score >= 80) return 'text-green-600';
		if (score >= 60) return 'text-yellow-600';
		return 'text-red-600';
	};

	const getScoreLabel = (score: number) => {
		if (score >= 80) return 'Luar Biasa!';
		if (score >= 60) return 'Bagus!';
		return 'Terus Berlatih!';
	};

	const getScoreBgColor = (score: number) => {
		if (score >= 80) return 'from-green-400 to-green-600';
		if (score >= 60) return 'from-yellow-400 to-yellow-600';
		return 'from-red-400 to-red-600';
	};

	if (loading) {
		return (
			<div className="flex flex-col items-center justify-center min-h-screen gap-4">
				<Loader2 className="w-12 h-12 animate-spin text-blue-600" />
				<p className="text-gray-600">Memuat hasil...</p>
			</div>
		);
	}

	if (error || !result) {
		return (
			<div className="container mx-auto px-4 py-8">
				<div className="max-w-md mx-auto">
					<div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
						<AlertCircle className="w-12 h-12 text-red-600 mx-auto mb-4" />
						<h2 className="text-xl font-semibold text-gray-900 mb-2">
							Gagal Memuat Hasil
						</h2>
						<p className="text-gray-600 mb-6">
							{error || 'Terjadi kesalahan saat memuat hasil latihan'}
						</p>
						<Link
							href={`/dashboard/latihan-soal/${materiId}`}
							className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
						>
							Kembali ke Materi
						</Link>
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-12">
			<div className="container mx-auto px-4 max-w-4xl">
				{/* Header with Trophy */}
				<div className="text-center mb-8">
					<div className={`inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br ${getScoreBgColor(result.score)} rounded-full mb-4 shadow-lg`}>
						<Trophy className="w-12 h-12 text-white" />
					</div>
					<h1 className="text-3xl font-bold text-gray-900 mb-2">
						Latihan Selesai!
					</h1>
					<p className="text-gray-600">
						{result.type === 'LATIHAN' ? 'Mode Latihan' : 'Mode Try Out'}
					</p>
				</div>

				{/* Score Card */}
				<div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8 mb-6">
					<div className="text-center mb-8">
						<div className={`text-6xl font-bold ${getScoreColor(result.score)} mb-2`}>
							{result.score}
						</div>
						<div className="text-xl text-gray-600 mb-4">
							{getScoreLabel(result.score)}
						</div>
						<div className="inline-block bg-gray-100 rounded-full px-4 py-2">
							<span className="text-sm font-medium text-gray-700">
								{result.correctAnswers} dari {result.answeredQuestions} dijawab benar
							</span>
						</div>
						{result.skippedQuestions > 0 && (
							<div className="mt-2">
								<span className="text-sm text-gray-500">
									({result.skippedQuestions} soal dilewati)
								</span>
							</div>
						)}
					</div>

					{/* Stats Grid */}
					<div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
						<div className="bg-blue-50 rounded-lg p-4 text-center">
							<Target className="w-6 h-6 text-blue-600 mx-auto mb-2" />
							<div className="text-2xl font-bold text-gray-900">
								{result.accuracyRate.toFixed(1)}%
							</div>
							<div className="text-xs text-gray-600">Akurasi</div>
						</div>

						<div className="bg-green-50 rounded-lg p-4 text-center">
							<CheckCircle2 className="w-6 h-6 text-green-600 mx-auto mb-2" />
							<div className="text-2xl font-bold text-gray-900">
								{result.correctAnswers}
							</div>
							<div className="text-xs text-gray-600">Benar</div>
						</div>

						<div className="bg-red-50 rounded-lg p-4 text-center">
							<XCircle className="w-6 h-6 text-red-600 mx-auto mb-2" />
							<div className="text-2xl font-bold text-gray-900">
								{result.wrongAnswers}
							</div>
							<div className="text-xs text-gray-600">Salah</div>
						</div>

						<div className="bg-purple-50 rounded-lg p-4 text-center">
							<Clock className="w-6 h-6 text-purple-600 mx-auto mb-2" />
							<div className="text-2xl font-bold text-gray-900">
								{formatTime(result.totalDuration)}
							</div>
							<div className="text-xs text-gray-600">Total Waktu</div>
						</div>
					</div>

					{/* Performance Bars */}
					<div className="space-y-3 mb-6">
						<div>
							<div className="flex justify-between text-sm mb-1">
								<span className="text-gray-600">Tingkat Penyelesaian</span>
								<span className="font-semibold text-gray-900">
									{result.completionRate.toFixed(0)}%
								</span>
							</div>
							<div className="w-full bg-gray-200 rounded-full h-2">
								<div
									className="bg-blue-600 h-2 rounded-full transition-all"
									style={{ width: `${result.completionRate}%` }}
								/>
							</div>
						</div>

						<div>
							<div className="flex justify-between text-sm mb-1">
								<span className="text-gray-600">Rata-rata Waktu per Soal</span>
								<span className="font-semibold text-gray-900">
									{formatTime(Math.round(result.averageTimePerQ))}
								</span>
							</div>
						</div>
					</div>

					{/* Difficulty Breakdown */}
					{result.difficultyBreakdown && result.difficultyBreakdown.length > 0 && (
						<div className="border-t pt-6">
							<h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
								<TrendingUp className="w-5 h-5" />
								Performa per Tingkat Kesulitan
							</h3>
							<div className="space-y-3">
								{result.difficultyBreakdown.map((diff) => (
									<div key={diff.level}>
										<div className="flex justify-between text-sm mb-1">
											<span className="text-gray-600">
												{'⭐'.repeat(diff.level)} Level {diff.level}
											</span>
											<span className="font-semibold text-gray-900">
												{diff.correct}/{diff.total} ({diff.accuracy}%)
											</span>
										</div>
										<div className="w-full bg-gray-200 rounded-full h-1.5">
											<div
												className={`h-1.5 rounded-full transition-all ${diff.accuracy >= 80
													? 'bg-green-500'
													: diff.accuracy >= 60
														? 'bg-yellow-500'
														: 'bg-red-500'
													}`}
												style={{ width: `${diff.accuracy}%` }}
											/>
										</div>
									</div>
								))}
							</div>
						</div>
					)}
				</div>

				{/* Recommendations */}
				<div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl shadow-lg p-6 mb-6 text-white">
					<div className="flex items-start gap-4">
						<BarChart3 className="w-8 h-8 flex-shrink-0" />
						<div>
							<h3 className="font-semibold text-lg mb-2">
								Rekomendasi untuk Anda
							</h3>
							<p className="text-blue-50 text-sm">
								{result.score >= 80
									? 'Luar biasa! Anda sudah menguasai materi ini dengan baik. Cobalah materi yang lebih menantang atau ikuti try out untuk mengukur kemampuan Anda.'
									: result.score >= 60
										? 'Bagus! Anda sudah memahami sebagian besar materi. Review kembali soal yang salah dan pelajari pembahasannya untuk meningkatkan pemahaman.'
										: 'Tetap semangat! Fokus pada pemahaman konsep dasar sebelum melanjutkan. Ulangi latihan ini atau pelajari materi terkait terlebih dahulu.'}
							</p>
						</div>
					</div>
				</div>

				{/* Summary Stats */}
				<div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
					<h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
						<BookOpen className="w-5 h-5" />
						Ringkasan Sesi
					</h3>
					<div className="grid grid-cols-2 gap-4 text-sm">
						<div>
							<span className="text-gray-600">Total Soal:</span>
							<span className="ml-2 font-semibold text-gray-900">
								{result.totalQuestions}
							</span>
						</div>
						<div>
							<span className="text-gray-600">Dijawab:</span>
							<span className="ml-2 font-semibold text-gray-900">
								{result.answeredQuestions}
							</span>
						</div>
						<div>
							<span className="text-gray-600">Dilewati:</span>
							<span className="ml-2 font-semibold text-gray-900">
								{result.skippedQuestions}
							</span>
						</div>
						<div>
							<span className="text-gray-600">Waktu Mulai:</span>
							<span className="ml-2 font-semibold text-gray-900">
								{new Date(result.startedAt).toLocaleTimeString('id-ID')}
							</span>
						</div>
					</div>
				</div>

				{/* Action Buttons */}
				<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
					<Link
						href={`/dashboard/latihan-soal/${materiId}`}
						className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-6 rounded-lg transition-colors"
					>
						<RotateCcw className="w-5 h-5" />
						Latihan Lagi
					</Link>

					<Link
						href="/dashboard/latihan-soal"
						className="flex items-center justify-center gap-2 bg-white hover:bg-gray-50 text-gray-700 font-semibold py-4 px-6 rounded-lg border-2 border-gray-300 transition-colors"
					>
						<ArrowRight className="w-5 h-5" />
						Materi Lain
					</Link>

					<Link
						href="/"
						className="flex items-center justify-center gap-2 bg-white hover:bg-gray-50 text-gray-700 font-semibold py-4 px-6 rounded-lg border-2 border-gray-300 transition-colors"
					>
						<Home className="w-5 h-5" />
						Ke Beranda
					</Link>
				</div>

				{/* Session ID */}
				<div className="mt-8 text-center">
					<p className="text-xs text-gray-400">
						Session ID: {sessionId}
					</p>
				</div>
			</div>
		</div>
	);
}