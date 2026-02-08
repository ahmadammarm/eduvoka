import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
    console.warn("⚠️ GEMINI_API_KEY is missing in .env file");
}

const genAI = new GoogleGenerativeAI(apiKey || "");

// Use a model optimized for chat/creative tasks
// "gemini-2.5-flash" provides good reasoning and supports high token outputs
export const geminiModel = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
