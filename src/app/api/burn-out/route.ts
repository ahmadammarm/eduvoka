import { NextResponse } from "next/server";

export async function POST(req: Request) {
	try {
		const body = await req.json();
		const score: number = Number(body.score);

		let stressLevel: "Low" | "Moderate" | "High" = "Low";

		if (score > 30) {
			stressLevel = "High";
		} else if (score >= 15) {
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
