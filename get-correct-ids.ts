import "dotenv/config";
import { prisma } from "./src/lib/prisma";

async function getCorrectIds() {
    const user = await prisma.user.findUnique({
        where: { email: "avanfabiandaniswara@gmail.com" }
    });

    if (!user) {
        console.log("User not found");
        return;
    }

    const sessions = await prisma.latihanSession.findMany({
        where: {
            userId: user.id,
            endedAt: { not: null }
        },
        orderBy: { startedAt: 'desc' },
        take: 1,
        select: {
            id: true,
            accuracyRate: true,
            averageTimePerQ: true,
            score: true
        }
    });

    if (sessions.length === 0) {
        console.log("No completed sessions found");
        return;
    }

    const session = sessions[0];
    console.log("UserID:", user.id);
    console.log("SessionID:", session.id);
    console.log("AccuracyRate:", session.accuracyRate);
    console.log("AvgTimePerQ:", session.averageTimePerQ);
    console.log("Score:", session.score);

    const question = await prisma.latihanJawabanUser.findFirst({
        where: { sessionId: session.id },
        select: { soalLatihanId: true }
    });

    if (question) {
        console.log("QuestionID:", question.soalLatihanId);
    }
}

getCorrectIds().then(() => prisma.$disconnect()).catch(console.error);
