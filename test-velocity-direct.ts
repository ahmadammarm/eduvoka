import "dotenv/config";
import { calculateLearningVelocity } from "./src/lib/metrics";
import { prisma } from "./src/lib/prisma";

async function testVelocity() {
    const userId = "cmlahrz2w0000h09aeigaxeuj";
    const sessionId = "cmlai4zbi0008zo9a26slzu";

    console.log("Testing Velocity Calculation...\n");
    console.log("UserID:", userId);
    console.log("SessionID:", sessionId);

    try {
        const result = await calculateLearningVelocity(userId, sessionId);
        console.log("\n✅ Success!");
        console.log(JSON.stringify(result, null, 2));
    } catch (error: any) {
        console.error("\n❌ Error:", error.message);
        console.error("Stack:", error.stack);
    } finally {
        await prisma.$disconnect();
    }
}

testVelocity();
