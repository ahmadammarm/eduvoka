import { NextResponse } from "next/server";
import { geminiModel } from "@/lib/gemini";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
    try {
        const { message, context, history } = await req.json();
        const { questionId, soalLatihanId } = context;

        // 1. Context Injection: Fetch Question Data
        let questionData = null;
        let pembahasanContent = "";

        // Handle both new LatihanSoal and legacy SoalUTBK if needed, 
        // assuming 'questionId' refers to 'SoalLatihanSoal' id or 'soalLatihanId'
        const targetId = soalLatihanId || questionId;

        if (targetId) {
            questionData = await prisma.soalLatihanSoal.findUnique({
                where: { id: targetId },
                include: {
                    pilihanJawaban: true,
                    pembahasan: true
                }
            });

            if (questionData && questionData.pembahasan.length > 0) {
                pembahasanContent = questionData.pembahasan[0].konten; // Use the first available discussion
            }
        }

        if (!questionData) {
            // Fallback or error if question not found
            // Proceed with minimal context
        }

        // 2. Kolb Adaptation Logic based on Category
        const category = questionData?.tipe || "GENERAL";
        let styleInstruction = "";

        switch (category) {
            case "PK": // Aljabar/Math
                styleInstruction = "Style: Logical, Step-by-step scaffolding. Focus on formulas and process.";
                break;
            case "PU": // Penalaran
            case "PBM":
                styleInstruction = "Style: Analytical. Focus on premise-conclusion links and text evidence.";
                break;
            case "LITERASIBINDO":
            case "LITERASIBINGG":
                styleInstruction = "Style: Contextual. Focus on word meaning and passage comprehension.";
                break;
            default:
                styleInstruction = "Style: Balanced Socratic questioning.";
        }

        // 3. System Prompt Construction
        const systemPrompt = `
      You are a Socratic Tutor for UTBK preparation.
      
      ### ⚠️ LANGUAGE RULE (CRITICAL)
      - **Detect the PRIMARY language of the student's message.**
      - **Ignore Indonesian words that are part of the question context** (e.g., "mahasiswa", "pelajar" are from the question, not the student's language choice).
      - **If the student speaks primarily in ENGLISH, respond in ENGLISH.**
      - **If the student speaks primarily in BAHASA INDONESIA, respond in BAHASA INDONESIA.**
      - **Be consistent**: Once you choose a language for a turn, use it for the entire response.
      
      Examples:
      - Student: "I don't know the answer, maybe B?" → PRIMARY LANGUAGE: English → Respond in English
      - Student: "Well, if all mahasiswa are pelajar..." → PRIMARY LANGUAGE: English (mahasiswa/pelajar are just question terms) → Respond in English
      - Student: "Saya tidak mengerti soal ini" → PRIMARY LANGUAGE: Indonesian → Respond in Indonesian
      - Student: "Jadi Budi adalah pelajar karena dia mahasiswa" → PRIMARY LANGUAGE: Indonesian → Respond in Indonesian
      
      ### OBJECTIVE
      Guide the student to the correct answer for the current question WITHOUT revealing it immediately.
      
      ### CONTEXT
      Question: ${questionData?.content || "Unknown"}
      Correct Answer Key: ${questionData?.kunciJawaban || "Unknown"}
      Discussion/Hint Bank: ${pembahasanContent}
      
      ### BEHAVIORAL TRIGGERS
      - **DTA (Direct Translation Approach)**: If the user's message is short (under 5 words), just a formula, or asks "What is the answer?", **STAY IN PROBE PHASE**. Do not explain yet. Ask them to define terms or show their start.
      - **MBA (Meaning-Based Approach)**: If user explains reasoning, move to **ANALYZE**.
      
      ### HINT BANK USAGE
      - Use the 'Discussion/Hint Bank' content to form your clues.
      - **NEVER** output the full discussion block directly.
      - Reveal hints progressively only if the user is stuck (PERSIST phase).
      
      ### ADAPTATION
      - ${styleInstruction}
      
      ### RULES
      - Max 3 sentences.
      - Always end with a question.
      - Phase sequence: PROBE -> ANALYZE -> PERSIST -> EVALUATE.
      - **Match the student's primary language** (see LANGUAGE RULE above).
    `;

        let chatHistory = history ? history.map((h: any) => ({
            role: h.role === "ai" ? "model" : "user",
            parts: [{ text: h.content }]
        })) : [];

        // Gemini requires first message to be from 'user'
        // If history starts with 'model' (AI greeting), prepend a synthetic user message
        if (chatHistory.length > 0 && chatHistory[0].role === "model") {
            chatHistory = [
                { role: "user", parts: [{ text: "Hi, I need help understanding this question." }] },
                ...chatHistory
            ];
        }

        // Special handling for __INIT__ to get AI's first greeting
        if (message === "__INIT__") {
            const chat = geminiModel.startChat({
                history: [],
                generationConfig: {
                    maxOutputTokens: 60000,
                    temperature: 0.6,
                }
            });

            // Send user message first (required by Gemini), prompting AI to greet
            const initPrompt = `${systemPrompt}\n\nStudent Message: Hi, I got this question wrong. Can you help me understand it?`;

            const initResult = await chat.sendMessage(initPrompt);
            let aiGreeting = "";

            try {
                aiGreeting = initResult.response.text();
            } catch (error) {
                if (initResult.response.candidates && initResult.response.candidates.length > 0) {
                    const candidate = initResult.response.candidates[0];
                    if (candidate.content && candidate.content.parts) {
                        aiGreeting = candidate.content.parts.map((part: any) => part.text).join('');
                    }
                }
            }

            return NextResponse.json({
                reply: aiGreeting || "Halo! Saya lihat kamu salah menjawab soal ini. Coba jelaskan ke saya, kenapa kamu memilih jawaban tersebut?"
            });
        }

        // Normal conversation flow
        const chat = geminiModel.startChat({
            history: chatHistory,
            generationConfig: {
                maxOutputTokens: 60000,
                temperature: 0.6,
            }
        });

        const finalPrompt = `${systemPrompt}\n\nStudent Message: ${message}`;

        const result = await chat.sendMessage(finalPrompt);

        // Robust response extraction with detailed logging
        console.log("=== GEMINI API RESPONSE DEBUG ===");
        console.log("Response object keys:", Object.keys(result.response));
        console.log("Candidates:", result.response.candidates?.length);

        // Extract text properly handling potential truncation
        let response = "";

        try {
            // Method 1: Standard text() method
            response = result.response.text();
            console.log("Text extracted via .text():", response.length, "chars");
        } catch (error) {
            console.error("Error extracting via .text():", error);

            // Method 2: Manual extraction from candidates
            if (result.response.candidates && result.response.candidates.length > 0) {
                const candidate = result.response.candidates[0];
                if (candidate.content && candidate.content.parts) {
                    response = candidate.content.parts.map((part: any) => part.text).join('');
                    console.log("Text extracted manually from candidates:", response.length, "chars");
                }
            }
        }

        // Check for safety filters or finish reasons
        if (result.response.candidates && result.response.candidates[0]) {
            const candidate = result.response.candidates[0];
            console.log("Finish reason:", candidate.finishReason);
            console.log("Safety ratings:", candidate.safetyRatings);
        }

        // Log the final response
        console.log("Final response length:", response.length);
        console.log("Final response:", response);
        console.log("=== END DEBUG ===");

        // Sentence Completion Check
        const endsWithPunctuation = /[.!?]$/.test(response.trim());
        if (!endsWithPunctuation && response.length > 0) {
            console.warn("⚠️ Response may be truncated - does not end with punctuation");
            console.warn("Last 50 chars:", response.slice(-50));
        }

        return NextResponse.json({ reply: response });

    } catch (error) {
        console.error("Socratic API Error:", error);
        return NextResponse.json({ error: "Failed to generate response" }, { status: 500 });
    }
}
