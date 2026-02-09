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
		router.push('/dashboard/study-materials');
	};

	const handleNavigateToLatihan = async () => {
		// End study session before navigating
		await endStudy();
		router.push(`/dashboard/practice-questions/${materiId}`);
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
					onClick={() => router.push('/dashboard/study-materials')}
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
                <div className="max-w-7xl mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <button
                            onClick={async () => {
                                await endStudy();
                                router.push('/dashboard/study-materials');
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
                                {sessionState.isIdle && (
                                    <span className="flex items-center text-xs text-amber-600 bg-amber-50 px-2 py-1 rounded">
                                        <span className="w-1.5 h-1.5 bg-amber-600 rounded-full mr-1 animate-pulse" />
                                        Idle
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

            {/* Main Content Grid */}
            <div className="max-w-7xl mx-auto px-4 py-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Column - Main Content (2/3 width) */}
                    <div className="lg:col-span-2">
                        <div
                            ref={scrollContainerRef}
                            className="bg-white rounded-xl shadow-sm p-8 max-h-[calc(100vh-140px)] overflow-y-auto"
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

                                <div className="space-y-6">
                                    <div>
                                        <h3 className="font-semibold text-lg mb-3">Introduction</h3>
                                        <p className="text-gray-700 leading-relaxed">
                                            Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                                            Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                                            Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.
                                        </p>
                                    </div>

                                    <div>
                                        <h3 className="font-semibold text-lg mb-3">Key Concepts</h3>
                                        <ul className="list-disc list-inside space-y-2 text-gray-700">
                                            <li>First concept about this material</li>
                                            <li>Second concept needed to understand</li>
                                            <li>Third concept as a complement</li>
                                        </ul>
                                    </div>

                                    <div>
                                        <h3 className="font-semibold text-lg mb-3">Example Problems</h3>
                                        <p className="text-gray-700 leading-relaxed">
                                            Example application of concepts in practice questions...
                                        </p>
                                    </div>

                                    <div>
                                        <h3 className="font-semibold text-lg mb-3">Advanced Discussion</h3>
                                        <p className="text-gray-700 leading-relaxed">
                                            More detailed discussion about the material...
                                            Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                                        </p>
                                    </div>

                                    <div>
                                        <h3 className="font-semibold text-lg mb-3">Tips and Tricks</h3>
                                        <ul className="list-disc list-inside space-y-2 text-gray-700">
                                            <li>First tip to master the material</li>
                                            <li>Second tip to solve questions faster</li>
                                            <li>Third tip to remember important concepts</li>
                                        </ul>
                                    </div>

                                    <div>
                                        <h3 className="font-semibold text-lg mb-3">Summary</h3>
                                        <p className="text-gray-700 leading-relaxed">
                                            Summary of key points from this material...
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Progress Sidebar (1/3 width) */}
                    <div className="lg:col-span-1">
                        <div className="sticky space-y-4">
                            {/* Progress Stats */}
                            <div className="bg-white rounded-xl shadow-sm p-6">
                                <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                                    <TrendingUp className="w-5 h-5 mr-2 text-blue-600" />
                                    Your Progress
                                </h3>
                                
                                <div className="space-y-4">
                                    {/* Study Time */}
                                    <div>
                                        <div className="flex items-center justify-between mb-2">
                                            <div className="flex items-center">
                                                <Clock className="w-4 h-4 text-blue-600 mr-2" />
                                                <span className="text-sm text-gray-600">Study Time</span>
                                            </div>
                                        </div>
                                        <p className="text-2xl font-bold text-gray-900">
                                            {formatTime(sessionState.totalActiveTime)}
                                        </p>
                                        <p className="text-xs text-gray-500 mt-1">
                                            Session Total: {formatTime(sessionState.totalActiveTime + sessionState.totalIdleTime)}
                                        </p>
                                    </div>

                                    <div className="border-t pt-4">
                                        <div className="flex items-center justify-between mb-2">
                                            <div className="flex items-center">
                                                <Calendar className="w-4 h-4 text-green-600 mr-2" />
                                                <span className="text-sm text-gray-600">Active Days</span>
                                            </div>
                                        </div>
                                        <p className="text-2xl font-bold text-gray-900">
                                            {materi.userProgress.activeDays}
                                        </p>
                                        <p className="text-xs text-gray-500 mt-1">days</p>
                                    </div>

                                    <div className="border-t pt-4">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-sm text-gray-600">Reading Progress</span>
                                            <span className="text-sm font-semibold text-purple-600">
                                                {sessionState.scrollDepthMax}%
                                            </span>
                                        </div>
                                        <div className="w-full bg-gray-200 rounded-full h-3">
                                            <div
                                                className="bg-gradient-to-r from-purple-500 to-purple-600 h-3 rounded-full transition-all duration-300"
                                                style={{ width: `${sessionState.scrollDepthMax}%` }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="bg-white rounded-xl shadow-sm p-4 space-y-3">
                                <button
                                    onClick={handleNavigateToLatihan}
                                    className="w-full px-4 py-3 bg-white border-2 border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors font-medium"
                                >
                                    Practice Questions
                                </button>
                                <button
                                    onClick={handleMarkComplete}
                                    className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 font-medium"
                                >
                                    <Clock className="w-4 h-4" />
                                    Finish & Save
                                </button>
                            </div>

                            {/* Session Info (Debug) */}
                            {process.env.NODE_ENV === 'development' && (
                                <div className="bg-gray-100 rounded-xl p-4 text-xs font-mono">
                                    <div className="space-y-1">
                                        <div className="font-semibold mb-2">Debug Info</div>
                                        <div>Session: {sessionState.sessionId?.slice(0, 12)}...</div>
                                        <div>Active: {sessionState.totalActiveTime}s</div>
                                        <div>Idle: {sessionState.totalIdleTime}s</div>
                                        <div>Scroll: {sessionState.scrollDepthCurrent}% / {sessionState.scrollDepthMax}%</div>
                                        <div>Status: {sessionState.isActive ? '✓' : '✗'} Active | {sessionState.isVisible ? '✓' : '✗'} Visible</div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}