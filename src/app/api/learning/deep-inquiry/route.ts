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

        // Calculate Turn Count (approximate)
        const turnCount = history ? Math.ceil(history.length / 2) : 0;
        const MAX_TURNS = 4; // Strict 4-turn limit (4 round trips)
        const isDeepConversation = turnCount >= MAX_TURNS;

        // 3. System Prompt Construction
        const systemPrompt = `
      You are a Socratic Tutor for UTBK preparation.
      
      ### ⚠️ LANGUAGE RULE (CRITICAL)
      - **ALWAYS respond in ENGLISH. This is mandatory.**
      - **Do NOT use any Indonesian words, phrases, or sentences.**
      - **Even if the student writes in Indonesian, you MUST respond in English.**
      - If the student seems confused by English, keep responses simple but stay in English.
      
      ### OBJECTIVE
      Guide the student to the correct answer for the current question WITHOUT revealing it immediately.
      
      ### CONTEXT
      Question: ${questionData?.content || "Unknown"}
      Correct Answer Key: ${questionData?.kunciJawaban || "Unknown"}
      Discussion/Hint Bank: ${pembahasanContent}
      
      ### CURRENT STATUS
      Turn Count: ${turnCount} / ${MAX_TURNS}
      
      ### BEHAVIORAL TRIGGERS
      - **DTA (Direct Translation Approach)**: If the user's message is short (under 5 words), just a formula, or asks "What is the answer?", **STAY IN PROBE PHASE**. Do not explain yet. Ask them to define terms or show their start.
      - **MBA (Meaning-Based Approach)**: If user explains reasoning, move to **ANALYZE**.
      
      ### HINT BANK USAGE
      - Use the 'Discussion/Hint Bank' content to form your clues.
      - **NEVER** output the full discussion block directly.
      - Reveal hints progressively only if the user is stuck (PERSIST phase).
      
      ### COMPLETION PROTOCOL (CRITICAL)
      - **WHEN TO FINISH**: 
        1. If the student has successfully identified the correct answer AND understood the reasoning.
        2. OR if you have reached turn ${MAX_TURNS} (STRICT LIMIT).
      - **HOW TO FINISH**: 
        - Provide a final concluding sentence.
        - Append a specialized token with the mastery score (0-100).
        - Format: "[[COMPLETED|SCORE:85]]"
      - **SCORING CRITERIA**:
        - 90-100: Flawless reasoning, minimal help needed.
        - 75-89: Good understanding, needed some hints.
        - 60-74: Struggled but eventually understood.
        - <60: Did not understand or reached limit without solving.
      
      ### DEPTH CONTROL
      - You are currently at turn ${turnCount}.
      - **IF TURN COUNT IS ${MAX_TURNS}**: You MUST wrap up immediately. Briefly explain the correct answer if they haven't found it, assign the score, and end with the token.
      
      ### ADAPTATION
      - ${styleInstruction}
      
      ### CONCEPT MAP (CRITICAL FOR VISUALIZATION)
      - At the END of your response, append a JSON block for concept tracking.
      - Format: [[CONCEPTS:{"main":"Main Topic","current":"Current Concept","explored":["Concept1","Concept2"],"upcoming":["Next1"]}]]
      - "main" = The overarching topic of the question
      - "current" = The specific concept you are currently probing
      - "explored" = Concepts the student has shown understanding of
      - "upcoming" = Concepts you plan to explore next
      - This helps visualize the learning path for the student.
      
      ### RULES
      - Max 3 sentences.
      - Always end with a question (unless completing).
      - Phase sequence: PROBE -> ANALYZE -> PERSIST -> EVALUATE.
      - **ALWAYS respond in ENGLISH. No exceptions.**
      - **Always include [[CONCEPTS:...]] at the end of your response**.
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
                reply: aiGreeting || "Hello! I see you got this question wrong. Can you explain to me why you chose that answer?"
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

        // Check for completion token and score
        let isCompleted = false;
        let score = 0;

        // Regex to find [[COMPLETED|SCORE:85]] or just [[COMPLETED]]
        const completionRegex = /\[\[COMPLETED(?:\|SCORE:(\d+))?\]\]/;
        const match = response.match(completionRegex);

        if (match) {
            isCompleted = true;
            if (match[1]) {
                score = parseInt(match[1], 10);
            }
            response = response.replace(completionRegex, "").trim();
            console.log(`✅ Completion token detected. Score: ${score}`);
        }

        // Parse Concept Map data
        let conceptMap = null;
        const conceptRegex = /\[\[CONCEPTS:(.*?)\]\]/;
        const conceptMatch = response.match(conceptRegex);

        if (conceptMatch && conceptMatch[1]) {
            try {
                conceptMap = JSON.parse(conceptMatch[1]);
                response = response.replace(conceptRegex, "").trim();
                console.log(`🗺️ Concept map extracted:`, conceptMap);
            } catch (parseError) {
                console.warn("Failed to parse concept map JSON:", parseError);
            }
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

        return NextResponse.json({
            reply: response,
            isCompleted: isCompleted,
            score: score,
            conceptMap: conceptMap
        });

    } catch (error) {
        console.error("Socratic API Error:", error);
        return NextResponse.json({ error: "Failed to generate response" }, { status: 500 });
    }
}
