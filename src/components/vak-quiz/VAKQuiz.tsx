/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { JSXElementConstructor, Key, ReactElement, ReactNode, ReactPortal, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ChevronLeft, ChevronRight, Check, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { toast } from 'sonner';

export const VAKQuiz = () => {
	const [currentIndex, setCurrentIndex] = useState(0);
	const [answers, setAnswers] = useState<Record<string, any>>({});
	const [needChoose, setNeedChoose] = useState(false);
	const [options, setOptions] = useState([]);
	const [selectedOption, setSelectedOption] = useState('');
	const [result, setResult] = useState<string | null>(null);
	const queryClient = useQueryClient();
	const { update: updateSession } = useSession();
	const router = useRouter();

	const { data: pertanyaan = [], isLoading } = useQuery({
		queryKey: ['pertanyaan-kuis-vak'],
		queryFn: async () => {
			const response = await fetch('/api/vak-quiz');
			if (!response.ok) throw new Error('Failed to fetch pertanyaan');
			return response.json();
		}
	});

	type AnswerPayload = { pertanyaanId: string; jawabanKuisVAKId: any }[];
	const submitMutation = useMutation<any, unknown, AnswerPayload>({
		mutationFn: async (answersArray: AnswerPayload) => {
			console.log("Sending answers:", answersArray);

			const response = await fetch('/api/vak-quiz/submit', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ answers: answersArray })
			});

			const data = await response.json();
			console.log("Response status:", response.status);
			console.log("Response data:", data);

			if (!response.ok) {
				throw new Error(data.message || 'Failed to submit answers');
			}

			return data;
		},
		onSuccess: async (data: any) => {
			console.log("Submit success:", data);
			if (data.needChoose) {
				setNeedChoose(true);
				setOptions(data.options);
			} else {
				setResult(data.result);

				console.log("Updating session with gayaBelajar:", data.result);
				await updateSession({
					gayaBelajar: data.result
				});

				queryClient.invalidateQueries({ queryKey: ['user-profile'] });

				setTimeout(() => {
					router.push('/dashboard');
					router.refresh();
				}, 1500);
			}
		},
		onError: (error: any) => {
			console.error('Submit error:', error);
			alert(`Terjadi kesalahan: ${error.message}`);
		}
	});

	const finalChoiceMutation = useMutation<any, unknown, string>({
		mutationFn: async (gayaBelajar: string) => {
			const response = await fetch('/api/vak-quiz/choose', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ gayaBelajar })
			});
			if (!response.ok) throw new Error('Failed to save choice');
			return response.json();
		},
		onSuccess: async () => {
			setResult(selectedOption);
			setNeedChoose(false);

			console.log("Updating session with selected gayaBelajar:", selectedOption);
			await updateSession({
				gayaBelajar: selectedOption
			});

			queryClient.invalidateQueries({ queryKey: ['user-profile'] });

			setTimeout(() => {
				router.push('/dashboard');
				router.refresh();
			}, 1500);
		},
		onError: (error) => {
			console.error('Error saving choice:', error);
			alert('Terjadi kesalahan');
		}
	});

	const handleSelectAnswer = (pertanyaanId: Key | null | undefined, jawabanId: Key | null | undefined) => {
		setAnswers(prev => ({
			...prev,
			[String(pertanyaanId)]: String(jawabanId)
		}));
	};

	const goToNext = () => {
		if (currentIndex < pertanyaan.length - 1) {
			setCurrentIndex(prev => prev + 1);
		}
	};

	const goToPrev = () => {
		if (currentIndex > 0) {
			setCurrentIndex(prev => prev - 1);
		}
	};

	const handleSubmit = () => {
		const answersArray = Object.entries(answers).map(([pertanyaanId, jawabanKuisVAKId]) => ({
			pertanyaanId,
			jawabanKuisVAKId
		}));

		if (answersArray.length !== pertanyaan.length) {
			toast.error('Harap jawab semua pertanyaan sebelum mengirim.');
			return;
		}

		submitMutation.mutate(answersArray);
	};

	const handleFinalChoice = () => {
		if (!selectedOption) {
			alert('Pilih salah satu gaya belajar');
			return;
		}

		finalChoiceMutation.mutate(selectedOption);
	};

	const getGayaBelajarLabel = (type: string | number) => {
		const labels = {
			VISUAL: 'Visual',
			AUDITORY: 'Auditory',
			KINESTHETIC: 'Kinesthetic'
		} as const;
		const key = String(type) as keyof typeof labels;
		return labels[key] ?? String(type);
	};

	const getGayaBelajarDescription = (type: string | number) => {
		const key = String(type);
		const descriptions: Record<string, string> = {
			VISUAL: 'Anda belajar dengan lebih baik melalui visualisasi, gambar, diagram, dan representasi visual lainnya.',
			AUDITORY: 'Anda belajar dengan lebih baik melalui mendengar, diskusi, dan penjelasan verbal.',
			KINESTHETIC: 'Anda belajar dengan lebih baik melalui praktek langsung, gerakan, dan pengalaman hands-on.'
		};
		return descriptions[key] || 'Deskripsi tidak tersedia.';
	};

	if (isLoading) {
		return (
			<div className="min-h-screen bg-linear-to-br from-orange-50 to-green-50 flex items-center justify-center">
				<Loader2 className="w-8 h-8 animate-spin text-[oklch(0.6_0.18_45.5)]" />
			</div>
		);
	}

	if (result) {
		return (
			<div className="min-h-screen bg-linear-to-br from-orange-50 to-green-50 flex items-center justify-center p-4">
				<div className="bg-white rounded-2xl shadow-2xl p-8 max-w-2xl w-full">
					<div className="text-center">
						<div className="w-20 h-20 bg-[oklch(0.6_0.18_45.5)] rounded-full flex items-center justify-center mx-auto mb-6">
							<Check className="w-10 h-10 text-white" />
						</div>
						<h2 className="text-3xl font-bold text-[oklch(0.25_0.08_142)] mb-4">
							Selamat! Kuis Selesai
						</h2>
						<p className="text-lg text-gray-600 mb-2">Gaya Belajar Anda:</p>
						<p className="text-4xl font-bold text-[oklch(0.6_0.18_45.5)] mb-4">
							{getGayaBelajarLabel(result)}
						</p>
						<p className="text-gray-700 leading-relaxed mb-6">
							{getGayaBelajarDescription(result)}
						</p>
						<div className="flex items-center justify-center gap-2 text-sm text-gray-500">
							<Loader2 className="w-4 h-4 animate-spin" />
							<span>Mengalihkan ke dashboard...</span>
						</div>
					</div>
				</div>
			</div>
		);
	}

	if (needChoose) {
		return (
			<div className="min-h-screen bg-linear-to-br from-orange-50 to-green-50 flex items-center justify-center p-4">
				<div className="bg-white rounded-2xl shadow-2xl p-8 max-w-2xl w-full">
					<h2 className="text-2xl font-bold text-[oklch(0.25_0.08_142)] mb-4 text-center">
						Pilih Gaya Belajar Anda
					</h2>
					<p className="text-gray-600 mb-6 text-center">
						Hasil kuis menunjukkan Anda memiliki kecocokan yang sama pada beberapa gaya belajar. Silakan pilih salah satu:
					</p>
					<div className="space-y-4">
						{options.map(option => (
							<button
								key={option}
								onClick={() => setSelectedOption(option)}
								className={`w-full p-6 rounded-xl border-2 transition-all ${selectedOption === option
									? 'border-[oklch(0.6_0.18_45.5)] bg-orange-50'
									: 'border-gray-200 hover:border-[oklch(0.38_0.05_142)]'
									}`}
							>
								<h3 className="text-xl font-semibold text-[oklch(0.25_0.08_142)] mb-2">
									{getGayaBelajarLabel(option)}
								</h3>
								<p className="text-gray-600 text-sm">
									{getGayaBelajarDescription(option)}
								</p>
							</button>
						))}
					</div>
					<button
						onClick={handleFinalChoice}
						disabled={!selectedOption || finalChoiceMutation.isPending}
						className="w-full mt-6 bg-[oklch(0.6_0.18_45.5)] text-white py-3 rounded-xl font-semibold hover:bg-[oklch(0.55_0.18_45.5)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
					>
						{finalChoiceMutation.isPending ? (
							<>
								<Loader2 className="w-5 h-5 animate-spin" />
								Menyimpan...
							</>
						) : (
							'Konfirmasi Pilihan'
						)}
					</button>
				</div>
			</div>
		);
	}

	const currentQuestion = pertanyaan[currentIndex];
	const progress = ((currentIndex + 1) / pertanyaan.length) * 100;
	const allAnswered = Object.keys(answers).length === pertanyaan.length;

	return (
		<div className="min-h-screen bg-linear-to-br from-orange-50 to-green-50 flex items-center justify-center p-4">
			<div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full overflow-hidden">
				<div className="bg-[oklch(0.25_0.08_142)] text-white p-6">
					<h1 className="text-2xl font-bold mb-2">Kuis Gaya Belajar VAK</h1>
					<div className="flex items-center gap-3">
						<div className="flex-1 bg-[oklch(0.38_0.05_142)] rounded-full h-2">
							<div
								className="bg-[oklch(0.6_0.18_45.5)] h-2 rounded-full transition-all duration-300"
								style={{ width: `${progress}%` }}
							/>
						</div>
						<span className="text-sm font-semibold">
							{currentIndex + 1} / {pertanyaan.length}
						</span>
					</div>
				</div>

				<div className="p-8">
					{currentQuestion && (
						<div>
							<h2 className="text-xl font-semibold text-[oklch(0.25_0.08_142)] mb-6">
								{currentQuestion.pertanyaan}
							</h2>

							<div className="space-y-3">
								{currentQuestion.jawabanKuisVAKs.map((jawaban: { id: Key | null | undefined; jawaban: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined; }) => {
									const isSelected = answers[String(currentQuestion.id)] === String(jawaban.id);
									return (
										<button
											key={jawaban.id}
											onClick={() => handleSelectAnswer(currentQuestion.id, jawaban.id)}
											className={`w-full text-left p-4 rounded-xl border-2 transition-all ${isSelected
												? 'border-[oklch(0.6_0.18_45.5)] bg-orange-50'
												: 'border-gray-200 hover:border-[oklch(0.38_0.05_142)] hover:bg-gray-50'
												}`}
										>
											<div className="flex items-center gap-3">
												<div
													className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${isSelected
														? 'border-[oklch(0.6_0.18_45.5)] bg-[oklch(0.6_0.18_45.5)]'
														: 'border-gray-300'
														}`}
												>
													{isSelected && (
														<div className="w-2.5 h-2.5 bg-white rounded-full" />
													)}
												</div>
												<span className="text-gray-800">{jawaban.jawaban}</span>
											</div>
										</button>
									);
								})}
							</div>
						</div>
					)}
				</div>

				<div className="border-t border-gray-200 p-6 flex items-center justify-between">
					<button
						onClick={goToPrev}
						disabled={currentIndex === 0}
						className="flex items-center gap-2 px-6 py-3 rounded-xl bg-[oklch(0.38_0.05_142)] text-white font-semibold hover:bg-[oklch(0.35_0.08_142)] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
					>
						<ChevronLeft className="w-5 h-5" />
						Sebelumnya
					</button>

					{currentIndex === pertanyaan.length - 1 ? (
						<button
							onClick={handleSubmit}
							disabled={!allAnswered || submitMutation.isPending}
							className="flex items-center gap-2 px-6 py-3 rounded-xl bg-[oklch(0.6_0.18_45.5)] text-white font-semibold hover:bg-[oklch(0.55_0.18_45.5)] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
						>
							{submitMutation.isPending ? (
								<>
									<Loader2 className="w-5 h-5 animate-spin" />
									Mengirim...
								</>
							) : (
								<>
									<Check className="w-5 h-5" />
									Selesai
								</>
							)}
						</button>
					) : (
						<button
							onClick={goToNext}
							disabled={currentIndex === pertanyaan.length - 1}
							className="flex items-center gap-2 px-6 py-3 rounded-xl bg-[oklch(0.6_0.18_45.5)] text-white font-semibold hover:bg-[oklch(0.55_0.18_45.5)] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
						>
							Selanjutnya
							<ChevronRight className="w-5 h-5" />
						</button>
					)}
				</div>
			</div>
		</div>
	);
};