import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { calculateLearningVelocity } from "@/lib/metrics";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { sessionId, userId } = body;

        if (!sessionId || !userId) {
            return NextResponse.json({ error: "Missing required fields: sessionId, userId" }, { status: 400 });
        }

        // Calculate metrics using the refactored logic
        // This function performs its own DB lookups for accuracy, difficulty, etc.
        const result = await calculateLearningVelocity(userId, sessionId);

        // Save/Update logic.
        // Note: Schema 'SessionMetrics' links to 'UtbkSession' (session field).
        // But we are processing 'LatihanSession'.
        // If 'SessionMetrics' is strictly for UtbkSession, we might need a place for Latihan metrics.
        // However, LatihanSession has a 'score' field. 
        // We will attempt to save 'velocityScore' to SessionMetrics IF sessionId matches a UtbkSession,
        // OR if we treat sessionId as possibly fitting (ID collision unlikely).
        // But since the request is for LatihanSession refactor, and Schema might be mismatched,
        // we will return the result to the client for immediate display.
        // Ideally, we'd update LatihanSession if it had a velocity field.

        // For now, we return the calculated metrics so the frontend can display them "live".
        return NextResponse.json(result);

    } catch (error) {
        console.error("Velocity API Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
