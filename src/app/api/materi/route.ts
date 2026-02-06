import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
export async function GET() {
	try {

		const session = await auth();
		const user = session?.user;

		if (!user) {
			return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
		}

		const materiData = await prisma.materi.findMany({
			orderBy: {
				createdAt: 'desc'
			}
		});
		return NextResponse.json(materiData);
	} catch (error) {
		console.log(error)
		return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
	}
}