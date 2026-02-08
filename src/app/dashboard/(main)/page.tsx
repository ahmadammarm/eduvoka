import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, BookOpen, BrainCircuit, PlayCircle } from "lucide-react";
import Link from "next/link";

export default function Page() {
	return (
		<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
			{/* Hero Action Card */}
			<Card className="col-span-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white border-none shadow-lg">
				<CardHeader>
					<CardTitle className="text-2xl md:text-3xl font-bold">
						Welcome back, Scholar!
					</CardTitle>
					<CardDescription className="text-blue-100 text-base md:text-lg">
						Your personalized AI tutor is ready. Let's boost your UTBK score today.
					</CardDescription>
				</CardHeader>
				<CardContent className="flex flex-col sm:flex-row gap-4">
					<Link href="/dashboard/latihan-soal">
						<Button size="lg" variant="secondary" className="w-full sm:w-auto font-bold text-blue-700 hover:text-blue-800">
							<BrainCircuit className="w-5 h-5 mr-2" />
							Start Diagnostic Test
						</Button>
					</Link>
					<Link href="/dashboard/materi">
						<Button size="lg" variant="outline" className="w-full sm:w-auto bg-blue-700/50 border-blue-400 text-white hover:bg-blue-700 hover:text-white">
							<BookOpen className="w-5 h-5 mr-2" />
							Resume Materials
						</Button>
					</Link>
				</CardContent>
			</Card>

			{/* Quick Stats / Info Cards */}
			<Card className="hover:shadow-md transition-shadow">
				<CardHeader className="pb-2">
					<CardTitle className="text-lg font-medium">Learning Velocity</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="text-3xl font-bold text-green-600">+15%</div>
					<p className="text-xs text-muted-foreground mt-1">Faster comprehension this week</p>
					<Link href="/dashboard/learning-velocity" className="text-sm text-blue-600 hover:underline mt-4 inline-block">
						View Details &rarr;
					</Link>
				</CardContent>
			</Card>

			<Card className="hover:shadow-md transition-shadow">
				<CardHeader className="pb-2">
					<CardTitle className="text-lg font-medium">Daily Goal</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="text-3xl font-bold text-amber-600">45/60</div>
					<p className="text-xs text-muted-foreground mt-1">Minutes studied today</p>
					<div className="w-full bg-gray-200 rounded-full h-2 mt-3">
						<div className="bg-amber-500 h-2 rounded-full" style={{ width: '75%' }}></div>
					</div>
				</CardContent>
			</Card>

			<Card className="hover:shadow-md transition-shadow md:col-span-2 lg:col-span-1">
				<CardHeader className="pb-2">
					<CardTitle className="text-lg font-medium">Recommended Topic</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="font-semibold text-indigo-700">Penalaran Umum: Logika Deduktif</div>
					<p className="text-xs text-muted-foreground mt-1 mb-4">Based on your recent quiz performance</p>
					<Link href="/dashboard/materi">
						<Button size="sm" variant="ghost" className="p-0 h-auto text-blue-600 hover:text-blue-800">
							Start Lesson <ArrowRight className="w-4 h-4 ml-1" />
						</Button>
					</Link>
				</CardContent>
			</Card>
		</div>
	);
}
