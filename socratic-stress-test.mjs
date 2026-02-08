// Socratic AI Logic Stress Test
// Testing 3-turn conversation with DTA detection and Kolb adaptation

async function stressTest() {
    const baseUrl = "http://localhost:3000/api/learning/deep-inquiry";

    console.log("🧪 SOCRATIC AI LOGIC STRESS TEST");
    console.log("Question: latihan-pu-001 (Syllogism about Mahasiswa/Pelajar)");
    console.log("=".repeat(80));

    // TURN 1: Student shows DTA (Direct Translation Approach)
    console.log("\n📍 TURN 1: Student gives short, formulaic response (DTA detected)");
    console.log("User Input: 'I don't know the answer, maybe B?'");
    console.log("-".repeat(80));

    const turn1Response = await fetch(baseUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            message: "I don't know the answer, maybe B?",
            context: { soalLatihanId: "latihan-pu-001" },
            history: []
        })
    });

    const turn1Data = await turn1Response.json();
    console.log("✅ AI Response (TURN 1):");
    console.log(JSON.stringify(turn1Data, null, 2));
    console.log("\n🔍 Expected Behavior:");
    console.log("  - Detect DTA (short, direct answer attempt)");
    console.log("  - Stay in PROBE phase");
    console.log("  - Ask about relationship between 'Mahasiswa' and 'Pelajar'");
    console.log("  - Use Diverger Kolb style (real-world analogy like 'All tigers are cats')");

    // TURN 2: Student provides reasoning
    console.log("\n\n📍 TURN 2: Student attempts to reason");
    console.log("User Input: 'Well, if all mahasiswa are pelajar, and Budi is mahasiswa...'");
    console.log("-".repeat(80));

    const turn2Response = await fetch(baseUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            message: "Well, if all mahasiswa are pelajar, and Budi is mahasiswa, then maybe Budi is also pelajar?",
            context: { soalLatihanId: "latihan-pu-001" },
            history: [
                { role: "user", content: "I don't know the answer, maybe B?" },
                { role: "ai", content: turn1Data.reply || turn1Data.response || "" }
            ]
        })
    });

    const turn2Data = await turn2Response.json();
    console.log("✅ AI Response (TURN 2):");
    console.log(JSON.stringify(turn2Data, null, 2));
    console.log("\n🔍 Expected Behavior:");
    console.log("  - Recognize improved reasoning");
    console.log("  - Guide student to connect premises to conclusion");
    console.log("  - Still not give direct answer");

    // TURN 3: Student arrives at conclusion
    console.log("\n\n📍 TURN 3: Student reaches conclusion");
    console.log("User Input: 'So Budi must be a pelajar because he's a mahasiswa!'");
    console.log("-".repeat(80));

    const turn3Response = await fetch(baseUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            message: "So Budi must be a pelajar because he's a mahasiswa!",
            context: { soalLatihanId: "latihan-pu-001" },
            history: [
                { role: "user", content: "I don't know the answer, maybe B?" },
                { role: "ai", content: turn1Data.reply || turn1Data.response || "" },
                { role: "user", content: "Well, if all mahasiswa are pelajar, and Budi is mahasiswa, then maybe Budi is also pelajar?" },
                { role: "ai", content: turn2Data.reply || turn2Data.response || "" }
            ]
        })
    });

    const turn3Data = await turn3Response.json();
    console.log("✅ AI Response (TURN 3):");
    console.log(JSON.stringify(turn3Data, null, 2));
    console.log("\n🔍 Expected Behavior:");
    console.log("  - Confirm student's reasoning");
    console.log("  - May reveal hint from pembahasan");
    console.log("  - Encourage understanding, not just answer");

    console.log("\n" + "=".repeat(80));
    console.log("🎯 TEST COMPLETE - Review responses for:");
    console.log("  ✓ DTA detection in Turn 1");
    console.log("  ✓ Socratic questioning (not direct answers)");
    console.log("  ✓ Diverger style with analogies");
    console.log("  ✓ Question-specific guidance (Mahasiswa/Pelajar relationship)");
}

stressTest().catch(console.error);
