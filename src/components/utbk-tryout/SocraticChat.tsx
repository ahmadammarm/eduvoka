"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Bot, User as UserIcon, Loader2 } from "lucide-react";

interface Message {
    id: string;
    role: "user" | "ai";
    content: string;
}

interface SocraticChatProps {
    contextData: any; // Passed from parent (question context)
}

export default function SocraticChat({ contextData }: SocraticChatProps) {
    const [messages, setMessages] = useState<Message[]>([
        {
            id: "intro",
            role: "ai",
            content: "Hi! I'm your Socratic Tutor. I won't give you the answer, but I'll help you find it. What are you thinking about this question?"
        }
    ]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const handleSend = async () => {
        if (!input.trim()) return;

        const userMsg: Message = { id: Date.now().toString(), role: "user", content: input };
        setMessages(prev => [...prev, userMsg]);
        setInput("");
        setLoading(true);

        try {
            const res = await fetch("/api/learning/deep-inquiry", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    message: userMsg.content,
                    context: contextData,
                    history: messages
                })
            });
            const data = await res.json();

            const aiMsg: Message = {
                id: (Date.now() + 1).toString(),
                role: "ai",
                content: data.reply || "I'm having trouble thinking right now. Try again?"
            };
            setMessages(prev => [...prev, aiMsg]);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col h-[500px] border rounded-lg bg-white shadow-sm">
            <div className="p-4 border-b bg-slate-50">
                <h3 className="font-semibold flex items-center gap-2">
                    <Bot className="w-5 h-5 text-blue-600" />
                    Socratic Tutor
                </h3>
                <p className="text-xs text-slate-500">Powered by Gemini • PAPE Framework</p>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4" ref={scrollRef}>
                {messages.map((m) => (
                    <div
                        key={m.id}
                        className={`flex gap-3 ${m.role === "user" ? "flex-row-reverse" : ""}`}
                    >
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${m.role === "ai" ? "bg-blue-100 text-blue-600" : "bg-slate-200 text-slate-600"
                            }`}>
                            {m.role === "ai" ? <Bot size={16} /> : <UserIcon size={16} />}
                        </div>
                        <div className={`max-w-[80%] p-3 rounded-lg text-sm ${m.role === "ai"
                                ? "bg-blue-50 text-slate-800 rounded-tl-none"
                                : "bg-slate-800 text-white rounded-tr-none"
                            }`}>
                            {m.content}
                        </div>
                    </div>
                ))}
                {loading && (
                    <div className="flex gap-3">
                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                            <Loader2 size={16} className="animate-spin" />
                        </div>
                        <div className="bg-slate-50 p-3 rounded-lg text-sm text-slate-400">
                            Thinking...
                        </div>
                    </div>
                )}
            </div>

            <div className="p-4 border-t flex gap-2">
                <input
                    className="flex-1 border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Type your reasoning..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSend()}
                    disabled={loading}
                />
                <button
                    onClick={handleSend}
                    disabled={loading || !input.trim()}
                    className="bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700 disabled:opacity-50 transition-colors"
                >
                    <Send size={18} />
                </button>
            </div>
        </div>
    );
}
