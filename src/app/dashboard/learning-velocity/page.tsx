'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import {
    ActivitySquare,
    Target,
    TrendingUp,
    Clock,
    Book,
    Flame,
    Award,
    Loader2,
    ChevronRight
} from 'lucide-react';
import Link from 'next/link';
import { ScientificMethodologyCard } from '../_components/ScientificMethodologyCard';

interface VelocityData {
    velocity: number;
    components: {
        accuracyScore: number;
        difficultyScore: number;
        timeEfficiency: number;
        improvement: number;
        engagement: number;
    };
}

export default function LearningVelocityPage() {
    const { data: session } = useSession();
    const [velocityData, setVelocityData] = useState<VelocityData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchVelocity = async () => {
            try {
                // Get last session to calculate velocity
                const response = await fetch('/api/metrics/velocity', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        userId: session?.user?.id,
                        // We'll need a way to get latest sessionId - for now use placeholder
                        sessionId: 'latest'
                    })
                });

                if (response.ok) {
                    const data = await response.json();
                    setVelocityData(data);
                }
            } catch (err) {
                setError('Failed to load velocity data');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        if (session?.user?.id) {
            fetchVelocity();
        } else {
            setLoading(false);
        }
    }, [session]);

    const getVelocityGrade = (score: number) => {
        if (score >= 80) return { grade: 'Excellent', color: 'text-green-600', bg: 'bg-green-50', border: 'border-green-200' };
        if (score >= 60) return { grade: 'Good', color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-200' };
        if (score >= 40) return { grade: 'Average', color: 'text-yellow-600', bg: 'bg-yellow-50', border: 'border-yellow-200' };
        return { grade: 'Needs Improvement', color: 'text-red-600', bg: 'bg-red-50', border: 'border-red-200' };
    };

    const ComponentCard = ({
        title,
        score,
        weight,
        icon: Icon,
        description,
        color
    }: {
        title: string;
        score: number;
        weight: number;
        icon: any;
        description: string;
        color: string;
    }) => (
        <div className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                    <div className={`p-3 rounded-lg ${color} bg-opacity-10`}>
                        <Icon className={`w-6 h-6 ${color}`} />
                    </div>
                    <div>
                        <h3 className="font-bold text-gray-900">{title}</h3>
                        <p className="text-sm text-gray-500">Weight: {weight}%</p>
                    </div>
                </div>
                <div className="text-right">
                    <div className="text-2xl font-bold text-gray-900">{(score * 100).toFixed(0)}%</div>
                </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3 mb-3">
                <div
                    className={`h-3 rounded-full ${color} bg-opacity-80`}
                    style={{ width: `${score * 100}%` }}
                />
            </div>
            <p className="text-sm text-gray-600">{description}</p>
        </div>
    );

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen">
                <Loader2 className="w-12 h-12 animate-spin text-blue-600 mb-4" />
                <p className="text-gray-600">Loading your learning velocity...</p>
            </div>
        );
    }

    const gradeInfo = velocityData ? getVelocityGrade(velocityData.velocity) : null;

    return (
        <div className="max-w-7xl mx-auto p-6 space-y-6">
            {/* Header */}
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-8 text-white shadow-xl">
                <div className="flex items-center gap-3 mb-4">
                    <ActivitySquare className="w-10 h-10" />
                    <h1 className="text-4xl font-bold">Learning Velocity</h1>
                </div>
                <p className="text-indigo-100 text-lg">
                    Track your learning effectiveness with precision metrics across 5 key dimensions
                </p>
            </div>

            {/* Main Velocity Score */}
            {velocityData ? (
                <>
                    <div className={`bg-white rounded-2xl p-8 border-2 ${gradeInfo?.border} shadow-lg`}>
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-600 text-sm font-medium uppercase mb-2">Overall Learning Velocity</p>
                                <div className="flex items-baseline gap-3">
                                    <span className="text-6xl font-bold text-gray-900">{velocityData.velocity.toFixed(1)}</span>
                                    <span className="text-3xl text-gray-400">/100</span>
                                </div>
                                <div className={`inline-block mt-4 px-4 py-2 rounded-full ${gradeInfo?.bg} ${gradeInfo?.color} font-semibold`}>
                                    {gradeInfo?.grade}
                                </div>
                            </div>
                            <div className="hidden md:block">
                                <div className="relative w-48 h-48">
                                    <svg className="w-full h-full transform -rotate-90">
                                        <circle
                                            cx="96"
                                            cy="96"
                                            r="88"
                                            stroke="#e5e7eb"
                                            strokeWidth="12"
                                            fill="none"
                                        />
                                        <circle
                                            cx="96"
                                            cy="96"
                                            r="88"
                                            stroke="url(#gradient)"
                                            strokeWidth="12"
                                            fill="none"
                                            strokeDasharray={`${(velocityData.velocity / 100) * 552.64} 552.64`}
                                            strokeLinecap="round"
                                        />
                                        <defs>
                                            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                                <stop offset="0%" stopColor="#6366f1" />
                                                <stop offset="100%" stopColor="#a855f7" />
                                            </linearGradient>
                                        </defs>
                                    </svg>
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <Flame className="w-16 h-16 text-orange-500" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Component Breakdown */}
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                            <Target className="w-6 h-6 text-indigo-600" />
                            Component Breakdown
                        </h2>
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                            <ComponentCard
                                title="Accuracy"
                                score={velocityData.components.accuracyScore}
                                weight={30}
                                icon={Award}
                                description="Percentage of correct answers in practice sessions"
                                color="text-green-600"
                            />
                            <ComponentCard
                                title="Difficulty Mastery"
                                score={velocityData.components.difficultyScore}
                                weight={25}
                                icon={TrendingUp}
                                description="Average complexity of questions you're tackling"
                                color="text-purple-600"
                            />
                            <ComponentCard
                                title="Speed Efficiency"
                                score={velocityData.components.timeEfficiency}
                                weight={15}
                                icon={Clock}
                                description="How quickly you answer compared to target time"
                                color="text-blue-600"
                            />
                            <ComponentCard
                                title="Improvement Trend"
                                score={velocityData.components.improvement}
                                weight={15}
                                icon={TrendingUp}
                                description="Your progress compared to previous sessions"
                                color="text-indigo-600"
                            />
                            <ComponentCard
                                title="Material Engagement"
                                score={velocityData.components.engagement}
                                weight={15}
                                icon={Book}
                                description="Reading time, scroll depth, and focus quality"
                                color="text-orange-600"
                            />
                        </div>
                    </div>

                    {/* Action CTA */}
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="text-lg font-bold text-gray-900 mb-2">Ready to improve your velocity?</h3>
                                <p className="text-gray-600">Start a practice session to see your metrics in action</p>
                            </div>
                            <Link
                                href="/dashboard/latihan-soal"
                                className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg flex items-center gap-2 transition-colors"
                            >
                                Start Practice
                                <ChevronRight className="w-5 h-5" />
                            </Link>
                        </div>
                    </div>
                </>
            ) : (
                <div className="bg-white rounded-xl p-12 text-center border border-gray-200">
                    <ActivitySquare className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-gray-900 mb-2">No Velocity Data Yet</h3>
                    <p className="text-gray-600 mb-6">Complete your first practice session to see your learning velocity metrics</p>
                    <Link
                        href="/dashboard/latihan-soal"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg transition-colors"
                    >
                        Start Your First Session
                        <ChevronRight className="w-5 h-5" />
                    </Link>
                </div>
            )}

            {/* Scientific Methodology Information Card */}
            <ScientificMethodologyCard />
        </div>
    );
}
