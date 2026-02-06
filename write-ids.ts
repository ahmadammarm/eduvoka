import "dotenv/config";
import { prisma } from "./src/lib/prisma";
import { writeFileSync } from "fs";

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

    const question = await prisma.latihanJawabanUser.findFirst({
        where: { sessionId: sessions[0].id }
    });

    const data = {
        userId: user!.id,
        sessionId: sessions[0].id,
        questionId: question?.soalLatihanId,
        sessionData: sessions[0]
    };

    writeFileSync("session-ids.json", JSON.stringify(data, null, 2));
    console.log("Data written to session-ids.json");
}

main().then(() => prisma.$disconnect()).catch(console.error);
