// Test script to verify Gemini model compatibility
import { GoogleGenerativeAI } from "@google/generative-ai";
import "dotenv/config";

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
    console.error("❌ GEMINI_API_KEY not found in .env");
    process.exit(1);
}

const genAI = new GoogleGenerativeAI(apiKey);

async function testModels() {
    const modelsToTest = [
        "gemini-pro",
        "gemini-1.5-pro",
        "gemini-1.5-flash",
        "gemini-1.5-flash-latest",
        "gemini-2.0-flash-exp",
        "gemini-3-flash-preview"  // User's current choice
    ];

    console.log("🧪 Testing Gemini Models\n");
    console.log("=".repeat(60));

    for (const modelName of modelsToTest) {
        console.log(`\nTesting: ${modelName}`);
        console.log("-".repeat(60));

        try {
            const model = genAI.getGenerativeModel({
                model: modelName,
                generationConfig: {
                    maxOutputTokens: 400,
                    temperature: 0.7
                }
            });

            const result = await model.generateContent({
                contents: [{
                    role: "user",
                    parts: [{ text: "Say hello and tell me your model name in one sentence." }]
                }]
            });

            const response = result.response.text();
            console.log(`✅ SUCCESS`);
            console.log(`Response (${response.length} chars):`, response);
            console.log(`Finish Reason:`, result.response.candidates?.[0]?.finishReason);

        } catch (error: any) {
            console.log(`❌ FAILED`);
            console.log(`Error:`, error.message);
        }
    }

    console.log("\n" + "=".repeat(60));
    console.log("✅ Test Complete");
}

testModels().catch(console.error);
