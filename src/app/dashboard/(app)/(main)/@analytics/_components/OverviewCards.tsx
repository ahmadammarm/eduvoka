"use client";

import {
    BookOpen,
    Target,
    Clock,
    Flame,
    TrendingUp,
    TrendingDown,
} from "lucide-react";
import type { OverviewStats } from "../_types/analytics";

interface CardConfig {
    label: string;
    value: string | number;
    icon: React.ComponentType<{ className?: string }>;
    color: string;
    bgColor: string;
    sub?: {
        value: string;
        positive: boolean;
    };
}

export default function OverviewCards({ stats }: { stats: OverviewStats }) {
    const cards: CardConfig[] = [
        {
            label: "Total Sessions",
            value: stats.totalSessions,
            icon: BookOpen,
            color: "text-blue-500",
            bgColor: "bg-blue-50 dark:bg-blue-950",
            sub: {
                value: `Practice & Materials`,
                positive: true,
            },
        },
        {
            label: "Accuracy",
            value: `${stats.overallAccuracy}%`,
            icon: Target,
            color: "text-green-500",
            bgColor: "bg-green-50 dark:bg-green-950",
            sub:
                stats.improvementRate !== 0
                    ? {
                        value: `${stats.improvementRate > 0 ? "+" : ""}${stats.improvementRate}%`,
                        positive: stats.improvementRate > 0,
                    }
                    : undefined,
        },
        {
            label: "Study Time",
            value: formatStudyTime(stats.totalStudyMinutes),
            icon: Clock,
            color: "text-purple-500",
            bgColor: "bg-purple-50 dark:bg-purple-950",
            sub: {
                value: `~${stats.avgSessionDuration} min/session`,
                positive: true,
            },
        },
        {
            label: "Streak",
            value: `${stats.currentStreak} days`,
            icon: Flame,
            color: "text-orange-500",
            bgColor: "bg-orange-50 dark:bg-orange-950",
            sub: {
                value: `Best: ${stats.bestStreak} days`,
                positive: true,
            },
        },
    ];

    return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {cards.map((card) => {
                const Icon = card.icon;
                return (
                    <div
                        key={card.label}
                        className={`${card.bgColor} rounded-lg p-4 space-y-2`}
                    >
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-500 dark:text-gray-400">
                                {card.label}
                            </span>
                            <Icon className={`h-4 w-4 ${card.color}`} />
                        </div>
                        <p className="text-2xl font-bold">{card.value}</p>
                        {card.sub && (
                            <div className="flex items-center gap-1 text-xs">
                                {card.sub.positive ? (
                                    <TrendingUp className="h-3 w-3 text-green-500" />
                                ) : (
                                    <TrendingDown className="h-3 w-3 text-red-500" />
                                )}
                                <span
                                    className={
                                        card.sub.positive
                                            ? "text-green-600"
                                            : "text-red-600"
                                    }
                                >
                                    {card.sub.value}
                                </span>
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
}

function formatStudyTime(minutes: number): string {
    if (minutes < 60) return `${minutes} min`;
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours} hrs`;
}