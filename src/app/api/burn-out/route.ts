import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
	try {
		const body = await req.json();
		const score: number = Number(body.score);
		const userIdVar: string = String(body.InputUserId);

		const getUserId = await prisma.learningMetrics.findFirst({
			where: { userId: userIdVar },
		});

		const timeStudyed = getUserId?.totalStudyTime || 0;
		const correctAnswers = getUserId?.correctAnswers || 0;

		let stressLevel: "Low" | "Moderate" | "High" = "Low";
		if (timeStudyed > 60000 && correctAnswers < 50) {
			stressLevel = "High";
		} else if (timeStudyed >= 30000 && correctAnswers < 75) {
			stressLevel = "Moderate";
		}

		return NextResponse.json({ stressLevel });
	} catch (error) {
		return NextResponse.json(
			{ message: "Internal Server Error" },
			{ status: 500 },
		);
	}
}
