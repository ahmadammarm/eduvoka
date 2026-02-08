'use client';

import { useState, useEffect, useRef } from 'react';
import { Send, Bot, User as UserIcon, Lightbulb, Loader2 } from 'lucide-react';

interface Message {
    role: 'user' | 'ai';
    content: string;
}

interface SocraticChatProps {
    questionId: string;
    questionContent: string;
    selectedOption?: string;
    onPhaseChange?: (phase: 'PROBE' | 'ANALYZE' | 'PERSIST' | 'EVALUATE') => void;
    onMessageSent?: () => void; // Callback when user sends first message
    onFrustrationDetected?: () => void; // Callback when frustration is detected
}

export default function SocraticChat({
    questionId,
    questionContent,
    selectedOption,
    onPhaseChange,
    onMessageSent,
    onFrustrationDetected
}: SocraticChatProps) {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [currentPhase, setCurrentPhase] = useState<string>('PROBE');
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    // Auto-send AI's first question when component mounts
    useEffect(() => {
        const sendInitialQuestion = async () => {
            if (messages.length > 0) return; // Already initialized

            setLoading(true);
            try {
                const response = await fetch('/api/learning/deep-inquiry', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        message: '__INIT__', // Special flag for initial greeting
                        context: {
                            soalLatihanId: questionId,
                            selectedOption: selectedOption || null,
                            questionContent
                        },
                        history: []
                    })
                });

                const data = await response.json();
                const aiGreeting: Message = {
                    role: 'ai',
                    content: data.reply || data.error || 'Halo! Mari kita bahas soal ini bersama-sama.'
                };
                setMessages([aiGreeting]);
            } catch (error) {
                console.error('Error sending initial question:', error);
                // Fallback greeting if API fails
                const fallbackGreeting: Message = {
                    role: 'ai',
                    content: 'Halo! Saya lihat kamu salah menjawab soal ini. Coba jelaskan ke saya, kenapa kamu memilih jawaban tersebut?'
                };
                setMessages([fallbackGreeting]);
            } finally {
                setLoading(false);
            }
        };

        sendInitialQuestion();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [questionId]); // Re-run when question changes

    const sendMessage = async (messageText?: string) => {
        const textToSend = messageText || input;
        if (!textToSend.trim()) return;

        // Detect frustration keywords
        const frustrationKeywords = [
            'gak ngerti', 'ga ngerti', 'tidak mengerti', 'bingung', 'susah banget',
            'ribet', 'males', 'capek', 'pusing', 'sudahlah', 'gak paham', 'ga paham',
            'skip aja', 'lewat aja', 'lanjut aja', 'udah deh', 'udah ah', 'cukup',
            'stop', 'enough', 'confused', 'too hard', 'give up', 'giveup'
        ];
        const lowerText = textToSend.toLowerCase();
        const isFrustrated = frustrationKeywords.some(keyword => lowerText.includes(keyword));

        setLoading(true);
        const userMsg: Message = { role: 'user', content: textToSend };
        setMessages(prev => [...prev, userMsg]);
        setInput('');

        // Trigger onMessageSent callback on first user message
        if (messages.length === 1 && onMessageSent) {
            onMessageSent();
        }

        try {
            const response = await fetch('/api/learning/deep-inquiry', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    message: textToSend,
                    context: {
                        soalLatihanId: questionId,
                        selectedOption: selectedOption || null
                    },
                    history: messages
                })
            });

            const data = await response.json();
            const aiMsg: Message = {
                role: 'ai',
                content: data.reply || data.error || 'No response received'
            };
            setMessages(prev => [...prev, aiMsg]);

            // Simple phase detection based on message count
            if (messages.length < 2) setCurrentPhase('PROBE');
            else if (messages.length < 4) setCurrentPhase('ANALYZE');
            else if (messages.length < 6) setCurrentPhase('PERSIST');
            else setCurrentPhase('EVALUATE');

            // Trigger frustration callback if detected
            if (isFrustrated && onFrustrationDetected) {
                onFrustrationDetected();
            }

        } catch (error) {
            console.error('Error:', error);
            const errorMsg: Message = {
                role: 'ai',
                content: 'Error: Failed to get response from AI'
            };
            setMessages(prev => [...prev, errorMsg]);
        } finally {
            setLoading(false);
        }
    };

    const requestHint = () => {
        sendMessage("I need a hint to get started with this problem.");
    };

    return (
        <div className="flex flex-col h-full bg-white rounded-lg shadow-lg">
            {/* Header */}
            <div className="border-b border-gray-200 p-4 bg-gradient-to-r from-indigo-50 to-purple-50">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Bot className="w-5 h-5 text-indigo-600" />
                        <h3 className="font-bold text-gray-900">Socratic Tutor</h3>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-xs bg-indigo-100 text-indigo-700 px-2 py-1 rounded-full">
                            {currentPhase}
                        </span>
                    </div>
                </div>
                <p className="text-xs text-gray-600 mt-1">
                    Ask questions to understand the problem better
                </p>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {messages.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-gray-400">
                        <Lightbulb className="w-12 h-12 mb-3" />
                        <p className="text-sm font-medium">Need help understanding this question?</p>
                        <p className="text-xs">Ask me anything or request a hint!</p>
                    </div>
                ) : (
                    messages.map((msg, i) => (
                        <div
                            key={i}
                            className={`flex gap-2 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                            {msg.role === 'ai' && (
                                <div className="flex-shrink-0 mt-1">
                                    <div className="w-7 h-7 rounded-full bg-indigo-100 flex items-center justify-center">
                                        <Bot className="w-4 h-4 text-indigo-600" />
                                    </div>
                                </div>
                            )}
                            <div
                                className={`max-w-[75%] rounded-lg p-3 ${msg.role === 'user'
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-gray-100 text-gray-900'
                                    }`}
                            >
                                <p className="text-sm whitespace-pre-wrap leading-relaxed">{msg.content}</p>
                            </div>
                            {msg.role === 'user' && (
                                <div className="flex-shrink-0 mt-1">
                                    <div className="w-7 h-7 rounded-full bg-blue-100 flex items-center justify-center">
                                        <UserIcon className="w-4 h-4 text-blue-600" />
                                    </div>
                                </div>
                            )}
                        </div>
                    ))
                )}
                {loading && (
                    <div className="flex gap-2 justify-start">
                        <div className="flex-shrink-0 mt-1">
                            <div className="w-7 h-7 rounded-full bg-indigo-100 flex items-center justify-center">
                                <Bot className="w-4 h-4 text-indigo-600 animate-pulse" />
                            </div>
                        </div>
                        <div className="bg-gray-100 rounded-lg p-3">
                            <div className="flex gap-1 items-center">
                                <Loader2 className="w-4 h-4 animate-spin text-indigo-600" />
                                <span className="text-xs text-gray-600 ml-2">Thinking...</span>
                            </div>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="border-t border-gray-200 p-3 bg-gray-50">
                {messages.length === 0 && (
                    <button
                        onClick={requestHint}
                        disabled={loading}
                        className="w-full mb-2 text-sm bg-yellow-50 hover:bg-yellow-100 text-yellow-700 py-2 rounded font-medium transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                        <Lightbulb className="w-4 h-4" />
                        Request a Hint
                    </button>
                )}
                <div className="flex gap-2">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && !loading && sendMessage()}
                        placeholder="Ask a question..."
                        className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        disabled={loading}
                    />
                    <button
                        onClick={() => sendMessage()}
                        disabled={loading || !input.trim()}
                        className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                        <Send className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </div>
    );
}
