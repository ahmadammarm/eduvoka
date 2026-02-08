"use client";

import { Clock, Target, BookOpen, GraduationCap } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { RecentSession } from "../_types/analytics";

export default function RecentSessionList({
    sessions,
}: {
    sessions: RecentSession[];
}) {
    if (sessions.length === 0) {
        return (
            <div className="bg-gray-50 dark:bg-stone-800 rounded-lg p-6 text-center text-gray-500">
                Belum ada sesi latihan.
            </div>
        );
    }

    return (
        <div className="bg-gray-50 dark:bg-stone-800 rounded-lg p-4">
            <h3 className="text-sm font-semibold mb-3">Sesi Terakhir</h3>
            <div className="space-y-2 max-h-80 overflow-y-auto">
                {sessions.map((s) => (
                    <div
                        key={`${s.type}-${s.id}`}
                        className="flex items-center justify-between bg-white dark:bg-stone-700 rounded-lg p-3 gap-2"
                    >
                        <div className="flex items-center gap-3 min-w-0">
                            {s.type === "LATIHAN" ? (
                                <GraduationCap className="h-4 w-4 text-blue-400 shrink-0" />
                            ) : (
                                <BookOpen className="h-4 w-4 text-purple-400 shrink-0" />
                            )}
                            <div className="min-w-0">
                                <p className="text-sm font-medium truncate">
                                    {s.materiName}
                                </p>
                                <p className="text-xs text-gray-500">
                                    {new Date(s.startedAt).toLocaleDateString(
                                        "id-ID",
                                        {
                                            day: "numeric",
                                            month: "short",
                                            hour: "2-digit",
                                            minute: "2-digit",
                                        }
                                    )}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                            <Badge
                                variant="outline"
                                className={`text-[10px] ${
                                    s.type === "LATIHAN"
                                        ? "border-blue-300 text-blue-600"
                                        : "border-purple-300 text-purple-600"
                                }`}
                            >
                                {s.type === "LATIHAN" ? "Latihan" : "Materi"}
                            </Badge>

                            {s.accuracy !== null && (
                                <div className="flex items-center gap-1 text-xs">
                                    <Target className="h-3 w-3" />
                                    <span
                                        className={
                                            s.accuracy >= 70
                                                ? "text-green-600"
                                                : s.accuracy >= 40
                                                  ? "text-yellow-600"
                                                  : "text-red-600"
                                        }
                                    >
                                        {s.accuracy}%
                                    </span>
                                </div>
                            )}

                            {s.totalDuration !== null && s.totalDuration > 0 && (
                                <div className="flex items-center gap-1 text-xs text-gray-500">
                                    <Clock className="h-3 w-3" />
                                    <span>
                                        {Math.round(s.totalDuration / 60)}m
                                    </span>
                                </div>
                            )}

                            {s.totalQuestions > 0 && (
                                <span className="text-xs text-gray-400">
                                    {s.totalQuestions} soal
                                </span>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}