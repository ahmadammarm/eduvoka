import { NextResponse } from "next/server";

export async function POST(req: Request) {
	try {
		const body = await req.json();
		const timeRaw: number = Number(body.time);

		// Validasi input
		if (isNaN(timeRaw) || timeRaw < 0) {
			return NextResponse.json(
				{ message: "Invalid time value" },
				{ status: 400 },
			);
		}

		// Time decay menggunakan exponential decay
		// Formula: decay = e^(-λt)
		// λ (lambda) adalah decay rate, semakin besar semakin cepat decay
		// t adalah waktu dalam hari

		const timeInDays = timeRaw / (24 * 60 * 60 * 1000); // convert ms to days
		const decayRate = 0.05; // decay 5% per hari (adjustable)

		// Exponential decay formula
		const decayFactor: number = Math.exp(-decayRate * timeInDays);

		return NextResponse.json(
			{
				timeRaw,
				timeInDays: parseFloat(timeInDays.toFixed(2)),
				decayFactor: parseFloat(decayFactor.toFixed(4)),
				decayPercentage: parseFloat((decayFactor * 100).toFixed(2)),
			},
			{ status: 200 },
		);
	} catch (error) {
		return NextResponse.json(
			{ message: "Internal Server Error" },
			{ status: 500 },
		);
	}
}
