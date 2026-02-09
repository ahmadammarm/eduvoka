"use client";

import {
    Bar,
    BarChart,
    XAxis,
    YAxis,
    CartesianGrid,
    Radar,
    RadarChart,
    PolarGrid,
    PolarAngleAxis,
    PolarRadiusAxis,
    Cell,
} from "recharts";
import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
    ChartLegend,
    ChartLegendContent,
    type ChartConfig,
} from "@/components/ui/chart";
import type { SubjectPerformance } from "../_types/analytics";

// Warna per subtest
const SUBTEST_COLORS: Record<string, string> = {
    PU: "#6366f1", // indigo
    PK: "#f59e0b", // amber
    PPU: "#10b981", // emerald
    PBM: "#ef4444", // red
    LITERASIBINDO: "#3b82f6", // blue
    LITERASIBINGG: "#8b5cf6", // violet
};

const SUBTEST_SHORT: Record<string, string> = {
    PU: "PU",
    PK: "PK",
    PPU: "PPU",
    PBM: "PBM",
    LITERASIBINDO: "Indo Lit",
    LITERASIBINGG: "Eng Lit",
};

// All 6 subtests
const ALL_SUBTESTS = [
    { key: "PU", label: "General Reasoning" },
    { key: "PK", label: "Quantitative Knowledge" },
    { key: "PPU", label: "General Knowledge & Understanding" },
    { key: "PBM", label: "Reading Comprehension & Writing" },
    { key: "LITERASIBINDO", label: "Indonesian Literacy" },
    { key: "LITERASIBINGG", label: "English Literacy" },
];

const radarChartConfig = {
    accuracy: {
        label: "Accuracy (%)",
        color: "#6366f1",
    },
} satisfies ChartConfig;

const barChartConfig = {
    accuracy: {
        label: "Accuracy (%)",
        color: "#6366f1",
    },
} satisfies ChartConfig;

function getAccuracyColor(accuracy: number): string {
    if (accuracy >= 80) return "#22c55e";
    if (accuracy >= 60) return "#eab308";
    if (accuracy >= 40) return "#f97316";
    return "#ef4444";
}

function getAccuracyLabel(accuracy: number): string {
    if (accuracy >= 80) return "Excellent";
    if (accuracy >= 60) return "Good";
    if (accuracy >= 40) return "Fair";
    return "Needs Improvement";
}

export default function SubjectTable({
    subjectPerformance = [],
}: {
    subjectPerformance: SubjectPerformance[];
}) {
    // Build data for all 6 subtests (fill missing with 0)
    const performanceMap = new Map(
        subjectPerformance.map((s) => [s.kategori, s])
    );

    const fullData = ALL_SUBTESTS.map((sub) => {
        const data = performanceMap.get(sub.key);
        return {
            kategori: sub.key,
            kategoriLabel: sub.label,
            shortLabel: SUBTEST_SHORT[sub.key] ?? sub.key,
            totalQuestions: data?.totalQuestions ?? 0,
            correctAnswers: data?.correctAnswers ?? 0,
            accuracy: data?.accuracy ?? 0,
            avgTimePerQuestion: data?.avgTimePerQuestion ?? 0,
            sessionsCount: data?.sessionsCount ?? 0,
            color: SUBTEST_COLORS[sub.key] ?? "#94a3b8",
        };
    });

    const hasData = fullData.some((d) => d.totalQuestions > 0);

    if (!hasData) {
        return (
            <div className="bg-gray-50 dark:bg-stone-800 rounded-lg p-6 text-center text-gray-500">
                No subtest performance data yet. Start practicing to see analysis!
            </div>
        );
    }

    // Overall average
    const attempted = fullData.filter((d) => d.totalQuestions > 0);
    const avgAccuracy =
        attempted.length > 0
            ? Number(
                (
                    attempted.reduce((s, d) => s + d.accuracy, 0) /
                    attempted.length
                ).toFixed(1)
            )
            : 0;

    // Best & worst
    const best = attempted.reduce((a, b) =>
        a.accuracy > b.accuracy ? a : b
    );
    const worst = attempted.reduce((a, b) =>
        a.accuracy < b.accuracy ? a : b
    );

    return (
        <div className="space-y-6">
            {/* Summary Cards */}
            <div className="grid grid-cols-3 gap-3">
                <div className="bg-gray-50 dark:bg-stone-800 rounded-lg p-3 text-center">
                    <p className="text-xs text-gray-500">Average Accuracy</p>
                    <p
                        className="text-xl font-bold mt-1"
                        style={{ color: getAccuracyColor(avgAccuracy) }}
                    >
                        {avgAccuracy}%
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">
                        {getAccuracyLabel(avgAccuracy)}
                    </p>
                </div>
                <div className="bg-green-50 dark:bg-green-950 rounded-lg p-3 text-center">
                    <p className="text-xs text-gray-500">Best Subtest</p>
                    <p className="text-sm font-semibold text-green-600 mt-1">
                        {best.shortLabel}
                    </p>
                    <p className="text-xs text-green-500">{best.accuracy}%</p>
                </div>
                <div className="bg-red-50 dark:bg-red-950 rounded-lg p-3 text-center">
                    <p className="text-xs text-gray-500">Needs Improvement</p>
                    <p className="text-sm font-semibold text-red-600 mt-1">
                        {worst.shortLabel}
                    </p>
                    <p className="text-xs text-red-500">{worst.accuracy}%</p>
                </div>
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* Radar Chart */}
                <div className="bg-gray-50 dark:bg-stone-800 rounded-lg p-4 space-y-2">
                    <h3 className="text-sm font-semibold">
                        Performance Radar
                    </h3>
                    <p className="text-xs text-gray-500">
                        Visualizing skill balance across all subtests
                    </p>

                    <ChartContainer
                        config={radarChartConfig}
                        className="mx-auto h-[280px] w-full"
                    >
                        <RadarChart data={fullData} cx="50%" cy="50%">
                            <PolarGrid
                                className="stroke-gray-200 dark:stroke-stone-700"
                                strokeDasharray="3 3"
                            />
                            <PolarAngleAxis
                                dataKey="shortLabel"
                                tick={({ x, y, payload }) => {
                                    const d = fullData.find(
                                        (f) => f.shortLabel === payload.value
                                    );
                                    return (
                                        <text
                                            x={x}
                                            y={y}
                                            textAnchor="middle"
                                            dominantBaseline="central"
                                            className="text-[10px] sm:text-xs fill-gray-600 dark:fill-gray-400"
                                        >
                                            <tspan
                                                x={x}
                                                dy={0}
                                                fontWeight={600}
                                            >
                                                {payload.value}
                                            </tspan>
                                            {d && d.totalQuestions > 0 && (
                                                <tspan
                                                    x={x}
                                                    dy={12}
                                                    className="fill-gray-400"
                                                    fontSize={9}
                                                >
                                                    {d.accuracy}%
                                                </tspan>
                                            )}
                                        </text>
                                    );
                                }}
                            />
                            <PolarRadiusAxis
                                angle={90}
                                domain={[0, 100]}
                                tick={{ fontSize: 9 }}
                                tickCount={5}
                                className="fill-gray-400"
                            />
                            <ChartTooltip
                                content={
                                    <ChartTooltipContent
                                        formatter={(_v, _n, item) => {
                                            const p = item?.payload;
                                            if (!p) return null;
                                            return (
                                                <div className="space-y-0.5 text-xs">
                                                    <p className="font-semibold">
                                                        {p.kategoriLabel}
                                                    </p>
                                                    <p>
                                                        Accuracy:{" "}
                                                        <span
                                                            className="font-medium"
                                                            style={{
                                                                color: getAccuracyColor(
                                                                    p.accuracy
                                                                ),
                                                            }}
                                                        >
                                                            {p.accuracy}%
                                                        </span>
                                                    </p>
                                                    <p>
                                                        {p.correctAnswers}/
                                                        {p.totalQuestions} correct
                                                    </p>
                                                    <p>
                                                        Avg:{" "}
                                                        {p.avgTimePerQuestion}s/question
                                                    </p>
                                                </div>
                                            );
                                        }}
                                    />
                                }
                            />
                            <Radar
                                name="Accuracy"
                                dataKey="accuracy"
                                stroke="#6366f1"
                                fill="#6366f1"
                                fillOpacity={0.2}
                                strokeWidth={2}
                                dot={{
                                    r: 4,
                                    fill: "#6366f1",
                                    strokeWidth: 0,
                                }}
                            />
                        </RadarChart>
                    </ChartContainer>
                </div>

                {/* Horizontal Bar Chart */}
                <div className="bg-gray-50 dark:bg-stone-800 rounded-lg p-4 space-y-2">
                    <h3 className="text-sm font-semibold">
                        Accuracy Percentage per Subtest
                    </h3>
                    <p className="text-xs text-gray-500">
                        Performance comparison across each subtest
                    </p>

                    <ChartContainer
                        config={barChartConfig}
                        className="h-[280px] w-full"
                    >
                        <BarChart
                            data={fullData}
                            layout="vertical"
                            margin={{
                                top: 4,
                                right: 40,
                                bottom: 4,
                                left: 0,
                            }}
                        >
                            <CartesianGrid
                                horizontal={false}
                                strokeDasharray="3 3"
                                className="stroke-gray-200 dark:stroke-stone-700"
                            />
                            <XAxis
                                type="number"
                                domain={[0, 100]}
                                tickLine={false}
                                axisLine={false}
                                fontSize={10}
                                tickMargin={4}
                                unit="%"
                            />
                            <YAxis
                                type="category"
                                dataKey="shortLabel"
                                tickLine={false}
                                axisLine={false}
                                fontSize={11}
                                width={65}
                                tickMargin={4}
                            />
                            <ChartTooltip
                                content={
                                    <ChartTooltipContent
                                        formatter={(_v, _n, item) => {
                                            const p = item?.payload;
                                            if (!p) return null;
                                            return (
                                                <div className="space-y-0.5 text-xs">
                                                    <p className="font-semibold">
                                                        {p.kategoriLabel}
                                                    </p>
                                                    <p>
                                                        Accuracy:{" "}
                                                        <span
                                                            className="font-medium"
                                                            style={{
                                                                color: getAccuracyColor(
                                                                    p.accuracy
                                                                ),
                                                            }}
                                                        >
                                                            {p.accuracy}%
                                                        </span>
                                                    </p>
                                                    <p>
                                                        {p.correctAnswers}/
                                                        {p.totalQuestions} correct
                                                    </p>
                                                    <p>
                                                        {p.sessionsCount} sessions •{" "}
                                                        {p.avgTimePerQuestion}s/question
                                                    </p>
                                                </div>
                                            );
                                        }}
                                    />
                                }
                            />
                            <Bar
                                dataKey="accuracy"
                                radius={[0, 6, 6, 0]}
                                maxBarSize={28}
                                label={({ x, y, width, height, value }) => {
                                    if (!value) return <text />;
                                    return (
                                        <text
                                            x={x + width + 4}
                                            y={y + height / 2}
                                            dominantBaseline="central"
                                            className="text-[11px] font-semibold fill-gray-700 dark:fill-gray-300"
                                        >
                                            {value}%
                                        </text>
                                    );
                                }}
                            >
                                {fullData.map((entry, index) => (
                                    <Cell
                                        key={`bar-${index}`}
                                        fill={entry.color}
                                        fillOpacity={
                                            entry.totalQuestions > 0 ? 1 : 0.2
                                        }
                                    />
                                ))}
                            </Bar>
                        </BarChart>
                    </ChartContainer>
                </div>
            </div>

            {/* Detail Table */}
            <div className="bg-gray-50 dark:bg-stone-800 rounded-lg p-4 space-y-3">
                <h3 className="text-sm font-semibold">Performance Detail</h3>

                <div className="overflow-x-auto">
                    <table className="w-full text-xs">
                        <thead>
                            <tr className="border-b border-gray-200 dark:border-stone-700">
                                <th className="text-left py-2 pr-3 font-medium text-gray-500">
                                    Subtest
                                </th>
                                <th className="text-center py-2 px-2 font-medium text-gray-500">
                                    Questions
                                </th>
                                <th className="text-center py-2 px-2 font-medium text-gray-500">
                                    Correct
                                </th>
                                <th className="text-center py-2 px-2 font-medium text-gray-500">
                                    Accuracy
                                </th>
                                <th className="text-center py-2 px-2 font-medium text-gray-500">
                                    Avg/Q
                                </th>
                                <th className="text-right py-2 pl-2 font-medium text-gray-500">
                                    Sessions
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {fullData.map((sub) => (
                                <tr
                                    key={sub.kategori}
                                    className="border-b border-gray-100 dark:border-stone-700/50 last:border-0"
                                >
                                    <td className="py-2.5 pr-3">
                                        <div className="flex items-center gap-2">
                                            <div
                                                className="w-2.5 h-2.5 rounded-sm flex-shrink-0"
                                                style={{
                                                    backgroundColor: sub.color,
                                                    opacity:
                                                        sub.totalQuestions > 0
                                                            ? 1
                                                            : 0.3,
                                                }}
                                            />
                                            <span
                                                className={
                                                    sub.totalQuestions > 0
                                                        ? "font-medium"
                                                        : "text-gray-400"
                                                }
                                            >
                                                {sub.kategoriLabel}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="text-center py-2.5 px-2">
                                        {sub.totalQuestions || "—"}
                                    </td>
                                    <td className="text-center py-2.5 px-2">
                                        {sub.totalQuestions > 0
                                            ? sub.correctAnswers
                                            : "—"}
                                    </td>
                                    <td className="text-center py-2.5 px-2">
                                        {sub.totalQuestions > 0 ? (
                                            <span
                                                className="font-semibold"
                                                style={{
                                                    color: getAccuracyColor(
                                                        sub.accuracy
                                                    ),
                                                }}
                                            >
                                                {sub.accuracy}%
                                            </span>
                                        ) : (
                                            <span className="text-gray-400">
                                                —
                                            </span>
                                        )}
                                    </td>
                                    <td className="text-center py-2.5 px-2">
                                        {sub.totalQuestions > 0
                                            ? `${sub.avgTimePerQuestion}s`
                                            : "—"}
                                    </td>
                                    <td className="text-right py-2.5 pl-2">
                                        {sub.sessionsCount || "—"}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}