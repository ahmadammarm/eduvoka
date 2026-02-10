"use client";

import {
    Bar,
    BarChart,
    CartesianGrid,
    XAxis,
    YAxis,
    Cell,
    Legend,
} from "recharts";
import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
    type ChartConfig,
} from "@/components/ui/chart";
import type { DailyActivity } from "../_types/analytics";

const soalChartConfig = {
    questionsAnswered: {
        label: "Questions Answered",
        color: "#6366f1",
    },
} satisfies ChartConfig;

const waktuChartConfig = {
    latihanMinutes: {
        label: "Practice Questions",
        color: "#6366f1",
    },
    materiMinutes: {
        label: "Study Material",
        color: "#22c55e",
    },
} satisfies ChartConfig;

function getBarColor(accuracy: number, hasData: boolean): string {
    if (!hasData) return "#d1d5db";
    if (accuracy >= 70) return "#22c55e";
    if (accuracy >= 40) return "#eab308";
    return "#ef4444";
}

export default function ActivityChart({
    dailyActivity,
}: {
    dailyActivity: DailyActivity[];
}) {
    const hasQuestionData = dailyActivity.some(
        (d) => d.questionsAnswered > 0
    );
    const hasTimeData = dailyActivity.some((d) => d.totalStudyMinutes > 0);
    const hasAnyData = hasQuestionData || hasTimeData;

    if (!hasAnyData) {
        return (
            <div className="bg-gray-50 dark:bg-stone-800 rounded-lg p-6 text-center text-gray-500">
                No activity data available. Start practicing or reading materials to see progress!
            </div>
        );
    }

    // Format data for recharts
    const chartData = dailyActivity.map((day) => {
        const date = new Date(day.date);
        return {
            ...day,
            label: date.toLocaleDateString("id-ID", {
                day: "numeric",
                month: "short",
            }),
            shortLabel: `${date.getDate()}`,
        };
    });

    return (
        <div className="space-y-6">
            {/* Chart 1: Soal Dijawab (Latihan) */}
            {hasQuestionData && (
                <div className="bg-gray-50 dark:bg-stone-800 rounded-lg p-4 space-y-3">
                    <div className="flex items-center justify-between">
                        <h3 className="text-sm font-semibold">
                            Questions Answered (30 Days)
                        </h3>
                        <p className="text-xs text-gray-500">
                            Total:{" "}
                            <span className="font-medium">
                                {dailyActivity.reduce(
                                    (s, d) => s + d.questionsAnswered,
                                    0
                                )}
                            </span>{" "}
                            questions
                        </p>
                    </div>

                    <ChartContainer
                        config={soalChartConfig}
                        className="h-[180px] w-full"
                    >
                        <BarChart
                            data={chartData}
                            margin={{
                                top: 4,
                                right: 4,
                                bottom: 0,
                                left: -20,
                            }}
                        >
                            <CartesianGrid
                                vertical={false}
                                strokeDasharray="3 3"
                                className="stroke-gray-200 dark:stroke-stone-700"
                            />
                            <XAxis
                                dataKey="shortLabel"
                                tickLine={false}
                                axisLine={false}
                                fontSize={10}
                                interval="preserveStartEnd"
                                tickMargin={4}
                            />
                            <YAxis
                                tickLine={false}
                                axisLine={false}
                                fontSize={10}
                                allowDecimals={false}
                                tickMargin={4}
                            />
                            <ChartTooltip
                                content={
                                    <ChartTooltipContent
                                        labelKey="label"
                                        formatter={(_value, _name, item) => {
                                            const p = item?.payload;
                                            if (!p) return null;
                                            return (
                                                <div className="space-y-0.5 text-xs">
                                                    <p className="font-semibold">
                                                        {p.label}
                                                    </p>
                                                    <p>
                                                        {
                                                            p.questionsAnswered
                                                        }{" "}
                                                        questions answered
                                                    </p>
                                                    <p>
                                                        Accuracy:{" "}
                                                        <span
                                                            className={
                                                                p.accuracy >= 70
                                                                    ? "text-green-600"
                                                                    : p.accuracy >=
                                                                        40
                                                                        ? "text-yellow-600"
                                                                        : "text-red-600"
                                                            }
                                                        >
                                                            {p.accuracy}%
                                                        </span>
                                                    </p>
                                                    <p>
                                                        practice sessions
                                                    </p>
                                                </div>
                                            );
                                        }}
                                    />
                                }
                            />
                            <Bar
                                dataKey="questionsAnswered"
                                radius={[3, 3, 0, 0]}
                                maxBarSize={20}
                            >
                                {chartData.map((entry, index) => (
                                    <Cell
                                        key={`soal-${index}`}
                                        fill={getBarColor(
                                            entry.accuracy,
                                            entry.questionsAnswered > 0
                                        )}
                                        fillOpacity={
                                            entry.questionsAnswered === 0
                                                ? 0.3
                                                : 1
                                        }
                                    />
                                ))}
                            </Bar>
                        </BarChart>
                    </ChartContainer>

                    {/* Legend akurasi */}
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                        <div className="flex items-center gap-1">
                            <div className="w-3 h-3 rounded bg-green-500" />
                            <span>≥70%</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <div className="w-3 h-3 rounded bg-yellow-500" />
                            <span>40-69%</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <div className="w-3 h-3 rounded bg-red-500" />
                            <span>&lt;40%</span>
                        </div>
                    </div>
                </div>
            )}

            {/* Chart 2: Waktu Belajar (Latihan + Materi stacked) */}
            {hasTimeData && (
                <div className="bg-gray-50 dark:bg-stone-800 rounded-lg p-4 space-y-3">
                    <div className="flex items-center justify-between">
                        <h3 className="text-sm font-semibold">
                            Study Time (30 Days)
                        </h3>
                        <p className="text-xs text-gray-500">
                            Total:{" "}
                            <span className="font-medium">
                                {dailyActivity.reduce(
                                    (s, d) => s + d.totalStudyMinutes,
                                    0
                                )}
                            </span>{" "}
                            minutes
                        </p>
                    </div>

                    <ChartContainer
                        config={waktuChartConfig}
                        className="h-[180px] w-full"
                    >
                        <BarChart
                            data={chartData}
                            margin={{
                                top: 4,
                                right: 4,
                                bottom: 0,
                                left: -20,
                            }}
                        >
                            <CartesianGrid
                                vertical={false}
                                strokeDasharray="3 3"
                                className="stroke-gray-200 dark:stroke-stone-700"
                            />
                            <XAxis
                                dataKey="shortLabel"
                                tickLine={false}
                                axisLine={false}
                                fontSize={10}
                                interval="preserveStartEnd"
                                tickMargin={4}
                            />
                            <YAxis
                                tickLine={false}
                                axisLine={false}
                                fontSize={10}
                                allowDecimals={false}
                                tickMargin={4}
                                unit="m"
                            />
                            <ChartTooltip
                                content={
                                    <ChartTooltipContent
                                        labelKey="label"
                                        formatter={(_value, _name, item) => {
                                            const p = item?.payload;
                                            if (!p) return null;
                                            return (
                                                <div className="space-y-0.5 text-xs">
                                                    <p className="font-semibold">
                                                        {p.label}
                                                    </p>
                                                    <div className="flex items-center gap-1">
                                                        <div className="w-2 h-2 rounded-sm bg-indigo-500" />
                                                        <span>
                                                            Practice:{" "}
                                                            {p.latihanMinutes}{" "}
                                                            minutes (
                                                            {p.latihanSessions}{" "}
                                                            sessions)
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center gap-1">
                                                        <div className="w-2 h-2 rounded-sm bg-green-500" />
                                                        <span>
                                                            Material:{" "}
                                                            {p.materiMinutes}{" "}
                                                            minutes (
                                                            {p.materiSessions}{" "}
                                                            sessions)
                                                        </span>
                                                    </div>
                                                    <p className="font-medium border-t pt-0.5 mt-0.5">
                                                        Total:{" "}
                                                        {p.totalStudyMinutes}{" "}
                                                        minutes
                                                    </p>
                                                </div>
                                            );
                                        }}
                                    />
                                }
                            />
                            <Legend
                                verticalAlign="bottom"
                                height={24}
                                iconType="square"
                                iconSize={10}
                                formatter={(value: string) => {
                                    const labels: Record<string, string> = {
                                        latihanMinutes: "Practice Questions",
                                        materiMinutes: "Study Material",
                                    };
                                    return (
                                        <span className="text-xs text-gray-600 dark:text-gray-400">
                                            {labels[value] ?? value}
                                        </span>
                                    );
                                }}
                            />
                            <Bar
                                dataKey="latihanMinutes"
                                stackId="waktu"
                                fill="#6366f1"
                                radius={[0, 0, 0, 0]}
                                maxBarSize={20}
                            />
                            <Bar
                                dataKey="materiMinutes"
                                stackId="waktu"
                                fill="#22c55e"
                                radius={[3, 3, 0, 0]}
                                maxBarSize={20}
                            />
                        </BarChart>
                    </ChartContainer>
                </div>
            )}
        </div>
    );
}