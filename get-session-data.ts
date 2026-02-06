import "dotenv/config";
import { prisma } from "./src/lib/prisma";

async function getSessionData() {
    // Get the user
    const user = await prisma.user.findUnique({
        where: { email: "avanfabiandaniswara@gmail.com" }
    });

    if (!user) {
        console.log("❌ User not found");
        return;
    }

    console.log("✅ User found:", user.email, "ID:", user.id);

    // Get completed sessions
    const sessions = await prisma.latihanSession.findMany({
        where: {
            userId: user.id,
            endedAt: { not: null }
        },
        orderBy: { startedAt: 'desc' },
        take: 5,
        select: {
            id: true,
            type: true,
            startedAt: true,
            endedAt: true,
            score: true,
            accuracyRate: true,
            totalDuration: true,
            averageTimePerQ: true
        }
    });

    console.log("\n📊 Completed Sessions:");
    console.log(JSON.stringify(sessions, null, 2));

    if (sessions.length > 0) {
        const latestSession = sessions[0];
        console.log("\n🎯 Latest Session ID:", latestSession.id);
        console.log("✅ You can use this for testing!");

        // Get questions from this session
        const questions = await prisma.latihanJawabanUser.findMany({
            where: { sessionId: latestSession.id },
            take: 1,
            select: {
                soalLatihanId: true,
                soalLatihan: {
                    select: {
                        id: true,
                        content: true,
                        tipe: true
                    }
                }
            }
        });

        if (questions.length > 0) {
            console.log("\n📝 Sample Question ID:", questions[0].soalLatihanId);
            console.log("Question Type:", questions[0].soalLatihan.tipe);
        }
    }
}

getSessionData()
    .then(() => prisma.$disconnect())
    .catch((error) => {
        console.error("❌ Error:", error);
        process.exit(1);
    });
