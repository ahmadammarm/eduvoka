// Diagnostic Test - Check what's causing truncation
async function diagnosticTest() {
    console.log("🔍 DIAGNOSING TRUNCATION ISSUE\n");

    const response = await fetch("http://localhost:3000/api/learning/deep-inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            message: "I don't know the answer, maybe B?",
            context: { soalLatihanId: "latihan-pu-001" },
            history: []
        })
    });

    const fullResponse = await response.text();
    console.log("RAW RESPONSE:");
    console.log(fullResponse);
    console.log("\n---\n");

    const data = JSON.parse(fullResponse);
    console.log("PARSED:");
    console.log(JSON.stringify(data, null, 2));
    console.log("\nReply text:");
    console.log(data.reply);
    console.log("\nLength:", data.reply?.length);
    console.log("Last char:", data.reply?.charAt(data.reply.length - 1));
    console.log("Last 10 chars:", data.reply?.slice(-10));
}

diagnosticTest().catch(console.error);
