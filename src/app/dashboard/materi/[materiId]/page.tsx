/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useEffect, useCallback, useState, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Clock, BookOpen, Calendar, TrendingUp, ArrowLeft, Wifi, WifiOff } from 'lucide-react';
import { useStudyCapture } from '@/hooks/capture/use-study-capture';

interface MateriData {
	id: string;
	nama: string;
	kategori: string;
	deskripsi: string;
	userProgress: {
		totalStudyTime: number;
		activeDays: number;
		lastStudied: string | null;
	};
}

export default function MateriDetailPage() {
	const params = useParams();
	const router = useRouter();
	const materiId = params.materiId as string;

	const [materi, setMateri] = useState<MateriData | null>(null);
	const [isLoading, setIsLoading] = useState(true);

	// Ref untuk scroll tracking
	const scrollContainerRef = useRef<HTMLDivElement>(null);

	// Gunakan study capture hook
	const { startStudy, endStudy, sessionState, syncStatus } = useStudyCapture({
		materiId,
		scrollContainerRef,
		idleTimeoutMs: 60_000, // 1 minute idle timeout
		heartbeatIntervalMs: 30_000, // 30 seconds heartbeat
	});

	const fetchMateri = useCallback(async () => {
		try {
			const response = await fetch(`/api/materi/${materiId}`);
			if (!response.ok) throw new Error('Failed to fetch materi');
			const data = await response.json();
			setMateri(data);
		} catch (error) {
			console.error('Error fetching materi:', error);
		} finally {
			setIsLoading(false);
		}
	}, [materiId]);

	// Fetch materi data
	useEffect(() => {
		fetchMateri();
	}, [fetchMateri]);

	// Start study session when component mounts
	useEffect(() => {
		startStudy();
		return () => {
			endStudy();
		};
	}, [startStudy, endStudy]);

	const handleMarkComplete = async () => {
		// End study session before navigating away
		await endStudy();
		router.push('/dashboard/materi');
	};

	const handleNavigateToLatihan = async () => {
		// End study session before navigating
		await endStudy();
		router.push(`/dashboard/latihan-soal/${materiId}`);
	};

	const formatTime = (seconds: number) => {
		const hours = Math.floor(seconds / 3600);
		const minutes = Math.floor((seconds % 3600) / 60);
		const secs = seconds % 60;

		if (hours > 0) {
			return `${hours}j ${minutes}m`;
		}
		if (minutes > 0) {
			return `${minutes}m ${secs}s`;
		}
		return `${secs}s`;
	};

	if (isLoading) {
		return (
			<div className="flex items-center justify-center min-h-screen">
				<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
			</div>
		);
	}

	if (!materi) {
		return (
			<div className="flex flex-col items-center justify-center min-h-screen">
				<p className="text-gray-600 mb-4">Material not found</p>
				<button
					onClick={() => router.push('/dashboard/materi')}
					className="text-blue-600 hover:underline"
				>
					Back to study materials
				</button>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-gray-50">
			{/* Header */}
			<div className="bg-white border-b sticky top-0 z-10">
				<div className="max-w-4xl mx-auto px-4 py-4">
					<div className="flex items-center justify-between">
						<button
							onClick={async () => {
								await endStudy();
								router.push('/dashboard/materi');
							}}
							className="flex items-center text-gray-600 hover:text-gray-900"
						>
							<ArrowLeft className="w-5 h-5 mr-2" />
							Back
						</button>

						<div className="flex items-center gap-4">
							{/* Current Session Timer */}
							<div className="flex items-center text-sm text-gray-600">
								<Clock className="w-4 h-4 mr-1" />
								{formatTime(sessionState.totalActiveTime)}
							</div>

							{/* Session Status Indicators */}
							<div className="flex items-center gap-2">
								{/* Idle Indicator */}
								{sessionState.isIdle && (
									<span className="flex items-center text-xs text-amber-600 bg-amber-50 px-2 py-1 rounded">
										<span className="w-1.5 h-1.5 bg-amber-600 rounded-full mr-1 animate-pulse" />
										Idle
									</span>
								)}

								{/* Visibility Indicator */}
								{!sessionState.isVisible && (
									<span className="flex items-center text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
										<span className="w-1.5 h-1.5 bg-gray-500 rounded-full mr-1" />
										Background
									</span>
								)}

								{/* Sync Status */}
								{syncStatus.isPending && (
									<span className="text-xs text-blue-600 flex items-center">
										<Wifi className="w-3 h-3 mr-1 animate-pulse" />
										Syncing...
									</span>
								)}
								{syncStatus.failedAttempts > 0 && (
									<span className="text-xs text-red-600 flex items-center">
										<WifiOff className="w-3 h-3 mr-1" />
										Offline
									</span>
								)}
								{!syncStatus.isPending && syncStatus.failedAttempts === 0 && sessionState.isActive && (
									<span className="text-xs text-green-600 flex items-center">
										<span className="w-1.5 h-1.5 bg-green-600 rounded-full mr-1" />
										Active
									</span>
								)}
							</div>
						</div>
					</div>
				</div>
			</div>

			<div className="max-w-4xl mx-auto px-4 py-8">
				{/* Progress Stats */}
				<div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
					<div className="bg-white rounded-lg shadow-sm p-6">
						<div className="flex items-center mb-2">
							<Clock className="w-5 h-5 text-blue-600 mr-2" />
							<span className="text-sm text-gray-600">Total Study Time</span>
						</div>
						<p className="text-2xl font-bold text-gray-900">
							{formatTime(materi.userProgress.totalStudyTime)}
						</p>
						<p className="text-xs text-gray-500 mt-1">
							Current session: {formatTime(sessionState.totalActiveTime)}
						</p>
					</div>

					<div className="bg-white rounded-lg shadow-sm p-6">
						<div className="flex items-center mb-2">
							<Calendar className="w-5 h-5 text-green-600 mr-2" />
							<span className="text-sm text-gray-600">Active Days</span>
						</div>
						<p className="text-2xl font-bold text-gray-900">
							{materi.userProgress.activeDays} days
						</p>
					</div>

					<div className="bg-white rounded-lg shadow-sm p-6">
						<div className="flex items-center mb-2">
							<TrendingUp className="w-5 h-5 text-purple-600 mr-2" />
							<span className="text-sm text-gray-600">Reading Progress</span>
						</div>
						<p className="text-2xl font-bold text-gray-900">
							{sessionState.scrollDepthMax}%
						</p>
						<div className="w-full bg-gray-200 rounded-full h-2 mt-2">
							<div
								className="bg-purple-600 h-2 rounded-full transition-all duration-300"
								style={{ width: `${sessionState.scrollDepthMax}%` }}
							/>
						</div>
					</div>
				</div>

				{/* Materi Content */}
				<div
					ref={scrollContainerRef}
					className="bg-white rounded-lg shadow-sm p-8 max-h-[600px] overflow-y-auto"
				>
					{/* Header */}
					<div className="mb-6">
						<div className="flex items-center gap-2 mb-2">
							<span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
								{materi.kategori}
							</span>
						</div>
						<h1 className="text-3xl font-bold text-gray-900 mb-2">
							{materi.nama}
						</h1>
					</div>

					{/* Description */}
					{materi.deskripsi && (
						<div className="prose max-w-none mb-8">
							<p className="text-gray-700 leading-relaxed">
								{materi.deskripsi}
							</p>
						</div>
					)}

					{/* Materi Content */}
					<div className="border-t pt-8">
						<h2 className="text-xl font-semibold mb-4 flex items-center">
							<BookOpen className="w-5 h-5 mr-2" />
							Learning Content
						</h2>

						<div className="space-y-4">
							<div className="bg-gray-50 rounded-lg p-6">
								<p className="text-gray-600">
									Content materials will be displayed here...
								</p>
								{/* Example content sections */}
								<div className="mt-6 space-y-6">
									<div>
										<h3 className="font-semibold text-lg mb-2">Introduction</h3>
										<p className="text-gray-700">
											Lorem ipsum dolor sit amet, consectetur adipiscing elit.
											Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
											Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.
										</p>
									</div>

									<div>
										<h3 className="font-semibold text-lg mb-2">Key Concepts</h3>
										<ul className="list-disc list-inside space-y-2 text-gray-700">
											<li>First concept about this material</li>
											<li>Second concept needed to understand</li>
											<li>Third concept as a complement</li>
										</ul>
									</div>

									<div>
										<h3 className="font-semibold text-lg mb-2">Example Problems</h3>
										<p className="text-gray-700">
											Example application of concepts in practice questions...
										</p>
									</div>

									<div>
										<h3 className="font-semibold text-lg mb-2">Advanced Discussion</h3>
										<p className="text-gray-700">
											More detailed discussion about the material...
											Lorem ipsum dolor sit amet, consectetur adipiscing elit.
										</p>
									</div>

									<div>
										<h3 className="font-semibold text-lg mb-2">Tips and Tricks</h3>
										<ul className="list-disc list-inside space-y-2 text-gray-700">
											<li>First tip to master the material</li>
											<li>Second tip to solve questions faster</li>
											<li>Third tip to remember important concepts</li>
										</ul>
									</div>
								</div>
							</div>
						</div>
					</div>

					{/* Action Buttons */}
					<div className="mt-8 flex justify-end gap-4 sticky bottom-0 bg-white pt-4 border-t">
						<button
							onClick={handleNavigateToLatihan}
							className="px-6 py-3 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
						>
							Practice Questions
						</button>
						<button
							onClick={handleMarkComplete}
							className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
						>
							<Clock className="w-4 h-4" />
							Finish & Save Progress
						</button>
					</div>
				</div>

				{/* Session Info (Debug - Optional) */}
				{process.env.NODE_ENV === 'development' && (
					<div className="mt-4 bg-gray-100 rounded-lg p-4 text-xs font-mono">
						<div className="grid grid-cols-2 gap-2">
							<div>Session ID: {sessionState.sessionId?.slice(0, 12)}...</div>
							<div>Active Time: {sessionState.totalActiveTime}s</div>
							<div>Idle Time: {sessionState.totalIdleTime}s</div>
							<div>Scroll Depth: {sessionState.scrollDepthCurrent}%</div>
							<div>Max Scroll: {sessionState.scrollDepthMax}%</div>
							<div>Is Active: {sessionState.isActive ? '✓' : '✗'}</div>
							<div>Is Visible: {sessionState.isVisible ? '✓' : '✗'}</div>
							<div>Is Idle: {sessionState.isIdle ? '✓' : '✗'}</div>
						</div>
					</div>
				)}
			</div>
		</div>
	);
}