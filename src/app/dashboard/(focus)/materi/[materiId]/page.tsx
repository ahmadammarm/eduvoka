/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useEffect, useCallback, useState, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Clock, BookOpen, Calendar, TrendingUp, ArrowLeft, Wifi, WifiOff } from 'lucide-react';
import { useStudyCapture } from '@/hooks/capture/use-study-capture';
import { toast } from 'sonner';

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
		toast.success("Your progress has been saved!")
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

																<div className="space-y-8">
																	<div>
																		<h3 className="font-semibold text-lg mb-3">Introduction</h3>
																		<p className="text-gray-700 leading-relaxed mb-4">
																			Lorem ipsum dolor sit amet, consectetur adipiscing elit.
																			Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
																			Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris
																			nisi ut aliquip ex ea commodo consequat.
																		</p>
																		<p className="text-gray-700 leading-relaxed">
																			Duis aute irure dolor in reprehenderit in voluptate velit esse
																			cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat
																			cupidatat non proident, sunt in culpa qui officia deserunt mollit
																			anim id est laborum. Sed ut perspiciatis unde omnis iste natus error
																			sit voluptatem accusantium doloremque laudantium.
																		</p>
																	</div>

																	<div>
																		<h3 className="font-semibold text-lg mb-3">Key Concepts</h3>
																		<ul className="list-disc list-inside space-y-2 text-gray-700">
																			<li>First concept about this material - understanding the fundamental principles</li>
																			<li>Second concept needed to understand - building upon basic knowledge</li>
																			<li>Third concept as a complement - advanced application techniques</li>
																			<li>Fourth concept - practical implementation strategies</li>
																			<li>Fifth concept - common pitfalls and how to avoid them</li>
																			<li>Sixth concept - best practices and industry standards</li>
																		</ul>
																		<p className="text-gray-700 leading-relaxed mt-4">
																			Each of these concepts plays a crucial role in mastering this material.
																			It&apos;s important to understand how they interconnect and support each other
																			in practical applications. Take time to review each concept thoroughly
																			before moving forward.
																		</p>
																	</div>

																	<div>
																		<h3 className="font-semibold text-lg mb-3">Theoretical Foundation</h3>
																		<p className="text-gray-700 leading-relaxed mb-4">
																			Before diving into practical examples, it&apos;s essential to understand
																			the theoretical foundation that underpins this subject. The theories
																			we&apos;ll discuss have been developed over years of research and practice,
																			providing a solid framework for understanding complex concepts.
																		</p>
																		<p className="text-gray-700 leading-relaxed mb-4">
																			Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam
																			accumsan eros vel nisi condimentum, at facilisis nunc tincidunt.
																			Vestibulum ante ipsum primis in faucibus orci luctus et ultrices
																			posuere cubilia curae; Praesent vel augue vel mauris dignissim
																			consequat.
																		</p>
																		<p className="text-gray-700 leading-relaxed">
																			Suspendisse potenti. Sed convallis augue id tellus venenatis,
																			ac facilisis magna pharetra. Integer consequat risus nec turpis
																			molestie, vitae consectetur elit efficitur. Maecenas tempor nibh
																			eu ante vehicula laoreet.
																		</p>
																	</div>

																	<div>
																		<h3 className="font-semibold text-lg mb-3">Step-by-Step Process</h3>
																		<div className="space-y-4">
																			<div className="bg-gray-50 p-4 rounded-lg">
																				<h4 className="font-semibold text-gray-900 mb-2">Step 1: Preparation</h4>
																				<p className="text-gray-700">
																					Begin by gathering all necessary materials and understanding
																					the prerequisites. This foundational step ensures you&apos;re ready
																					for what comes next.
																				</p>
																			</div>
																			<div className="bg-gray-50 p-4 rounded-lg">
																				<h4 className="font-semibold text-gray-900 mb-2">Step 2: Analysis</h4>
																				<p className="text-gray-700">
																					Carefully analyze the problem or situation at hand. Break it
																					down into manageable components and identify key elements that
																					need attention.
																				</p>
																			</div>
																			<div className="bg-gray-50 p-4 rounded-lg">
																				<h4 className="font-semibold text-gray-900 mb-2">Step 3: Implementation</h4>
																				<p className="text-gray-700">
																					Apply the concepts and techniques learned in previous sections.
																					Follow best practices and maintain consistency throughout the
																					implementation process.
																				</p>
																			</div>
																			<div className="bg-gray-50 p-4 rounded-lg">
																				<h4 className="font-semibold text-gray-900 mb-2">Step 4: Evaluation</h4>
																				<p className="text-gray-700">
																					Review your work carefully, checking for errors and areas of
																					improvement. This critical step helps ensure quality and accuracy.
																				</p>
																			</div>
																		</div>
																	</div>

																	<div>
																		<h3 className="font-semibold text-lg mb-3">Example Problems</h3>
																		<p className="text-gray-700 leading-relaxed mb-4">
																			Let&apos;s explore several example problems that demonstrate the practical
																			application of these concepts. Each example builds upon previous knowledge
																			and introduces new challenges to solve.
																		</p>
																		
																		<div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-4">
																			<p className="font-semibold text-blue-900 mb-2">Example 1: Basic Application</p>
																			<p className="text-gray-700 mb-2">
																				Given the following scenario: Lorem ipsum dolor sit amet, consectetur
																				adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore
																				magna aliqua.
																			</p>
																			<p className="text-gray-700">
																				<span className="font-semibold">Solution:</span> The approach involves
																				applying the fundamental concepts discussed earlier, ensuring each step
																				follows logically from the previous one.
																			</p>
																		</div>

																		<div className="bg-green-50 border-l-4 border-green-500 p-4 mb-4">
																			<p className="font-semibold text-green-900 mb-2">Example 2: Intermediate Challenge</p>
																			<p className="text-gray-700 mb-2">
																				This problem introduces additional complexity: Ut enim ad minim veniam,
																				quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
																				consequat.
																			</p>
																			<p className="text-gray-700">
																				<span className="font-semibold">Solution:</span> Breaking down the problem
																				into smaller parts helps manage complexity and ensures no detail is overlooked.
																			</p>
																		</div>

																		<div className="bg-purple-50 border-l-4 border-purple-500 p-4">
																			<p className="font-semibold text-purple-900 mb-2">Example 3: Advanced Problem</p>
																			<p className="text-gray-700 mb-2">
																				The most challenging scenario combines multiple concepts: Duis aute irure
																				dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat
																				nulla pariatur.
																			</p>
																			<p className="text-gray-700">
																				<span className="font-semibold">Solution:</span> This requires integrating
																				all previously learned concepts and applying critical thinking to develop
																				an optimal solution.
																			</p>
																		</div>
																	</div>

																	<div>
																		<h3 className="font-semibold text-lg mb-3">Advanced Discussion</h3>
																		<p className="text-gray-700 leading-relaxed mb-4">
																			Now that we&apos;ve covered the basics and intermediate concepts, let&apos;s delve
																			into more advanced topics. These discussions will challenge your understanding
																			and push you to think critically about the material.
																		</p>
																		<p className="text-gray-700 leading-relaxed mb-4">
																			Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque
																			habitant morbi tristique senectus et netus et malesuada fames ac turpis
																			egestas. Mauris vel diam vitae augue maximus consectetur. Nunc dignissim
																			risus id metus aliquam blandit.
																		</p>
																		<p className="text-gray-700 leading-relaxed mb-4">
																			Sed euismod nisi porta lorem mollis aliquam. Ut porttitor leo a diam
																			sollicitudin tempor. Nulla facilisi. Curabitur aliquet quam id dui
																			posuere blandit. Vivamus magna justo, lacinia eget consectetur sed,
																			convallis at tellus.
																		</p>
																		<div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
																			<p className="font-semibold text-amber-900 mb-2">💡 Important Note:</p>
																			<p className="text-gray-700">
																				Pay special attention to this section as it contains crucial information
																				that will be referenced in future topics. Understanding these advanced
																				concepts thoroughly will significantly enhance your mastery of the subject.
																			</p>
																		</div>
																	</div>

																	<div>
																		<h3 className="font-semibold text-lg mb-3">Common Mistakes to Avoid</h3>
																		<p className="text-gray-700 leading-relaxed mb-4">
																			Learning from mistakes is an essential part of the educational process.
																			Here are some common pitfalls that students often encounter:
																		</p>
																		<ul className="space-y-3">
																			<li className="flex items-start">
																				<span className="text-red-500 font-bold mr-2">✗</span>
																				<div>
																					<span className="font-semibold text-gray-900">Mistake 1:</span>
																					<span className="text-gray-700"> Rushing through the foundational concepts without fully understanding them</span>
																				</div>
																			</li>
																			<li className="flex items-start">
																				<span className="text-red-500 font-bold mr-2">✗</span>
																				<div>
																					<span className="font-semibold text-gray-900">Mistake 2:</span>
																					<span className="text-gray-700"> Not practicing enough with varied examples</span>
																				</div>
																			</li>
																			<li className="flex items-start">
																				<span className="text-red-500 font-bold mr-2">✗</span>
																				<div>
																					<span className="font-semibold text-gray-900">Mistake 3:</span>
																					<span className="text-gray-700"> Memorizing solutions instead of understanding the underlying principles</span>
																				</div>
																			</li>
																			<li className="flex items-start">
																				<span className="text-red-500 font-bold mr-2">✗</span>
																				<div>
																					<span className="font-semibold text-gray-900">Mistake 4:</span>
																					<span className="text-gray-700"> Neglecting to review and reinforce previously learned material</span>
																				</div>
																			</li>
																		</ul>
																	</div>

																	<div>
																		<h3 className="font-semibold text-lg mb-3">Tips and Tricks</h3>
																		<p className="text-gray-700 leading-relaxed mb-4">
																			Master practitioners have developed these helpful strategies over years
																			of experience. Incorporate these tips into your learning routine for
																			optimal results.
																		</p>
																		<ul className="list-disc list-inside space-y-3 text-gray-700">
																			<li>
																				<span className="font-semibold">First tip:</span> Create a structured study schedule and stick to it consistently.
																				Regular practice is more effective than cramming.
																			</li>
																			<li>
																				<span className="font-semibold">Second tip:</span> Use mnemonic devices and visual aids to remember important
																				concepts. Creating mental associations helps with long-term retention.
																			</li>
																			<li>
																				<span className="font-semibold">Third tip:</span> Practice active recall by testing yourself regularly without
																				looking at your notes. This strengthens memory pathways.
																			</li>
																			<li>
																				<span className="font-semibold">Fourth tip:</span> Form study groups to discuss difficult concepts with peers.
																				Teaching others is one of the best ways to solidify your own understanding.
																			</li>
																			<li>
																				<span className="font-semibold">Fifth tip:</span> Take regular breaks during study sessions to maintain focus
																				and prevent burnout. The Pomodoro Technique is highly effective.
																			</li>
																			<li>
																				<span className="font-semibold">Sixth tip:</span> Connect new concepts to real-world applications whenever
																				possible. Practical context makes abstract ideas more tangible.
																			</li>
																		</ul>
																	</div>

																	<div>
																		<h3 className="font-semibold text-lg mb-3">Practical Applications</h3>
																		<p className="text-gray-700 leading-relaxed mb-4">
																			Understanding how these concepts apply in real-world scenarios is crucial
																			for developing practical mastery. Let&apos;s examine several applications across
																			different contexts.
																		</p>
																		<div className="space-y-4">
																			<div className="border border-gray-200 rounded-lg p-4">
																				<h4 className="font-semibold text-gray-900 mb-2">Application in Industry</h4>
																				<p className="text-gray-700">
																					Professional environments utilize these concepts daily in various
																					projects and operations. Understanding industry applications prepares
																					you for real-world challenges and career opportunities.
																				</p>
																			</div>
																			<div className="border border-gray-200 rounded-lg p-4">
																				<h4 className="font-semibold text-gray-900 mb-2">Academic Research</h4>
																				<p className="text-gray-700">
																					Researchers build upon these fundamental concepts to push the boundaries
																					of knowledge. Many breakthrough discoveries stem from deep understanding
																					of core principles.
																				</p>
																			</div>
																			<div className="border border-gray-200 rounded-lg p-4">
																				<h4 className="font-semibold text-gray-900 mb-2">Everyday Life</h4>
																				<p className="text-gray-700">
																					Even outside professional and academic settings, these concepts influence
																					decision-making and problem-solving in daily situations.
																				</p>
																			</div>
																		</div>
																	</div>

																	<div>
																		<h3 className="font-semibold text-lg mb-3">Summary</h3>
																		<p className="text-gray-700 leading-relaxed mb-4">
																			Let&apos;s review the key points we&apos;ve covered throughout this comprehensive
																			material. Understanding these core takeaways will help you apply what
																			you&apos;ve learned effectively.
																		</p>
																		<div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-6">
																			<h4 className="font-semibold text-gray-900 mb-3">Key Takeaways:</h4>
																			<ul className="space-y-2 text-gray-700">
																				<li className="flex items-start">
																					<span className="text-blue-600 mr-2">•</span>
																					<span>Mastered fundamental concepts and their interconnections</span>
																				</li>
																				<li className="flex items-start">
																					<span className="text-blue-600 mr-2">•</span>
																					<span>Explored practical applications through detailed examples</span>
																				</li>
																				<li className="flex items-start">
																					<span className="text-blue-600 mr-2">•</span>
																					<span>Learned advanced techniques and best practices</span>
																				</li>
																				<li className="flex items-start">
																					<span className="text-blue-600 mr-2">•</span>
																					<span>Identified common mistakes and how to avoid them</span>
																				</li>
																				<li className="flex items-start">
																					<span className="text-blue-600 mr-2">•</span>
																					<span>Developed strategies for effective learning and retention</span>
																				</li>
																			</ul>
																		</div>
																		<p className="text-gray-700 leading-relaxed mt-4">
																			Continue practicing these concepts regularly and don&apos;t hesitate to revisit
																			sections that need reinforcement. Mastery comes through consistent effort
																			and application over time.
																		</p>
																	</div>

																	<div>
																		<h3 className="font-semibold text-lg mb-3">Next Steps</h3>
																		<p className="text-gray-700 leading-relaxed mb-4">
																			Now that you&apos;ve completed this material, here are recommended next steps
																			to continue your learning journey:
																		</p>
																		<ol className="list-decimal list-inside space-y-3 text-gray-700">
																			<li>Practice with the available exercise questions to test your understanding</li>
																			<li>Review areas where you felt less confident</li>
																			<li>Explore related topics that build upon this foundation</li>
																			<li>Apply these concepts in practical projects or assignments</li>
																			<li>Join discussion forums to engage with other learners</li>
																		</ol>
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

                                    {/* <div className="border-t pt-4">
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
                                    </div> */}

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