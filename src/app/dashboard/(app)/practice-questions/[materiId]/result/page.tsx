/* eslint-disable @typescript-eslint/no-explicit-any */
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
	BookOpen,
	Award
} from 'lucide-react';
import Link from 'next/link';
import type { BurnoutApiResponse, BurnoutCalculationResult, BurnoutLevel, BurnoutLevelConfig } from '@/types/burnout';

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
	const [velocity, setVelocity] = useState<number | null>(null);
	const [velocityComponents, setVelocityComponents] = useState<any>(null);
	const [velocityLoading, setVelocityLoading] = useState(false);
	const [mbaBoost, setMbaBoost] = useState<number>(0);
	const [burnoutData, setBurnoutData] = useState<BurnoutCalculationResult | null>(null);
	const [burnoutLoading, setBurnoutLoading] = useState(false);
	const [burnoutError, setBurnoutError] = useState<string | null>(null);;

	useEffect(() => {
		// Extract mbaBoost from URL
		const mbaBoostParam = searchParams.get('mbaBoost');
		if (mbaBoostParam) {
			setMbaBoost(parseInt(mbaBoostParam, 10));
		}
	}, [searchParams]);

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

	// Fetch Learning Velocity
	useEffect(() => {
		const fetchVelocity = async () => {
			if (!result || !sessionId) return;

			setVelocityLoading(true);
			try {
				const response = await fetch('/api/metrics/velocity', {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({
						sessionId,
						userId: result.userId
					})
				});

				if (response.ok) {
					const data = await response.json();
					setVelocity(data.velocity);
					setVelocityComponents(data.components);
				}
			} catch (err) {
				console.error('Failed to fetch velocity:', err);
			} finally {
				setVelocityLoading(false);
			}
		};

		fetchVelocity();
	}, [result, sessionId]);

	useEffect(() => {
		const fetchBurnout = async () => {
			if (!result || !sessionId) return;

			setBurnoutLoading(true);
			setBurnoutError(null);
			setBurnoutData(null);

			try {
				const response = await fetch(`/api/metrics/burnout/${sessionId}`);
				const data: BurnoutApiResponse = await response.json();

				// Check for errors
				if (data.error) {
					console.info('[Result] Burnout unavailable:', data.reason || data.error);
					setBurnoutError(data.reason || data.error);
					return;
				}

				// Check if can calculate
				if (data.canCalculate === false) {
					console.info('[Result] Cannot calculate burnout:', data.reason);
					setBurnoutError(data.reason || 'Insufficient data');
					return;
				}

				// Validate required fields exist
				if (!data.burnoutLevel || !data.fatigueIndex || !data.components || !data.recommendations) {
					console.error('[Result] Incomplete burnout data:', data);
					setBurnoutError('Incomplete burnout data received');
					return;
				}

				// Success - cast to full type
				const burnoutResult: BurnoutCalculationResult = {
					burnoutLevel: data.burnoutLevel,
					fatigueIndex: data.fatigueIndex,
					components: data.components,
					recommendations: data.recommendations,
					sessionStats: data.sessionStats!
				};

				console.log('[Result] Burnout data loaded:', burnoutResult);
				setBurnoutData(burnoutResult);

			} catch (err) {
				console.error('[Result] Failed to fetch burnout:', err);
				setBurnoutError(err instanceof Error ? err.message : 'Network error');
			} finally {
				setBurnoutLoading(false);
			}
		};

		fetchBurnout();
	}, [result, sessionId]);

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
		if (score >= 80) return 'Outstanding!';
		if (score >= 60) return 'Good Job!';
		return 'Keep Practicing!';
	};

	const getScoreBgColor = (score: number) => {
		if (score >= 80) return 'from-green-400 to-green-600';
		if (score >= 60) return 'from-yellow-400 to-yellow-600';
		return 'from-red-400 to-red-600';
	};

	// Behavioral Analysis (DTA vs MBA)
	const analyzeBehavior = (answers: SessionResultData['answers'], mbaBoostCount: number) => {
		const avgTimePerQ = answers.reduce((sum, a) => sum + (a.timeSpent || 0), 0) / answers.length;
		const quickAnswers = answers.filter(a => (a.timeSpent || 0) < 30).length;
		const totalAnswers = answers.length;

		// DTA indicators: Quick, surface-level pattern matching
		let dtaScore = (quickAnswers / totalAnswers) * 100;

		// MBA boost from Socratic discussion reduces DTA, increases MBA
		const mbaBoostPercent = (mbaBoostCount / totalAnswers) * 40; // 40% max boost
		dtaScore = Math.max(0, dtaScore - mbaBoostPercent);
		const mbaScore = 100 - dtaScore;

		return {
			dtaScore: Math.round(dtaScore),
			mbaScore: Math.round(mbaScore),
			dominantStyle: dtaScore > 60 ? 'DTA' : mbaScore > 60 ? 'MBA' : 'BALANCED' as const,
			mbaBoostApplied: mbaBoostCount > 0
		};
	};

	const behavior = result ? analyzeBehavior(result.answers, mbaBoost) : null;

	if (loading) {
		return (
			<div className="flex flex-col items-center justify-center min-h-screen gap-4">
				<Loader2 className="w-12 h-12 animate-spin text-blue-600" />
				<p className="text-gray-600">Loading results...</p>
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
							Failed to Load Results
						</h2>
						<p className="text-gray-600 mb-6">
							{error || 'An error occurred while loading practice results'}
						</p>
						<Link
							href={`/dashboard/latihan-soal/${materiId}`}
							className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
						>
							Back to Materials
						</Link>
					</div>
				</div>
			</div>
		);
	}

	const BurnoutCard = () => {
		if (burnoutLoading) {
			return (
				<div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8 mb-6">
					<div className="flex items-center justify-center py-8">
						<Loader2 className="w-8 h-8 animate-spin text-blue-600" />
						<span className="ml-3 text-gray-600">Analyzing fatigue levels...</span>
					</div>
				</div>
			);
		}

		// Don't show card if error or no data
		if (burnoutError || !burnoutData) {
			return null;
		}

		const { burnoutLevel, fatigueIndex, components, recommendations } = burnoutData;

		// Type guard
		const isValidBurnoutLevel = (level: string): level is BurnoutLevel => {
			return ['NONE', 'MILD', 'MODERATE', 'SEVERE'].includes(level);
		};

		if (!isValidBurnoutLevel(burnoutLevel)) {
			console.error('[BurnoutCard] Invalid burnout level:', burnoutLevel);
			return null;
		}

		const levelConfig: Record<BurnoutLevel, BurnoutLevelConfig> = {
			NONE: {
				color: 'from-green-500 to-emerald-600',
				textColor: 'text-green-600',
				bgColor: 'bg-green-50',
				icon: '🎯',
				title: 'Prime Condition!'
			},
			MILD: {
				color: 'from-yellow-500 to-amber-600',
				textColor: 'text-yellow-600',
				bgColor: 'bg-yellow-50',
				icon: '💡',
				title: 'Slightly Tired'
			},
			MODERATE: {
				color: 'from-orange-500 to-red-500',
				textColor: 'text-orange-600',
				bgColor: 'bg-orange-50',
				icon: '⚠️',
				title: 'Moderately Tired'
			},
			SEVERE: {
				color: 'from-red-500 to-rose-700',
				textColor: 'text-red-600',
				bgColor: 'bg-red-50',
				icon: '🛑',
				title: 'Burnout Detected!'
			}
		};

		const config = levelConfig[burnoutLevel];

		const getBorderColor = () => {
			switch (burnoutLevel) {
				case 'NONE': return 'border-green-200';
				case 'MILD': return 'border-yellow-200';
				case 'MODERATE': return 'border-orange-200';
				case 'SEVERE': return 'border-red-200';
			}
		};

		return (
			<div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 mb-6">
				{/* Header */}
				<div className="flex items-start justify-between mb-6">
					<div>
						<h3 className="text-2xl font-bold text-gray-900 mb-2 flex items-center gap-2">
							Fatigue Analysis
						</h3>
						<p className="text-gray-600 text-sm">
							Burnout detection based on your learning patterns and performance
						</p>
					</div>
					<div className={`px-4 py-2 rounded-full ${config.bgColor} ${config.textColor} font-bold text-sm`}>
						{config.title}
					</div>
				</div>

				{/* Fatigue Index Gauge */}
				<div className="mb-8">
					<div className="text-center mb-4">
						<div className={`text-6xl font-bold ${config.textColor} mb-2`}>
							{Math.round(fatigueIndex)}
						</div>
						<div className="text-gray-600 text-sm">Fatigue Index (0-100)</div>
					</div>

					{/* Gauge Bar */}
					<div className="relative h-4 bg-gray-200 rounded-full overflow-hidden">
						<div
							className={`h-4 bg-gradient-to-r ${config.color} rounded-full transition-all duration-1000`}
							style={{ width: `${Math.min(fatigueIndex, 100)}%` }}
						/>
					</div>

					{/* Scale Labels */}
					<div className="flex justify-between text-xs text-gray-500 mt-2">
						<span>0 (Fresh)</span>
						<span>50 (Moderate)</span>
						<span>100 (Severe)</span>
					</div>
				</div>

				{/* Components Breakdown */}
				<div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
					<div className="bg-gray-50 rounded-lg p-4">
						<div className="text-xs text-gray-600 mb-1">Cognitive Load</div>
						<div className="text-2xl font-bold text-gray-900">
							{Math.round(components.cognitiveLoad.value)}%
						</div>
						<div className="text-xs text-gray-500 mt-1">
							{components.cognitiveLoad.interpretation}
						</div>
					</div>

					<div className="bg-gray-50 rounded-lg p-4">
						<div className="text-xs text-gray-600 mb-1">Decision Quality</div>
						<div className="text-2xl font-bold text-gray-900">
							{Math.round(components.decisionQuality.value)}%
						</div>
						<div className="text-xs text-gray-500 mt-1">
							{components.decisionQuality.interpretation}
						</div>
					</div>

					<div className="bg-gray-50 rounded-lg p-4">
						<div className="text-xs text-gray-600 mb-1">Engagement</div>
						<div className="text-2xl font-bold text-gray-900">
							{Math.round(components.engagement.value)}%
						</div>
						<div className="text-xs text-gray-500 mt-1">
							{components.engagement.interpretation}
						</div>
					</div>

					<div className="bg-gray-50 rounded-lg p-4">
						<div className="text-xs text-gray-600 mb-1">Consistency</div>
						<div className="text-2xl font-bold text-gray-900">
							{Math.round(components.consistency.value)}%
						</div>
						<div className="text-xs text-gray-500 mt-1">
							{components.consistency.interpretation}
						</div>
					</div>
				</div>

				{/* Recommendations */}
				<div className={`${config.bgColor} border-2 ${getBorderColor()} rounded-lg p-6`}>
					<h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
						Recommendation
					</h4>
					<p className="text-gray-800 mb-4">
						{recommendations.message}
					</p>

					{recommendations.shouldRest && (
						<div className="bg-white bg-opacity-70 rounded-lg p-4 mb-4">
							<div className="flex items-center justify-between">
								<div>
									<p className="font-semibold text-gray-900">Suggested Rest:</p>
									<p className={`text-2xl font-bold ${config.textColor}`}>
										{recommendations.restDuration} minutes
									</p>
								</div>
								<div className="text-4xl">⏱️</div>
							</div>
						</div>
					)}

					<div className="mt-4 pt-4 border-t border-gray-300">
						<p className="text-sm text-gray-700">
							<strong>Next Step:</strong>{' '}
							{recommendations.nextAction === 'CONTINUE' && 'Continue to next material or try a simulation!'}
							{recommendations.nextAction === 'REST' && 'Rest for a moment then continue practicing.'}
							{recommendations.nextAction === 'SWITCH_TOPIC' && 'Switch to a lighter topic or material.'}
							{recommendations.nextAction === 'STOP_SESSION' && 'Stop practice and continue tomorrow after enough rest.'}
						</p>
					</div>
				</div>
			</div>
		);
	};

	return (
		<div className="bg-gradient-to-b from-blue-50 to-white py-12 rounded-xl px-20">
			<div className="container mx-auto max-w-4xl">
				{/* Header with Trophy */}
				<div className="text-center mb-8">
					<div className={`inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br ${getScoreBgColor(result.score)} rounded-full mb-4 shadow-lg`}>
						<Trophy className="w-12 h-12 text-white" />
					</div>
					<h1 className="text-3xl font-bold text-gray-900 mb-2">
						Practice Complete!
					</h1>
					<p className="text-gray-600">
						{result.type === 'LATIHAN' ? 'Practice Mode' : 'Try Out Mode'}
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
								{result.correctAnswers} of {result.answeredQuestions} answered correctly
							</span>
						</div>
						{result.skippedQuestions > 0 && (
							<div className="mt-2">
								<span className="text-sm text-gray-500">
									({result.skippedQuestions} questions skipped)
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
							<div className="text-xs text-gray-600">Accuracy</div>
						</div>

						<div className="bg-green-50 rounded-lg p-4 text-center">
							<CheckCircle2 className="w-6 h-6 text-green-600 mx-auto mb-2" />
							<div className="text-2xl font-bold text-gray-900">
								{result.correctAnswers}
							</div>
							<div className="text-xs text-gray-600">Correct</div>
						</div>

						<div className="bg-red-50 rounded-lg p-4 text-center">
							<XCircle className="w-6 h-6 text-red-600 mx-auto mb-2" />
							<div className="text-2xl font-bold text-gray-900">
								{result.wrongAnswers}
							</div>
							<div className="text-xs text-gray-600">Wrong</div>
						</div>

						<div className="bg-purple-50 rounded-lg p-4 text-center">
							<Clock className="w-6 h-6 text-purple-600 mx-auto mb-2" />
							<div className="text-2xl font-bold text-gray-900">
								{formatTime(result.totalDuration)}
							</div>
							<div className="text-xs text-gray-600">Total Time</div>
						</div>
					</div>

					{/* Performance Bars */}
					<div className="space-y-3 mb-6">
						<div>
							<div className="flex justify-between text-sm mb-1">
								<span className="text-gray-600">Completion Rate</span>
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
								<span className="text-gray-600">Avg Time per Question</span>
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
								Performance by Difficulty
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

				<BurnoutCard />

				{/* Learning Velocity Card (PREMIUM) */}
				<div className="bg-gradient-to-r from-purple-600 to-indigo-700 rounded-2xl shadow-2xl p-8 mb-6 text-white">
					<div className="flex items-start justify-between mb-6">
						<div>
							<h3 className="text-2xl font-bold mb-2">Learning Velocity</h3>
							<p className="text-purple-100 text-sm">Your adaptive learning speed</p>
						</div>
						<TrendingUp className="w-12 h-12 text-purple-200" />
					</div>

					{velocityLoading ? (
						<div className="flex items-center justify-center py-8">
							<Loader2 className="w-8 h-8 animate-spin text-white" />
						</div>
					) : velocity !== null ? (
						<>
							<div className="text-center mb-8">
								<div className="text-7xl font-bold mb-2">{velocity.toFixed(1)}%</div>
								<div className="text-purple-200">Overall Velocity Score</div>
							</div>

							{velocityComponents && (
								<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
									<div className="bg-white/20 backdrop-blur rounded-lg p-4 text-center">
										<div className="text-3xl font-bold">{(velocityComponents.accuracyScore * 100).toFixed(0)}%</div>
										<div className="text-xs text-purple-100 mt-1">Accuracy</div>
									</div>
									<div className="bg-white/20 backdrop-blur rounded-lg p-4 text-center">
										<div className="text-3xl font-bold">{(velocityComponents.difficultyScore * 100).toFixed(0)}%</div>
										<div className="text-xs text-purple-100 mt-1">Difficulty</div>
									</div>
									<div className="bg-white/20 backdrop-blur rounded-lg p-4 text-center">
										<div className="text-3xl font-bold">{(velocityComponents.timeEfficiency * 100).toFixed(0)}%</div>
										<div className="text-xs text-purple-100 mt-1">Speed</div>
									</div>
									<div className="bg-white/20 backdrop-blur rounded-lg p-4 text-center">
										<div className="text-3xl font-bold">{(velocityComponents.improvement * 100).toFixed(0)}%</div>
										<div className="text-xs text-purple-100 mt-1">Growth</div>
									</div>
								</div>
							)}
						</>
					) : (
						<div className="text-center py-8">
							<p className="text-purple-100">Velocity data unavailable</p>
						</div>
					)}
				</div>

				{/* Behavioral Map (DTA vs MBA) */}
				{behavior && (
					<div className="bg-white rounded-2xl shadow-xl p-8 mb-6 border border-gray-100">
						<div className="flex items-center gap-3 mb-6">
							<div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
								<span className="text-2xl">🧠</span>
							</div>
							<div>
								<h3 className="text-2xl font-bold text-gray-900">Learning Style Analysis</h3>
								<p className="text-sm text-gray-600">Understanding how you approach problems</p>
							</div>
						</div>

						{behavior.mbaBoostApplied && (
							<div className="mb-6 p-3 bg-green-50 border border-green-200 rounded-lg">
								<p className="text-sm text-green-800 flex items-center gap-2">
									<Award className="w-4 h-4" />
									<span className="font-semibold">MBA Boost Applied!</span> Your Socratic review discussions improved your conceptual thinking score.
								</p>
							</div>
						)}

						<div className="flex items-center justify-between mb-8">
							<div className="text-center flex-1">
								<div className="text-5xl mb-2">⚡</div>
								<div className="text-2xl font-bold text-gray-900">DTA</div>
								<div className="text-3xl font-bold text-blue-600 mb-1">{behavior.dtaScore}%</div>
								<p className="text-xs text-gray-600">Direct Translation</p>
								<p className="text-xs text-gray-500 mt-1">Procedural & Rule-based</p>
							</div>

							<div className="flex-1 px-8">
								<div className="relative h-6 bg-gray-200 rounded-full overflow-hidden">
									<div
										className="absolute left-0 h-6 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full transition-all duration-500"
										style={{ width: `${behavior.dtaScore}%` }}
									/>
									<div
										className="absolute right-0 h-6 bg-gradient-to-r from-purple-600 to-purple-500 rounded-full transition-all duration-500"
										style={{ width: `${behavior.mbaScore}%` }}
									/>
								</div>
								<div className="text-center mt-2">
									<span className={`text-sm font-bold ${behavior.dominantStyle === 'BALANCED' ? 'text-green-600' : 'text-gray-600'
										}`}>
										{behavior.dominantStyle === 'BALANCED' && '✓ '}
										{behavior.dominantStyle}
									</span>
								</div>
							</div>

							<div className="text-center flex-1">
								<div className="text-5xl mb-2">💡</div>
								<div className="text-2xl font-bold text-gray-900">MBA</div>
								<div className="text-3xl font-bold text-purple-600 mb-1">{behavior.mbaScore}%</div>
								<p className="text-xs text-gray-600">Meaning-Based</p>
								<p className="text-xs text-gray-500 mt-1">Conceptual & Reasoning</p>
							</div>
						</div>

						<div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
							<p className="text-sm text-blue-900">
								<span className="font-semibold">💡 Insight:</span>{' '}
								{behavior.dominantStyle === 'DTA'
									? 'You tend to use procedural approaches. Try spending more time understanding the WHY behind concepts, not just the HOW.'
									: behavior.dominantStyle === 'MBA'
										? 'You excel at conceptual thinking! Consider practicing pattern recognition to improve speed on time-critical tests.'
										: '✅ Perfect balance! You combine quick pattern recognition with deep understanding—an ideal approach for UTBK.'}
							</p>
						</div>
					</div>
				)}

				{/* Recommendations */}
				<div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl shadow-lg p-6 mb-6 text-white">
					<div className="flex items-start gap-4">
						<BarChart3 className="w-8 h-8 flex-shrink-0" />
						<div>
							<h3 className="font-semibold text-lg mb-2">
								Recommendations for You
							</h3>
							<p className="text-blue-50 text-sm">
								{result.score >= 80
									? 'Excellent! You have mastered this material well. Try more challenging materials or take a try-out to measure your skills.'
									: result.score >= 60
										? 'Good job! You understand most of the material. Review the incorrect answers and study the explanations to improve your understanding.'
										: 'Keep going! Focus on understanding the basic concepts before continuing. Repeat this practice or study the related material first.'}
							</p>
						</div>
					</div>
				</div>

				{/* Summary Stats */}
				<div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
					<h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
						<BookOpen className="w-5 h-5" />
						Session Summary
					</h3>
					<div className="grid grid-cols-2 gap-4 text-sm">
						<div>
							<span className="text-gray-600">Total Questions:</span>
							<span className="ml-2 font-semibold text-gray-900">
								{result.totalQuestions}
							</span>
						</div>
						<div>
							<span className="text-gray-600">Answered:</span>
							<span className="ml-2 font-semibold text-gray-900">
								{result.answeredQuestions}
							</span>
						</div>
						<div>
							<span className="text-gray-600">Skipped:</span>
							<span className="ml-2 font-semibold text-gray-900">
								{result.skippedQuestions}
							</span>
						</div>
						<div>
							<span className="text-gray-600">Start Time:</span>
							<span className="ml-2 font-semibold text-gray-900">
								{new Date(result.startedAt).toLocaleTimeString('en-US')}
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
						Practice Again
					</Link>

					<Link
						href="/dashboard/practice-questions"
						className="flex items-center justify-center gap-2 bg-white hover:bg-gray-50 text-gray-700 font-semibold py-4 px-6 rounded-lg border-2 border-gray-300 transition-colors"
					>
						<ArrowRight className="w-5 h-5" />
						Other Materials
					</Link>

					<Link
						href="/"
						className="flex items-center justify-center gap-2 bg-white hover:bg-gray-50 text-gray-700 font-semibold py-4 px-6 rounded-lg border-2 border-gray-300 transition-colors"
					>
						<Home className="w-5 h-5" />
						Go Home
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