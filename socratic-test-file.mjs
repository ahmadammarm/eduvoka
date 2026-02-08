// Socratic AI Logic Stress Test - Save to File
import { writeFileSync } from 'fs';

async function stressTest() {
    const baseUrl = "http://localhost:3000/api/learning/deep-inquiry";
    let output = "";

    output += "🧪 SOCRATIC AI LOGIC STRESS TEST\n";
    output += "Question: latihan-pu-001 (Syllogism: Mahasiswa/Pelajar)\n";
    output += "=".repeat(80) + "\n\n";

    // TURN 1
    output += "📍 TURN 1: DTA Detection Test\n";
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
    output += "AI Response:\n";
    output += JSON.stringify(turn1Data, null, 2) + "\n\n";

    // TURN 2
    output += "📍 TURN 2: Reasoning Attempt\n";
    output += "User: 'Well, if all mahasiswa are pelajar, and Budi is mahasiswa, then maybe Budi is also pelajar?'\n";
    output += "-".repeat(80) + "\n";

    const turn2 = await fetch(baseUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            message: "Well, if all mahasiswa are pelajar, and Budi is mahasiswa, then maybe Budi is also pelajar?",
            context: { soalLatihanId: "latihan-pu-001" },
            history: [
                { role: "user", content: "I don't know the answer, maybe B?" },
                { role: "ai", content: turn1Data.reply || "" }
            ]
        })
    });

    const turn2Data = await turn2.json();
    output += "AI Response:\n";
    output += JSON.stringify(turn2Data, null, 2) + "\n\n";

    // TURN 3
    output += "📍 TURN 3: Conclusion\n";
    output += "User: 'So Budi must be a pelajar because he's a mahasiswa!'\n";
    output += "-".repeat(80) + "\n";

    const turn3 = await fetch(baseUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            message: "So Budi must be a pelajar because he's a mahasiswa!",
            context: { soalLatihanId: "latihan-pu-001" },
            history: [
                { role: "user", content: "I don't know the answer, maybe B?" },
                { role: "ai", content: turn1Data.reply || "" },
                { role: "user", content: "Well, if all mahasiswa are pelajar, and Budi is mahasiswa, then maybe Budi is also pelajar?" },
                { role: "ai", content: turn2Data.reply || "" }
            ]
        })
    });

    const turn3Data = await turn3.json();
    output += "AI Response:\n";
    output += JSON.stringify(turn3Data, null, 2) + "\n\n";

    output += "=".repeat(80) + "\n";
    output += "🎯 ANALYSIS CHECKLIST:\n";
    output += "  [ ] Turn 1: Did AI detect DTA and refuse direct answer?\n";
    output += "  [ ] Turn 1: Did AI use PROBE phase questioning?\n";
    output += "  [ ] Turn 1: Did AI use Diverger style (analogies)?\n";
    output += "  [ ] Turn 1: Was AI specific to Mahasiswa/Pelajar relationship?\n";
    output += "  [ ] Turn 2-3: Did AI maintain Socratic approach?\n";
    output += "  [ ] Turn 2-3: Did AI guide without giving direct answer?\n";

    writeFileSync("socratic-test-results.txt", output);
    console.log("✅ Test complete! Results saved to socratic-test-results.txt");
    console.log("\n" + output);
}

stressTest().catch(console.error);
