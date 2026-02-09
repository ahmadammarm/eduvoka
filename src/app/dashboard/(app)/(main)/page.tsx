import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, BookOpen, BrainCircuit, TrendingUp, TrendingDown, Minus, Clock, Target } from "lucide-react";
import Link from "next/link";
import { getOverviewStats, getSubjectPerformance } from "./@analytics/_lib/data";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { calculateLearningVelocity } from "@/lib/metrics";

async function getLatestVelocity(userId: string): Promise<number | null> {
	// Get the latest completed session
	const latestSession = await prisma.latihanSession.findFirst({
		where: {
			userId,
			endedAt: { not: null }
		},
		orderBy: { startedAt: 'desc' },
		select: { id: true }
	});

	if (!latestSession) return null;

	try {
		const result = await calculateLearningVelocity(userId, latestSession.id);
		return result.velocity;
	} catch (error) {
		console.error('Error calculating velocity:', error);
		return null;
	}
}

export default async function Page() {
	const session = await getServerSession(authOptions);
	const userId = session?.user?.id;

	// Use the same data source as the analytics section
	const [overview, subjectPerformance] = await Promise.all([
		getOverviewStats(),
		getSubjectPerformance()
	]);

	// Get actual learning velocity
	let velocityScore: number | null = null;
	if (userId) {
		velocityScore = await getLatestVelocity(userId);
	}

	// Determine velocity display and trend
	const hasVelocity = velocityScore !== null;
	const velocityChange = overview.improvementRate;
	const velocityTrend = velocityChange > 0 ? 'up' : velocityChange < 0 ? 'down' : 'neutral';

	// Get recommended topic (lowest accuracy from subject performance)
	let recommendedTopic = { name: 'Logical Reasoning', id: 'materi-pu-001' };
	if (subjectPerformance.length > 0) {
		// Sort by accuracy ascending to find the weakest subject
		const sorted = [...subjectPerformance].sort((a, b) => a.accuracy - b.accuracy);
		const weakest = sorted[0];
		if (weakest && weakest.accuracy < 80) {
			recommendedTopic = { name: weakest.kategoriLabel, id: weakest.kategori };
		}
	}

	const hasData = overview.totalSessions > 0;
	const VelocityIcon = velocityTrend === 'up' ? TrendingUp : velocityTrend === 'down' ? TrendingDown : Minus;
	const velocityColor = velocityTrend === 'up' ? 'text-green-600' : velocityTrend === 'down' ? 'text-red-600' : 'text-indigo-600';

	return (
		<div className="space-y-8">
			<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
				{/* Hero Action Card */}
				<Card className="col-span-full bg-gradient-to-r from-orange-500 to-amber-600 text-white border-none shadow-sm">
					<CardHeader>
						<CardTitle className="text-2xl md:text-3xl font-bold">
							Welcome back, Scholar!
						</CardTitle>
						<CardDescription className="text-orange-50 text-base md:text-lg">
							Your personalized AI tutor is ready. Let&apos;s boost your UTBK score today.
						</CardDescription>
					</CardHeader>
					<CardContent className="flex flex-col sm:flex-row gap-4">
						<Link href="/dashboard/practice-questions">
							<Button size="lg" variant="secondary" className="w-full sm:w-auto font-bold text-orange-700 hover:text-orange-800 bg-white hover:bg-orange-50">
								<BrainCircuit className="w-5 h-5 mr-2" />
								Start Diagnostic Test
							</Button>
						</Link>
						<Link href="/dashboard/study-materials">
							<Button size="lg" variant="outline" className="w-full sm:w-auto bg-orange-700/50 border-orange-400 text-white hover:bg-orange-700 hover:text-white hover:border-orange-300">
								<BookOpen className="w-5 h-5 mr-2" />
								Resume Materials
							</Button>
						</Link>
					</CardContent>
				</Card>

				{/* Learning Velocity Card */}
				<Card className="hover:shadow-md transition-shadow shadow-sm">
					<CardHeader className="pb-2">
						<CardTitle className="text-lg font-medium flex items-center gap-2">
							<VelocityIcon className={`w-5 h-5 ${velocityColor}`} />
							Learning Velocity
						</CardTitle>
					</CardHeader>
					<CardContent>
						<div className={`text-3xl font-bold ${hasVelocity ? velocityColor : 'text-gray-400'}`}>
							{hasVelocity ? `${velocityScore?.toFixed(1)}` : '--'}
							<span className="text-lg text-gray-400">/100</span>
						</div>
						<p className="text-xs text-muted-foreground mt-1">
							{hasVelocity
								? velocityChange > 0
									? `+${velocityChange}% improvement`
									: velocityChange < 0
										? `${velocityChange}% change`
										: 'Steady progress'
								: 'Complete quizzes to track progress'}
						</p>
						<Link href="/dashboard/learning-velocity" className="text-sm text-blue-600 hover:underline mt-4 inline-block">
							View Details &rarr;
						</Link>
					</CardContent>
				</Card>

				{/* Daily Goal Card */}
				<Card className="hover:shadow-md shadow-sm transition-shadow">
					<CardHeader className="pb-2">
						<CardTitle className="text-lg font-medium flex items-center gap-2">
							<Clock className="w-5 h-5 text-amber-600" />
							Study Time
						</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="text-3xl font-bold text-amber-600">
							{overview.totalStudyMinutes >= 60
								? `${Math.floor(overview.totalStudyMinutes / 60)}h ${overview.totalStudyMinutes % 60}m`
								: `${overview.totalStudyMinutes}m`}
						</div>
						<p className="text-xs text-muted-foreground mt-1">Total study time</p>
						<div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
							<span>~{overview.avgSessionDuration.toFixed(1)} min/session</span>
						</div>
					</CardContent>
				</Card>

				{/* Recommended Topic Card */}
				<Card className="hover:shadow-md shadow-sm transition-shadow md:col-span-2 lg:col-span-1">
					<CardHeader className="pb-2">
						<CardTitle className="text-lg font-medium flex items-center gap-2">
							<Target className="w-5 h-5 text-indigo-600" />
							Recommended Topic
						</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="font-semibold text-indigo-700">{recommendedTopic.name}</div>
						<p className="text-xs text-muted-foreground mt-1 mb-4">
							{hasData ? 'Based on your performance' : 'Start here to begin your journey'}
						</p>
						<Link href="/dashboard/materi">
							<Button size="sm" variant="ghost" className="p-0 h-auto text-blue-600 hover:text-blue-800">
								Start Lesson <ArrowRight className="w-4 h-4 ml-1" />
							</Button>
						</Link>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
