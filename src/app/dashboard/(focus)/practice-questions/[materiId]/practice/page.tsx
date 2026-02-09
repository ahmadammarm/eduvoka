'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { useSoalByMateri, useLatihanSession } from '@/hooks/use-latihan-soal'
import { useLatihanCapture } from '@/hooks/capture/use-latihan-capture';
import { SessionType, JawabanUser } from '@/types/latihan-soal';
import Swal from 'sweetalert2';
import {
	ChevronLeft,
	ChevronRight,
	Check,
	X,
	Loader2,
	Clock,
	AlertCircle,
	Flag
} from 'lucide-react';
import { useBurnoutMetrics } from '@/hooks/use-burnout';
import { BurnoutCalculationResult } from '@/types/burnout';


const CHECK_BURNOUT_EVERY_N_QUESTIONS = 5; // Check setiap 5 soal


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

	// Data capture layer
	const {
		initCapture,
		captureQuestionView,
		captureAnswerChange,
		captureAnswerSubmit,
		captureAnswerSkip,
		captureSessionComplete,
	} = useLatihanCapture();

	const {
		calculateBurnout,
		isCalculating: isCalculatingBurnout
	} = useBurnoutMetrics();

	const [selectedPilihan, setSelectedPilihan] = useState<string | null>(null);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [showResult, setShowResult] = useState(false);
	const [currentResult, setCurrentResult] = useState<JawabanUser | null>(null);
	const [timeElapsed, setTimeElapsed] = useState(0);
	const [isInitializing, setIsInitializing] = useState(true);
	const [hasInitialized, setHasInitialized] = useState(false);
	const [questionCount, setQuestionCount] = useState(0);

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
				Swal.fire({
					icon: 'error',
					title: 'Failed to Create Session',
					text: 'Please try again',
					confirmButtonColor: '#3b82f6'
				});
				router.push(`/practice-questions/${materiId}`);
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

	// Init capture when session is created
	useEffect(() => {
		if (sessionId && materiId) {
			initCapture(sessionId, materiId);
		}
	}, [sessionId, materiId, initCapture]);

	// Capture question view on index change
	useEffect(() => {
		if (currentSoal && sessionId) {
			captureQuestionView(currentSoal.id, currentIndex, soalList.length);
		}
	}, [currentIndex, currentSoal?.id, sessionId, soalList.length, captureQuestionView]);


	// Wrap setSelectedPilihan to capture answer changes
	const handleSelectPilihan = (pilihanId: string) => {
		setSelectedPilihan(pilihanId);
		if (currentSoal) {
			captureAnswerChange(currentSoal.id, pilihanId);
		}
	};

	const handleSubmitAnswer = async () => {
		if (!currentSoal || !sessionId) {
			Swal.fire({
				icon: 'warning',
				title: 'Session Not Ready',
				text: 'Please refresh the page',
				confirmButtonColor: '#3b82f6'
			});
			return;
		}

		if (!selectedPilihan) {
			Swal.fire({
				icon: 'info',
				title: 'Select Answer',
				text: 'Please select an answer first',
				confirmButtonColor: '#3b82f6'
			});
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

				// Capture answer submit
				captureAnswerSubmit(
					currentSoal.id,
					selectedPilihan,
					result.isCorrect ?? false,
				);

				// Increment question counter
				setQuestionCount(prev => {
					const newCount = prev + 1;

					// ✅ FIX: Check burnout setiap N soal
					if (newCount > 0 && newCount % CHECK_BURNOUT_EVERY_N_QUESTIONS === 0) {
						// Delay sedikit agar UI smooth
						setTimeout(() => {
							checkRealtimeBurnout();
						}, 500);
					}

					return newCount;
				});
			}
		} catch (err) {
			console.error('Error submitting answer:', err);
			Swal.fire({
				icon: 'error',
				title: 'Failed to Save',
				text: 'Failed to save answer. Please try again',
				confirmButtonColor: '#3b82f6'
			});
		} finally {
			setIsSubmitting(false);
		}
	};

	const handleSkip = async () => {
		if (!currentSoal || !sessionId) return;

		setIsSubmitting(true);
		try {
			await submitAnswer(materiId, currentSoal.id, null, true);

			// Capture the skip
			captureAnswerSkip(currentSoal.id);

			handleNext();
		} catch (err) {
			Swal.fire({
				icon: 'error',
				title: 'Gagal Skip',
				text: 'Gagal skip soal. Silakan coba lagi',
				confirmButtonColor: '#3b82f6'
			});
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

	const checkRealtimeBurnout = async () => {
		if (!sessionId) return;

		try {
			// Call burnout API
			const burnout = await calculateBurnout(sessionId);

			// Hanya show warning jika ada burnout (bukan NONE)
			if (burnout && burnout.burnoutLevel !== 'NONE') {

				// Destructure untuk readability
				const { burnoutLevel, fatigueIndex, recommendations } = burnout;

				const levelConfig = {
					MILD: {
						icon: 'info' as const,
						color: '#10b981',
						title: '💡 Istirahat Sebentar?'
					},
					MODERATE: {
						icon: 'warning' as const,
						color: '#f59e0b',
						title: '⚠️ Mulai Lelah Nih'
					},
					SEVERE: {
						icon: 'error' as const,
						color: '#ef4444',
						title: '🛑 Burnout Detected!'
					}
				};

				const config = levelConfig[burnoutLevel as keyof typeof levelConfig];
				if (!config) return; // NONE level

				// Show SweetAlert2 dengan auto-close untuk MILD
				const result = await Swal.fire({
					icon: config.icon,
					title: config.title,
					html: `
					<div class="text-left space-y-3">
						<div class="bg-gray-50 p-3 rounded-xl">
							<p class="text-sm text-gray-600 mb-1">Fatigue Index</p>
							<p class="text-2xl font-bold" style="color: ${config.color}">
								${fatigueIndex.toFixed(1)} / 100
							</p>
						</div>
						
						<div class="bg-blue-50 p-3 rounded-xl">
							<p class="text-sm font-semibold text-gray-700 mb-1">💡 Rekomendasi</p>
							<p class="text-sm text-gray-800">${recommendations.message}</p>
						</div>

						${recommendations.shouldRest ? `
							<div class="bg-green-50 p-3 rounded-xl">
								<p class="text-sm font-semibold text-gray-700 mb-1">⏱️ Saran Istirahat</p>
								<p class="text-sm text-gray-800">${recommendations.restDuration} menit</p>
							</div>
						` : ''}
					</div>
				`,
					showCancelButton: true,
					confirmButtonText: recommendations.shouldRest ? `Istirahat ${recommendations.restDuration} Menit` : 'OK',
					cancelButtonText: 'Lanjut Latihan',
					confirmButtonColor: config.color,
					cancelButtonColor: '#6b7280',
					// Auto-close untuk MILD setelah 10 detik
					timer: burnoutLevel === 'MILD' ? 10000 : undefined,
					timerProgressBar: true
				});

				// Jika user pilih istirahat
				if (result.isConfirmed && recommendations.shouldRest) {
					// Optional: Implement rest timer or pause session
					await Swal.fire({
						icon: 'success',
						title: 'Selamat Istirahat!',
						text: `Set timer ${recommendations.restDuration} menit dan kembali saat siap.`,
						timer: 3000,
						showConfirmButton: false
					});
				}
			}
		} catch (err) {
			// Silent fail untuk real-time checks - jangan ganggu user experience
			console.warn('[Practice] Real-time burnout check failed:', err);
		}
	};

	// ✅ BARU: Burnout warning modal
	const showBurnoutWarning = (burnout: BurnoutCalculationResult) => {
		const levelConfig = {
			MILD: { icon: 'info' as const, color: '#10b981' },
			MODERATE: { icon: 'warning' as const, color: '#f59e0b' },
			SEVERE: { icon: 'error' as const, color: '#ef4444' }
		};

		const config = levelConfig[burnout.burnoutLevel as keyof typeof levelConfig];
		if (!config) {
			// NONE level, langsung redirect
			router.push(`/dashboard/practice-questions/${materiId}/review?sessionId=${sessionId}`);
			return;
		}

		Swal.fire({
			icon: config.icon,
			title: 'Analisis Kelelahan',
			html: `
			<div class="text-left space-y-4">
				<div class="bg-gray-50 p-4 rounded-xl">
					<p class="text-sm text-gray-600 mb-2">Fatigue Index</p>
					<p class="text-3xl font-bold" style="color: ${config.color}">
						${burnout.fatigueIndex.toFixed(1)} / 100
					</p>
				</div>
				
				<div class="bg-blue-50 p-4 rounded-xl">
					<p class="text-sm font-semibold text-gray-700 mb-2">💡 Rekomendasi</p>
					<p class="text-gray-800">${burnout.recommendations.message}</p>
				</div>

				${burnout.recommendations.shouldRest ? `
					<div class="bg-green-50 p-4 rounded-xl">
						<p class="text-sm font-semibold text-gray-700 mb-2">⏱️ Waktu Istirahat</p>
						<p class="text-gray-800">${burnout.recommendations.restDuration} menit</p>
					</div>
				` : ''}
				
				<!-- Breakdown Components -->
				<div class="bg-gray-50 p-4 rounded-xl">
					<p class="text-sm font-semibold text-gray-700 mb-3">📊 Detail Analisis</p>
					<div class="space-y-2 text-sm">
						<div class="flex justify-between">
							<span class="text-gray-600">Cognitive Load:</span>
							<span class="font-semibold">${burnout.components.cognitiveLoad.value.toFixed(1)}%</span>
						</div>
						<div class="flex justify-between">
							<span class="text-gray-600">Decision Quality:</span>
							<span class="font-semibold">${burnout.components.decisionQuality.value.toFixed(1)}%</span>
						</div>
						<div class="flex justify-between">
							<span class="text-gray-600">Engagement:</span>
							<span class="font-semibold">${burnout.components.engagement.value.toFixed(1)}%</span>
						</div>
						<div class="flex justify-between">
							<span class="text-gray-600">Consistency:</span>
							<span class="font-semibold">${burnout.components.consistency.value.toFixed(1)}%</span>
						</div>
					</div>
				</div>
			</div>
		`,
			confirmButtonText: 'Lanjut ke Review',
			confirmButtonColor: '#3b82f6',
			showCancelButton: burnout.burnoutLevel === 'SEVERE',
			cancelButtonText: 'Istirahat Dulu',
			cancelButtonColor: '#6b7280',
			allowOutsideClick: false
		}).then((result) => {
			if (result.isConfirmed) {
				router.push(`/dashboard/practice-questions/${materiId}/review?sessionId=${sessionId}`);
			} else if (result.isDismissed) {
				// User chose to rest
				router.push('/dashboard');
			}
		});
	};

	const handleFinish = async () => {
		if (!sessionId) {
			console.error('[handleFinish] No sessionId');
			Swal.fire({
				icon: 'error',
				title: 'Error',
				text: 'Session ID tidak ditemukan',
				confirmButtonColor: '#3b82f6'
			});
			return;
		}

		const result = await Swal.fire({
			icon: 'question',
			title: 'Selesaikan Latihan?',
			text: 'Yakin ingin menyelesaikan latihan ini?',
			showCancelButton: true,
			confirmButtonColor: '#3b82f6',
			cancelButtonColor: '#6b7280',
			confirmButtonText: 'Ya, Selesaikan',
			cancelButtonText: 'Batal'
		});

		if (!result.isConfirmed) return;

		// Show loading
		Swal.fire({
			title: 'Menyimpan...',
			text: 'Mohon tunggu sebentar',
			allowOutsideClick: false,
			didOpen: () => {
				Swal.showLoading();
			}
		});

		try {
			console.log('[handleFinish] Starting completion for sessionId:', sessionId);

			// ✅ STEP 1: Complete session first
			const sessionResult = await completeSession();

			if (!sessionResult) {
				throw new Error('Failed to get session result');
			}

			console.log('[handleFinish] Session completed:', sessionResult);

			// ✅ STEP 2: Capture analytics
			const correctCount = Array.from(progress.values()).filter(
				(p) => p.answered && p.isCorrect
			).length;

			try {
				await captureSessionComplete({
					score: sessionResult.score ?? 0,
					totalQuestions: soalList.length,
					correctCount,
					totalDurationSeconds: sessionResult.totalDuration ?? 0,
				});
			} catch (captureError) {
				console.warn('[handleFinish] Capture failed (non-critical):', captureError);
			}

			// ✅ STEP 3: Calculate burnout (non-blocking, with timeout)
			const burnoutPromise = Promise.race([
				calculateBurnout(sessionId),
				new Promise<null>((resolve) => setTimeout(() => resolve(null), 5000)) // 5s timeout
			]);

			const burnout = await burnoutPromise;

			// Close loading
			Swal.close();

			// ✅ STEP 4: Show burnout warning or redirect
			if (burnout && burnout.burnoutLevel !== 'NONE') {
				showBurnoutWarning(burnout);
			} else {
				// Direct redirect
				router.push(`/dashboard/practice-questions/${materiId}/result?sessionId=${sessionId}`);
			}

		} catch (err) {
			console.error('[handleFinish] Error:', err);

			Swal.fire({
				icon: 'error',
				title: 'Gagal Menyelesaikan',
				text: err instanceof Error ? err.message : 'Terjadi kesalahan. Silakan coba lagi.',
				confirmButtonColor: '#3b82f6',
				footer: `<small>SessionId: ${sessionId}</small>`
			});
		}
	};

	useEffect(() => {
		console.log('📊 Current State:', {
			sessionId,
			currentIndex,
			soalListLength: soalList.length,
			progressSize: progress.size
		});
	}, [sessionId, currentIndex, soalList.length, progress]);

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
						? 'Loading questions...'
						: isInitializing
							? 'Preparing practice session...'
							: 'Loading...'}
				</p>
			</div>
		);
	}

	if (!loading && soalList.length === 0) {
		return (
			<div className="container mx-auto py-8">
				<div className="max-w-md mx-auto">
					<div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 text-center">
						<AlertCircle className="w-12 h-12 text-yellow-600 mx-auto mb-4" />
						<h2 className="text-xl font-semibold text-gray-900 mb-2">
							No Questions Available
						</h2>
						<p className="text-gray-600 mb-6">
							No questions for this mode yet. Please select another mode or return to materials.
						</p>
						<button
							onClick={() => router.push(`/dashboard/practice-questions/${materiId}`)}
							className="px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors"
						>
							Back to Materials
						</button>
					</div>
				</div>
			</div>
		);
	}

	if (!currentSoal) {
		return (
			<div className="container mx-auto px-4 py-8">
				<div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-800">
					<p>Error: Question not found</p>
					<button
						onClick={() => router.push(`/dashboard/practice-questions/${materiId}`)}
						className="mt-4 px-4 py-2 bg-red-600 text-white rounded"
					>
						Go Back
					</button>
				</div>
			</div>
		);
	}

	return (
		<div>
			{/* Header */}
			<div className="bg-white border-b border-gray-200 sticky top-0 z-10">
				<div className="container mx-auto max-w-4xl py-4">
					<div className="flex items-center justify-between mb-4">
						<div>
							<h1 className="text-xl font-semibold text-gray-900">
								{materi?.nama}
							</h1>
							<p className="text-sm text-gray-600">
								Question {currentIndex + 1} of {soalList.length}
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
			<div className="container mx-auto max-w-4xl py-8 mt-8">
				{/* Question Navigation */}
				<div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
					<div className="flex flex-wrap gap-2">
						{soalList.map((soal, idx) => {
							const soalProgress = progress.get(soal.id);
							return (
								<button
									key={soal.id}
									onClick={() => goToQuestion(idx)}
									className={`w-10 h-10 rounded-xl font-semibold transition-all ${idx === currentIndex
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
				<div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
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
										if (!showResult) handleSelectPilihan(pilihan.id); // ✅ FIX: Gunakan handleSelectPilihan
									}}
									disabled={showResult}
									className={`w-full text-left p-4 shadow-none rounded-lg border-2 transition-all ${isCorrectAnswer
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
						className="flex items-center gap-2 px-6 py-3 rounded-xl border-2 border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
					>
						<ChevronLeft className="w-5 h-5" />
						Sebelumnya
					</button>

					<div className="flex gap-3">
						{!showResult && (
							<>
								{/* ✅ RESTORE: Tombol Skip */}
								<button
									onClick={handleSkip}
									disabled={isSubmitting}
									className="flex items-center gap-2 px-6 py-3 rounded-xl border-2 border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 disabled:opacity-50 transition-colors"
								>
									<Flag className="w-5 h-5" />
									Lewati
								</button>
								<button
									onClick={handleSubmitAnswer}
									disabled={!selectedPilihan || isSubmitting}
									className="px-6 py-3 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
								>
									{isSubmitting ? 'Menyimpan...' : 'Submit Jawaban'}
								</button>
							</>
						)}
					</div>

					<button
						onClick={handleNext}
						className="flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-colors"
					>
						{isLastQuestion ? 'Selesai' : 'Selanjutnya'}
						<ChevronRight className="w-5 h-5" />
					</button>
				</div>
			</div>
		</div>
	);
}