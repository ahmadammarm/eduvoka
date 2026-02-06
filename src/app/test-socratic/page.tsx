'use client';

import { useState } from 'react';
import { Send, Trash2, Bot, User as UserIcon, Lightbulb } from 'lucide-react';

interface Message {
    role: 'user' | 'ai';
    content: string;
}

export default function TestSocraticPage() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [showScenarios, setShowScenarios] = useState(true);

    // Hardcoded context for latihan-pu-001
    const questionContext = {
        soalLatihanId: 'latihan-pu-001',
        questionText: 'Semua mahasiswa adalah pelajar. Budi adalah mahasiswa. Kesimpulannya adalah...'
    };

    const testScenarios = [
        {
            name: 'Scenario 1: DTA Detection',
            message: "I don't know the answer, maybe B?",
            description: 'Tests if AI detects Direct Translation Approach and stays in PROBE phase'
        },
        {
            name: 'Scenario 2: MBA Validation',
            message: "Well, if all mahasiswa are pelajar, and Budi is mahasiswa, then Budi is pelajar.",
            description: 'Tests if AI validates reasoning and explains WHY the logic works'
        },
        {
            name: 'Scenario 3: Confirmation',
            message: "So Budi must be a pelajar because he's a mahasiswa!",
            description: 'Tests final confirmation and learning reinforcement'
        }
    ];

    const sendMessage = async (messageText?: string) => {
        const textToSend = messageText || input;
        if (!textToSend.trim()) return;

        setLoading(true);
        const userMsg: Message = { role: 'user', content: textToSend };
        setMessages(prev => [...prev, userMsg]);
        setInput('');

        try {
            const response = await fetch('/api/learning/deep-inquiry', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    message: textToSend,
                    context: { soalLatihanId: questionContext.soalLatihanId },
                    history: messages
                })
            });

            const data = await response.json();
            const aiMsg: Message = {
                role: 'ai',
                content: data.reply || data.error || 'No response received'
            };
            setMessages(prev => [...prev, aiMsg]);
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

    const clearChat = () => {
        setMessages([]);
        setInput('');
    };

    const useScenario = (scenarioMessage: string) => {
        sendMessage(scenarioMessage);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-4">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="bg-white rounded-t-lg shadow-lg p-6 border-b-2 border-indigo-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
                                <Bot className="w-8 h-8 text-indigo-600" />
                                Socratic AI Test Console
                            </h1>
                            <p className="text-gray-600 mt-2">Testing PAPE Phases & DTA/MBA Detection</p>
                        </div>
                        <button
                            onClick={clearChat}
                            className="flex items-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
                            disabled={messages.length === 0}
                        >
                            <Trash2 className="w-4 h-4" />
                            Clear Chat
                        </button>
                    </div>

                    {/* Question Context Display */}
                    <div className="mt-4 p-4 bg-indigo-50 rounded-lg border border-indigo-200">
                        <p className="text-sm font-semibold text-indigo-900 mb-1">Testing Question:</p>
                        <p className="text-gray-700 font-medium">{questionContext.questionText}</p>
                        <p className="text-xs text-gray-500 mt-1">ID: {questionContext.soalLatihanId} (PU - Syllogism)</p>
                    </div>
                </div>

                <div className="flex gap-4">
                    {/* Main Chat Area */}
                    <div className="flex-1 bg-white rounded-b-lg shadow-lg">
                        {/* Messages Display */}
                        <div className="h-[500px] overflow-y-auto p-6 space-y-4">
                            {messages.length === 0 ? (
                                <div className="flex flex-col items-center justify-center h-full text-gray-400">
                                    <Bot className="w-16 h-16 mb-4" />
                                    <p className="text-lg font-medium">No messages yet</p>
                                    <p className="text-sm">Start a conversation or use a test scenario</p>
                                </div>
                            ) : (
                                messages.map((msg, i) => (
                                    <div
                                        key={i}
                                        className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                                    >
                                        {msg.role === 'ai' && (
                                            <div className="flex-shrink-0">
                                                <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center">
                                                    <Bot className="w-5 h-5 text-indigo-600" />
                                                </div>
                                            </div>
                                        )}
                                        <div
                                            className={`max-w-[70%] rounded-lg p-4 ${msg.role === 'user'
                                                    ? 'bg-blue-600 text-white'
                                                    : 'bg-gray-100 text-gray-900 border border-gray-200'
                                                }`}
                                        >
                                            <div className="text-xs font-bold mb-2 opacity-70">
                                                {msg.role === 'user' ? 'YOU' : 'SOCRATIC AI'}
                                            </div>
                                            <div className="whitespace-pre-wrap break-words leading-relaxed">
                                                {msg.content}
                                            </div>
                                            <div className="text-xs mt-2 opacity-60">
                                                {msg.content.length} characters
                                            </div>
                                        </div>
                                        {msg.role === 'user' && (
                                            <div className="flex-shrink-0">
                                                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                                                    <UserIcon className="w-5 h-5 text-blue-600" />
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ))
                            )}
                            {loading && (
                                <div className="flex gap-3 justify-start">
                                    <div className="flex-shrink-0">
                                        <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center">
                                            <Bot className="w-5 h-5 text-indigo-600 animate-pulse" />
                                        </div>
                                    </div>
                                    <div className="bg-gray-100 rounded-lg p-4 border border-gray-200">
                                        <div className="flex gap-2 items-center">
                                            <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                                            <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                                            <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                                            <span className="text-sm text-gray-600 ml-2">AI is thinking...</span>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Input Area */}
                        <div className="border-t border-gray-200 p-4 bg-gray-50 rounded-b-lg">
                            <div className="flex gap-3">
                                <input
                                    type="text"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && !loading && sendMessage()}
                                    placeholder="Type your message..."
                                    className="flex-1 border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                    disabled={loading}
                                />
                                <button
                                    onClick={() => sendMessage()}
                                    disabled={loading || !input.trim()}
                                    className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                                >
                                    <Send className="w-4 h-4" />
                                    Send
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Scenarios Sidebar */}
                    <div className={`w-80 transition-all ${showScenarios ? 'block' : 'hidden'}`}>
                        <div className="bg-white rounded-lg shadow-lg p-6">
                            <div className="flex items-center gap-2 mb-4">
                                <Lightbulb className="w-5 h-5 text-yellow-500" />
                                <h3 className="text-lg font-bold text-gray-900">Test Scenarios</h3>
                            </div>

                            <div className="space-y-3">
                                {testScenarios.map((scenario, idx) => (
                                    <div key={idx} className="border border-gray-200 rounded-lg p-4 hover:border-indigo-300 transition-colors">
                                        <div className="flex items-start justify-between mb-2">
                                            <h4 className="font-semibold text-sm text-gray-900">{scenario.name}</h4>
                                            <span className="text-xs bg-indigo-100 text-indigo-700 px-2 py-1 rounded">
                                                {idx + 1}
                                            </span>
                                        </div>
                                        <p className="text-xs text-gray-600 mb-3">{scenario.description}</p>
                                        <div className="bg-gray-50 rounded p-2 mb-2">
                                            <p className="text-xs text-gray-700 italic">"{scenario.message}"</p>
                                        </div>
                                        <button
                                            onClick={() => useScenario(scenario.message)}
                                            disabled={loading}
                                            className="w-full text-xs bg-indigo-50 hover:bg-indigo-100 text-indigo-700 py-2 rounded font-medium transition-colors disabled:opacity-50"
                                        >
                                            Use This Scenario
                                        </button>
                                    </div>
                                ))}
                            </div>

                            {/* PAPE Phases Reference */}
                            <div className="mt-6 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                                <h4 className="text-sm font-bold text-yellow-900 mb-2">PAPE Phases</h4>
                                <ul className="text-xs text-yellow-800 space-y-1">
                                    <li>• <strong>PROBE</strong>: Question understanding</li>
                                    <li>• <strong>ANALYZE</strong>: Evaluate reasoning</li>
                                    <li>• <strong>PERSIST</strong>: Guide if stuck</li>
                                    <li>• <strong>EVALUATE</strong>: Confirm learning</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
