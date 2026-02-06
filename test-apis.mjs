// Test script for API endpoints
async function testVelocityAPI() {
    console.log("🧪 Testing Learning Velocity API...\n");

    const response = await fetch("http://localhost:3000/api/metrics/velocity", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            userId: "cmlahrz2w0000h09aeigaxeuj",
            sessionId: "cmlai4zbi0008zo9a26slzu"
        })
    });

    const data = await response.json();
    console.log("Status:", response.status);
    console.log("Response:", JSON.stringify(data, null, 2));
}

async function testSocraticAPI() {
    console.log("\n\n🧪 Testing Socratic AI API...\n");

    const response = await fetch("http://localhost:3000/api/learning/deep-inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            message: "Saya tidak mengerti soal ini, bisakah Anda membantu saya memahaminya?",
            context: {
                soalLatihanId: "latihan-litindo-001"
            },
            history: []
        })
    });

    const data = await response.json();
    console.log("Status:", response.status);
    console.log("Response:", JSON.stringify(data, null, 2));
}

async function main() {
    try {
        await testVelocityAPI();
        await testSocraticAPI();
    } catch (error) {
        console.error("❌ Error:", error);
    }
}

main();
