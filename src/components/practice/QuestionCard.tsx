'use client';

import { CheckCircle2, XCircle } from 'lucide-react';

interface QuestionCardProps {
    content: string;
    choices: Array<{
        label: string;
        pilihan: string;
    }>;
    selectedOption: string | null;
    onSelectOption: (label: string) => void;
    showFeedback: boolean;
    correctAnswer?: string;
    socraticMode: boolean;
}

export default function QuestionCard({
    content,
    choices,
    selectedOption,
    onSelectOption,
    showFeedback,
    correctAnswer,
    socraticMode
}: QuestionCardProps) {
    return (
        <div className="bg-white rounded-lg shadow-lg p-6">
            {/* Question Content */}
            <div className="mb-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Question</h2>
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{content}</p>
            </div>

            {/* Answer Choices */}
            <div className="space-y-3">
                <h3 className="text-sm font-semibold text-gray-700 mb-3">Select your answer:</h3>
                {choices.map((choice) => {
                    const isSelected = selectedOption === choice.label;
                    const isCorrect = showFeedback && choice.label === correctAnswer;
                    const isWrong = showFeedback && isSelected && choice.label !== correctAnswer;

                    return (
                        <button
                            key={choice.label}
                            onClick={() => onSelectOption(choice.label)}
                            disabled={showFeedback}
                            className={`w-full text-left p-4 rounded-lg border-2 transition-all ${isSelected && !showFeedback
                                    ? 'border-indigo-500 bg-indigo-50'
                                    : isCorrect
                                        ? 'border-green-500 bg-green-50'
                                        : isWrong
                                            ? 'border-red-500 bg-red-50'
                                            : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                                } ${showFeedback ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                        >
                            <div className="flex items-start gap-3">
                                <span className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${isSelected && !showFeedback
                                        ? 'bg-indigo-600 text-white'
                                        : isCorrect
                                            ? 'bg-green-600 text-white'
                                            : isWrong
                                                ? 'bg-red-600 text-white'
                                                : 'bg-gray-200 text-gray-700'
                                    }`}>
                                    {choice.label}
                                </span>
                                <p className="flex-1 text-gray-800 pt-1">{choice.pilihan}</p>
                                {showFeedback && isCorrect && (
                                    <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-1" />
                                )}
                                {showFeedback && isWrong && (
                                    <XCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-1" />
                                )}
                            </div>
                        </button>
                    );
                })}
            </div>

            {/* Socratic Mode Indicator */}
            {socraticMode && selectedOption && !showFeedback && (
                <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <p className="text-sm text-yellow-800">
                        <span className="font-semibold">Socratic Mode:</span> Use the chat to discuss your reasoning before seeing the answer.
                    </p>
                </div>
            )}
        </div>
    );
}
