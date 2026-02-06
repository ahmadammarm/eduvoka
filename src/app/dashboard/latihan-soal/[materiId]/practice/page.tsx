'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { useSoalByMateri, useLatihanSession } from '@/hooks/use-latihan-soal';
import { SessionType, JawabanUser } from '@/types/latihan-soal';
import {
	ChevronLeft,
	ChevronRight,
	Check,
	X,
	Flag,
	Loader2,
	Clock,
	AlertCircle
} from 'lucide-react';

export default function PracticePage() {
	const params = useParams();
	const searchParams = useSearchParams();
	const router = useRouter();

	const materiId = params.materiId as string;
	const mode = searchParams.get('mode') as SessionType || 'LATIHAN';

	const { soalList, materi, loading } = useSoalByMateri(materiId, mode);
	const {
		sessionId,
		currentIndex,
		progress,
		createSession,
		submitAnswer,
		nextQuestion,
		previousQuestion,
		goToQuestion,
		completeSession
	} = useLatihanSession();

	const [selectedPilihan, setSelectedPilihan] = useState<string | null>(null);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [showResult, setShowResult] = useState(false);
	const [currentResult, setCurrentResult] = useState<JawabanUser | null>(null);
	const [timeElapsed, setTimeElapsed] = useState(0);
	const [isInitializing, setIsInitializing] = useState(true);
	const [hasInitialized, setHasInitialized] = useState(false);

	const currentSoal = soalList[currentIndex];
	const currentProgress = currentSoal ? progress.get(currentSoal.id) : null;
	const isLastQuestion = currentIndex === soalList.length - 1;

	useEffect(() => {
		if (loading) return;
		if (soalList.length === 0) return;
		if (hasInitialized || sessionId) return;

		const initSession = async () => {
			try {
				setIsInitializing(true);
				console.log('Creating session:', { mode, materiId });

				const newSessionId = await createSession(mode, materiId);

				console.log('Session created:', newSessionId);
				setHasInitialized(true);
			} catch (error) {
				console.error('Failed to create session:', error);
				alert('Gagal membuat sesi latihan. Silakan coba lagi.');
				router.push(`/latihan-soal/${materiId}`);
			} finally {
				setIsInitializing(false);
			}
		};

		initSession();
	}, [loading, soalList.length, sessionId, hasInitialized, mode, materiId, createSession, router]);

	useEffect(() => {
		if (!sessionId) return;

		const interval = setInterval(() => {
			setTimeElapsed(prev => prev + 1);
		}, 1000);

		return () => clearInterval(interval);
	}, [sessionId]);

	useEffect(() => {
		if (currentProgress?.answered) {
			setSelectedPilihan(currentProgress.pilihanId || null);
			setShowResult(true);
			setCurrentResult({
				id: '',
				pilihanId: currentProgress.pilihanId || '',
				isCorrect: currentProgress.isCorrect,
				kunciJawaban: undefined,
				answeredAt: new Date()
			});
		} else {
			setSelectedPilihan(null);
			setShowResult(false);
			setCurrentResult(null);
		}
	}, [currentIndex, currentProgress]);

	const handleSubmitAnswer = async () => {
		if (!currentSoal || !sessionId) {
			console.error('Cannot submit: missing soal or session', {
				hasSoal: !!currentSoal,
				sessionId
			});
			alert('Session belum siap. Silakan refresh halaman.');
			return;
		}

		if (!selectedPilihan) {
			alert('Pilih jawaban terlebih dahulu');
			return;
		}

		setIsSubmitting(true);
		try {
			const result = await submitAnswer(
				materiId,
				currentSoal.id,
				selectedPilihan,
				false
			);

			if (result) {
				setCurrentResult(result);
				setShowResult(true);
			}
		} catch (err) {
			console.error('Error submitting answer:', err);
			alert('Gagal menyimpan jawaban. Silakan coba lagi.');
		} finally {
			setIsSubmitting(false);
		}
	};

	const handleSkip = async () => {
		if (!currentSoal || !sessionId) return;

		setIsSubmitting(true);
		try {
			await submitAnswer(materiId, currentSoal.id, null, true);
			handleNext();
		} catch (err) {
			alert('Gagal skip soal');
		} finally {
			setIsSubmitting(false);
		}
	};

	const handleNext = () => {
		if (isLastQuestion) {
			handleFinish();
		} else {
			nextQuestion();
		}
	};

	const handleFinish = async () => {
		if (!sessionId) return;

		const confirmFinish = confirm(
			'Apakah Anda yakin ingin menyelesaikan latihan?'
		);

		if (!confirmFinish) return;

		try {
			const result = await completeSession();
			if (result) {
				// Redirect to Socratic Review page first
				router.push(`/dashboard/latihan-soal/${materiId}/review?sessionId=${sessionId}`);
			}
		} catch (err) {
			alert('Gagal menyelesaikan sesi');
		}
	};

	const formatTime = (seconds: number) => {
		const mins = Math.floor(seconds / 60);
		const secs = seconds % 60;
		return `${mins}:${secs.toString().padStart(2, '0')}`;
	};

	if (loading || isInitializing) {
		return (
			<div className="flex flex-col items-center justify-center min-h-screen gap-4">
				<Loader2 className="w-8 h-8 animate-spin text-blue-500" />
				<p className="text-gray-600">
					{loading
						? 'Memuat soal...'
						: isInitializing
							? 'Mempersiapkan sesi latihan...'
							: 'Loading...'}
				</p>
			</div>
		);
	}

	if (!loading && soalList.length === 0) {
		return (
			<div className="container mx-auto px-4 py-8">
				<div className="max-w-md mx-auto">
					<div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
						<AlertCircle className="w-12 h-12 text-yellow-600 mx-auto mb-4" />
						<h2 className="text-xl font-semibold text-gray-900 mb-2">
							Tidak Ada Soal Tersedia
						</h2>
						<p className="text-gray-600 mb-6">
							Belum ada soal untuk mode ini. Silakan pilih mode lain atau kembali ke daftar materi.
						</p>
						<button
							onClick={() => router.push(`/dashboard/latihan-soal/${materiId}`)}
							className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
						>
							Kembali ke Materi
						</button>
					</div>
				</div>
			</div>
		);
	}

	if (!currentSoal) {
		return (
			<div className="container mx-auto px-4 py-8">
				<div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-800">
					<p>Error: Soal tidak ditemukan</p>
					<button
						onClick={() => router.push(`/dashboard/latihan-soal/${materiId}`)}
						className="mt-4 px-4 py-2 bg-red-600 text-white rounded"
					>
						Kembali
					</button>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-gray-50">
			{/* Header */}
			<div className="bg-white border-b border-gray-200 sticky top-0 z-10">
				<div className="container mx-auto px-4 py-4">
					<div className="flex items-center justify-between mb-4">
						<div>
							<h1 className="text-xl font-semibold text-gray-900">
								{materi?.nama}
							</h1>
							<p className="text-sm text-gray-600">
								Soal {currentIndex + 1} dari {soalList.length}
							</p>
						</div>
						<div className="flex items-center gap-4">
							<div className="flex items-center gap-2 text-gray-600">
								<Clock className="w-5 h-5" />
								<span className="font-mono">{formatTime(timeElapsed)}</span>
							</div>
						</div>
					</div>

					{/* Progress Bar */}
					<div className="w-full bg-gray-200 rounded-full h-2">
						<div
							className="bg-blue-600 h-2 rounded-full transition-all"
							style={{
								width: `${((currentIndex + 1) / soalList.length) * 100}%`
							}}
						/>
					</div>
				</div>
			</div>

			{/* Content */}
			<div className="container mx-auto px-4 py-8 max-w-4xl">
				{/* Question Navigation */}
				<div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
					<div className="flex flex-wrap gap-2">
						{soalList.map((soal, idx) => {
							const soalProgress = progress.get(soal.id);
							return (
								<button
									key={soal.id}
									onClick={() => goToQuestion(idx)}
									className={`w-10 h-10 rounded-lg font-semibold transition-all ${idx === currentIndex
										? 'bg-blue-600 text-white'
										: soalProgress?.answered
											? soalProgress.isCorrect
												? 'bg-green-100 text-green-700 border-2 border-green-500'
												: 'bg-red-100 text-red-700 border-2 border-red-500'
											: 'bg-gray-100 text-gray-700 hover:bg-gray-200'
										}`}
								>
									{idx + 1}
								</button>
							);
						})}
					</div>
				</div>

				{/* Question */}
				<div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
					<div className="mb-6">
						<div className="flex items-center justify-between mb-4">
							<span className="text-sm font-medium text-gray-500">
								Tingkat Kesulitan: {'⭐'.repeat(currentSoal.tingkatKesulitan)}
							</span>
							{currentProgress?.answered && (
								<span
									className={`flex items-center gap-1 text-sm font-semibold ${currentProgress.isCorrect
										? 'text-green-600'
										: 'text-red-600'
										}`}
								>
									{currentProgress.isCorrect ? (
										<>
											<Check className="w-4 h-4" />
											Benar
										</>
									) : (
										<>
											<X className="w-4 h-4" />
											Salah
										</>
									)}
								</span>
							)}
						</div>

						<div
							className="prose max-w-none text-gray-900"
							dangerouslySetInnerHTML={{ __html: currentSoal.content }}
						/>
					</div>

					{/* Options */}
					<div className="space-y-3">
						{currentSoal.pilihanJawaban.map((pilihan) => {
							const isSelected = selectedPilihan === pilihan.id;
							const isCorrectAnswer = showResult &&
								currentResult?.kunciJawaban === pilihan.label;
							const isWrongSelected = showResult &&
								isSelected &&
								currentResult?.isCorrect === false;

							return (
								<button
									key={pilihan.id}
									onClick={() => {
										if (!showResult) setSelectedPilihan(pilihan.id);
									}}
									disabled={showResult}
									className={`w-full text-left p-4 rounded-lg border-2 transition-all ${isCorrectAnswer
										? 'border-green-500 bg-green-50'
										: isWrongSelected
											? 'border-red-500 bg-red-50'
											: isSelected
												? 'border-blue-500 bg-blue-50'
												: 'border-gray-200 hover:border-gray-300'
										} ${showResult ? 'cursor-default' : 'cursor-pointer'}`}
								>
									<div className="flex items-start gap-3">
										<div
											className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-semibold ${isCorrectAnswer
												? 'bg-green-500 text-white'
												: isWrongSelected
													? 'bg-red-500 text-white'
													: isSelected
														? 'bg-blue-500 text-white'
														: 'bg-gray-100 text-gray-700'
												}`}
										>
											{pilihan.label}
										</div>
										<div className="flex-1 pt-1">
											<div
												className="text-gray-900"
												dangerouslySetInnerHTML={{ __html: pilihan.pilihan }}
											/>
										</div>
										{isCorrectAnswer && (
											<Check className="w-5 h-5 text-green-500 flex-shrink-0" />
										)}
										{isWrongSelected && (
											<X className="w-5 h-5 text-red-500 flex-shrink-0" />
										)}
									</div>
								</button>
							);
						})}
					</div>
				</div>

				{/* Actions */}
				<div className="flex items-center justify-between gap-4">
					<button
						onClick={previousQuestion}
						disabled={currentIndex === 0}
						className="flex items-center gap-2 px-6 py-3 rounded-lg border-2 border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
					>
						<ChevronLeft className="w-5 h-5" />
						Sebelumnya
					</button>

					<div className="flex gap-3">
						{!showResult && (
							<>
								<button
									onClick={handleSkip}
									disabled={isSubmitting}
									className="flex items-center gap-2 px-6 py-3 rounded-lg border-2 border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 disabled:opacity-50 transition-colors"
								>
									<Flag className="w-5 h-5" />
									Lewati
								</button>
								<button
									onClick={handleSubmitAnswer}
									disabled={!selectedPilihan || isSubmitting}
									className="px-6 py-3 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
								>
									{isSubmitting ? 'Menyimpan...' : 'Submit Jawaban'}
								</button>
							</>
						)}
					</div>

					<button
						onClick={handleNext}
						className="flex items-center gap-2 px-6 py-3 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-colors"
					>
						{isLastQuestion ? 'Selesai' : 'Selanjutnya'}
						<ChevronRight className="w-5 h-5" />
					</button>
				</div>
			</div>
		</div>
	);
}