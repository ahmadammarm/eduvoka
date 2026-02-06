// Final Socratic AI Test - Full Responses (No Truncation)
import { writeFileSync } from 'fs';

async function finalTest() {
    const baseUrl = "http://localhost:3000/api/learning/deep-inquiry";
    let output = "";

    output += "🎯 FINAL SOCRATIC AI TEST - FULL RESPONSES\n";
    output += "=".repeat(80) + "\n\n";

    // TURN 1: DTA Detection + Diverger Analogy
    output += "📍 TURN 1: DTA Detection with Diverger Style Analogy\n";
    output += "User: 'I don't know the answer, maybe B?'\n";
    output += "-".repeat(80) + "\n";

    const turn1 = await fetch(baseUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            message: "I don't know the answer, maybe B?",
            context: { soalLatihanId: "latihan-pu-001" },
            history: []
        })
    });

    const turn1Data = await turn1.json();
    output += "✅ FULL AI Response (TURN 1):\n";
    output += JSON.stringify(turn1Data, null, 2) + "\n";
    output += `\nResponse Length: ${turn1Data.reply?.length || 0} characters\n`;
    output += `Ends with punctuation: ${/[.!?]$/.test(turn1Data.reply || '') ? 'YES ✅' : 'NO ❌'}\n`;
    output += "\n🔍 Expectations:\n";
    output += "  ✓ Full tiger/cat (or similar) analogy\n";
    output += "  ✓ No truncation mid-sentence\n";
    output += "  ✓ Question about Mahasiswa/Pelajar relationship\n";

    // TURN 2: MBA Validation with Pembahasan Context
    output += "\n\n" + "=".repeat(80) + "\n";
    output += "📍 TURN 2: MBA Validation with Pembahasan-Guided Explanation\n";
    output += "User: 'Well, if all mahasiswa are pelajar, and Budi is mahasiswa, then Budi must be pelajar'\n";
    output += "-".repeat(80) + "\n";

    const turn2 = await fetch(baseUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            message: "Well, if all mahasiswa are pelajar, and Budi is mahasiswa, then Budi must be pelajar",
            context: { soalLatihanId: "latihan-pu-001" },
            history: [
                { role: "user", content: "I don't know the answer, maybe B?" },
                { role: "ai", content: turn1Data.reply || "" }
            ]
        })
    });

    const turn2Data = await turn2.json();
    output += "✅ FULL AI Response (TURN 2):\n";
    output += JSON.stringify(turn2Data, null, 2) + "\n";
    output += `\nResponse Length: ${turn2Data.reply?.length || 0} characters\n`;
    output += `Ends with punctuation: ${/[.!?]$/.test(turn2Data.reply || '') ? 'YES ✅' : 'NO ❌'}\n`;
    output += "\n🔍 Expectations:\n";
    output += "  ✓ Explicit explanation of WHY the logic works\n";
    output += "  ✓ Uses pembahasan context as guide\n";
    output += "  ✓ Doesn't reveal answers to other questions\n";
    output += "  ✓ Complete thought (no truncation)\n";

    output += "\n\n" + "=".repeat(80) + "\n";
    output += "✅ TEST COMPLETE\n";

    writeFileSync("final-socratic-results.txt", output);
    console.log(output);
}

finalTest().catch(console.error);
