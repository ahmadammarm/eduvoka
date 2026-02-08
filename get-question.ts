import "dotenv/config";
import { prisma } from "./src/lib/prisma";

async function getQuestion() {
    const question = await prisma.soalLatihanSoal.findUnique({
        where: { id: "latihan-pu-001" },
        include: {
            pilihanJawaban: true,
            pembahasan: true
        }
    });

    if (!question) {
        console.log("Question not found");
        return;
    }

    console.log("=== QUESTION CONTENT ===");
    console.log(question.content);
    console.log("\n=== CHOICES ===");
    question.pilihanJawaban.forEach(p => {
        console.log(`${p.label}. ${p.pilihan}`);
    });
    console.log("\n=== CORRECT ANSWER ===");
    console.log(question.kunciJawaban);
    console.log("\n=== PEMBAHASAN ===");
    if (question.pembahasan.length > 0) {
        console.log(question.pembahasan[0].konten);
    }
}

getQuestion().then(() => prisma.$disconnect()).catch(console.error);
