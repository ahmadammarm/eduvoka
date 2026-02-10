'use client';

import { useState } from 'react';
import { MessageSquare, X, CheckCircle } from 'lucide-react';
import QuestionCard from '@/components/practice/QuestionCard';
import SocraticChat from '@/components/practice/SocraticChat';
import MetricsHeader from '@/components/practice/MetricsHeader';

interface Question {
    id: string;
    content: string;
    type: string;
    correctAnswer: string;
    choices: Array<{
        label: string;
        pilihan: string;
    }>;
}

interface PracticeClientProps {
    question: Question;
    topicName: string;
}

export default function PracticeClient({ question, topicName }: PracticeClientProps) {
    const [selectedOption, setSelectedOption] = useState<string | null>(null);
    const [showFeedback, setShowFeedback] = useState(false);
    const [socraticMode, setSocraticMode] = useState(true);
    const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
    const [currentPhase, setCurrentPhase] = useState<'PROBE' | 'ANALYZE' | 'PERSIST' | 'EVALUATE'>('PROBE');

    const handleSelectOption = (label: string) => {
        setSelectedOption(label);
        if (!socraticMode) {
            setShowFeedback(true);
        }
    };

    const handleRevealAnswer = () => {
        setShowFeedback(true);
    };

    const toggleSocraticMode = () => {
        setSocraticMode(!socraticMode);
        if (!socraticMode) {
            setShowFeedback(false);
        }
    };

    return (
        <>
            {/* Metrics Header */}
            <MetricsHeader topic={topicName} />

            {/* Mode Toggle */}
            <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <button
                        onClick={toggleSocraticMode}
                        className={`px-4 py-2 rounded-lg font-medium transition-colors ${socraticMode
                                ? 'bg-indigo-600 text-white'
                                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                            }`}
                    >
                        {socraticMode ? '🤖 Socratic Mode ON' : 'Socratic Mode OFF'}
                    </button>
                    {selectedOption && socraticMode && !showFeedback && (
                        <button
                            onClick={handleRevealAnswer}
                            className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors flex items-center gap-2"
                        >
                            <CheckCircle className="w-4 h-4" />
                            Reveal Answer
                        </button>
                    )}
                </div>

                {/* Mobile Chat Toggle */}
                <button
                    onClick={() => setMobileDrawerOpen(!mobileDrawerOpen)}
                    className="lg:hidden px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium flex items-center gap-2"
                >
                    <MessageSquare className="w-4 h-4" />
                    {mobileDrawerOpen ? 'Close Chat' : 'Open Chat'}
                </button>
            </div>

            {/* Main Content - Split View */}
            <div className="grid lg:grid-cols-2 gap-6">
                {/* Left Side - Question Card */}
                <div className={`${mobileDrawerOpen ? 'hidden lg:block' : 'block'}`}>
                    <QuestionCard
                        content={question.content}
                        choices={question.choices}
                        selectedOption={selectedOption}
                        onSelectOption={handleSelectOption}
                        showFeedback={showFeedback}
                        correctAnswer={question.correctAnswer}
                        socraticMode={socraticMode}
                    />
                </div>

                {/* Right Side - Socratic Chat (Desktop) or Drawer (Mobile) */}
                <div className={`${mobileDrawerOpen
                        ? 'fixed inset-0 z-50 bg-white lg:relative lg:bg-transparent'
                        : 'hidden lg:block'
                    }`}>
                    {/* Mobile Close Button */}
                    {mobileDrawerOpen && (
                        <div className="lg:hidden flex justify-between items-center p-4 border-b border-gray-200">
                            <h2 className="font-bold text-lg">Socratic Tutor</h2>
                            <button
                                onClick={() => setMobileDrawerOpen(false)}
                                className="p-2 hover:bg-gray-100 rounded-full"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                    )}

                    {/* Chat Component */}
                    <div className={mobileDrawerOpen ? 'h-[calc(100vh-4rem)]' : 'h-[600px]'}>
                        <SocraticChat
                            questionId={question.id}
                            questionContent={question.content}
                            selectedOption={selectedOption || undefined}
                            onPhaseChange={setCurrentPhase}
                        />
                    </div>
                </div>
            </div>

            {/* Help Text */}
            {socraticMode && !selectedOption && (
                <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-sm text-blue-800">
                        💡 <span className="font-semibold">Socratic Mode Active:</span> Select an answer and use the chat to discuss your reasoning before revealing the correct answer.
                    </p>
                </div>
            )}
        </>
    );
}
