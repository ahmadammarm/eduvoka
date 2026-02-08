"use client";

import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Cell } from "recharts";
import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
    type ChartConfig,
} from "@/components/ui/chart";
import type { StudyTimeDistribution } from "../_types/analytics";

const chartConfig = {
    totalMinutes: {
        label: "Waktu Belajar (menit)",
        color: "#a855f7",
    },
    sessionsCount: {
        label: "Jumlah Sesi",
        color: "#8b5cf6",
    },
} satisfies ChartConfig;

export default function StudyTimeChart({
    distribution,
}: {
    distribution: StudyTimeDistribution[];
}) {
    const hasData = distribution.some((d) => d.totalMinutes > 0);

    if (!hasData) {
        return (
            <div className="bg-gray-50 dark:bg-stone-800 rounded-lg p-6 text-center text-gray-500">
                Belum ada data waktu belajar.
            </div>
        );
    }

    // Find peak hour
    const peak = distribution.reduce((a, b) =>
        a.totalMinutes > b.totalMinutes ? a : b
    );

    // Format data for recharts
    const chartData = distribution.map((slot) => ({
        ...slot,
        label: `${slot.hour.toString().padStart(2, "0")}:00`,
        shortLabel: slot.hour.toString().padStart(2, "0"),
        isPeak: slot.hour === peak.hour && slot.totalMinutes > 0,
    }));

    return (
        <div className="bg-gray-50 dark:bg-stone-800 rounded-lg p-4 space-y-4">
            <h3 className="text-sm font-semibold">
                Distribusi Waktu Belajar (per Jam)
            </h3>

            <ChartContainer config={chartConfig} className="h-[200px] w-full">
                <BarChart
                    data={chartData}
                    margin={{ top: 4, right: 4, bottom: 0, left: -20 }}
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
                        interval={2}
                        tickMargin={4}
                    />
                    <YAxis
                        tickLine={false}
                        axisLine={false}
                        fontSize={10}
                        allowDecimals={false}
                        tickMargin={4}
                        unit=" m"
                    />
                    <ChartTooltip
                        content={
                            <ChartTooltipContent
                                labelKey="label"
                                formatter={(value, name, item) => {
                                    const payload = item?.payload;
                                    if (!payload) return null;
                                    return (
                                        <div className="space-y-0.5">
                                            <p>
                                                <span className="font-medium">
                                                    {payload.totalMinutes}
                                                </span>{" "}
                                                menit
                                            </p>
                                            <p>
                                                <span className="font-medium">
                                                    {payload.sessionsCount}
                                                </span>{" "}
                                                sesi
                                            </p>
                                        </div>
                                    );
                                }}
                            />
                        }
                    />
                    <Bar
                        dataKey="totalMinutes"
                        radius={[3, 3, 0, 0]}
                        maxBarSize={20}
                    >
                        {chartData.map((entry, index) => (
                            <Cell
                                key={`cell-${index}`}
                                fill={entry.isPeak ? "#7c3aed" : "#a855f7"}
                                fillOpacity={
                                    entry.totalMinutes > 0
                                        ? entry.isPeak
                                            ? 1
                                            : 0.7
                                        : 0.15
                                }
                            />
                        ))}
                    </Bar>
                </BarChart>
            </ChartContainer>

            {/* Peak time insight */}
            {peak.totalMinutes > 0 && (
                <p className="text-xs text-gray-500">
                    Waktu paling produktif:{" "}
                    <span className="font-semibold text-purple-600">
                        {peak.hour.toString().padStart(2, "0")}:00 -{" "}
                        {((peak.hour + 1) % 24).toString().padStart(2, "0")}:00
                    </span>{" "}
                    ({peak.totalMinutes} menit total)
                </p>
            )}
        </div>
    );
}