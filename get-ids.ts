import "dotenv/config";
import { prisma } from "./src/lib/prisma";

async function main() {
    const user = await prisma.user.findUnique({
        where: { email: "avanfabiandaniswara@gmail.com" }
    });

    const sessions = await prisma.latihanSession.findMany({
        where: {
            userId: user!.id,
            endedAt: { not: null }
        },
        orderBy: { startedAt: 'desc' },
        take: 1
    });

    if (sessions.length > 0) {
        console.log("SessionID:", sessions[0].id);
        console.log("UserID:", user!.id);

        const question = await prisma.latihanJawabanUser.findFirst({
            where: { sessionId: sessions[0].id }
        });

        if (question) {
            console.log("QuestionID:", question.soalLatihanId);
        }
    }
}

main().then(() => prisma.$disconnect()).catch(console.error);
