'use client';

import { TrendingUp, Clock, Target } from 'lucide-react';
import { useEffect, useState } from 'react';

interface MetricsHeaderProps {
    topic: string;
    sessionId?: string;
    userId?: string;
}

export default function MetricsHeader({ topic, sessionId, userId }: MetricsHeaderProps) {
    const [velocity, setVelocity] = useState<number | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (sessionId && userId) {
            fetchVelocity();
        }
    }, [sessionId, userId]);

    const fetchVelocity = async () => {
        if (!sessionId || !userId) return;

        setLoading(true);
        try {
            const response = await fetch('/api/metrics/velocity', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ sessionId, userId })
            });
            const data = await response.json();
            if (data.velocity) {
                setVelocity(data.velocity);
            }
        } catch (error) {
            console.error('Failed to fetch velocity:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-4 rounded-lg shadow-lg mb-6">
            <div className="flex items-center justify-between flex-wrap gap-4">
                {/* Topic */}
                <div className="flex items-center gap-3">
                    <Target className="w-6 h-6" />
                    <div>
                        <p className="text-xs text-indigo-200">Current Topic</p>
                        <p className="font-bold text-lg">{topic}</p>
                    </div>
                </div>

                {/* Learning Velocity */}
                <div className="flex items-center gap-3">
                    <TrendingUp className="w-6 h-6" />
                    <div>
                        <p className="text-xs text-indigo-200">Learning Velocity</p>
                        <p className="font-bold text-lg">
                            {loading ? (
                                <span className="animate-pulse">Loading...</span>
                            ) : velocity !== null ? (
                                `${velocity.toFixed(1)}%`
                            ) : (
                                '--'
                            )}
                        </p>
                    </div>
                </div>

                {/* Session Status */}
                <div className="flex items-center gap-3">
                    <Clock className="w-6 h-6" />
                    <div>
                        <p className="text-xs text-indigo-200">Mode</p>
                        <p className="font-bold text-lg">Socratic</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
