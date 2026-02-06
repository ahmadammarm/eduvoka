'use client';

import { CheckCircle2, XCircle, AlertCircle, Clock } from 'lucide-react';

interface QuestionReviewCardProps {
    question: {
        soalId: string;
        content: string;
        choices: Array<{ label: string; pilihan: string }>;
        userAnswer: string | null;
        userAnswerLabel: string | null;
        correctAnswer: string;
        isCorrect: boolean | null;
        isSkipped: boolean;
        timeSpent: number | null;
    };
    questionNumber: number;
    isUnderstood: boolean;
}

export default function QuestionReviewCard({
    question,
    questionNumber,
    isUnderstood
}: QuestionReviewCardProps) {
    const formatTime = (seconds: number | null) => {
        if (!seconds) return '--';
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <div className="bg-white rounded-lg shadow-lg p-6 h-full">
            {/* Header */}
            <div className="flex items-center justify-between mb-4 pb-4 border-b">
                <div>
                    <h3 className="text-lg font-bold text-gray-900">
                        Question #{questionNumber}
                    </h3>
                    {question.timeSpent !== null && (
                        <div className="flex items-center gap-1 text-sm text-gray-600 mt-1">
                            <Clock className="w-4 h-4" />
                            {formatTime(question.timeSpent)}
                        </div>
                    )}
                </div>
                {isUnderstood ? (
                    <div className="flex items-center gap-2 bg-green-50 text-green-700 px-3 py-1.5 rounded-full">
                        <CheckCircle2 className="w-4 h-4" />
                        <span className="text-sm font-medium">Understood</span>
                    </div>
                ) : question.isSkipped ? (
                    <div className="flex items-center gap-2 bg-yellow-50 text-yellow-700 px-3 py-1.5 rounded-full">
                        <AlertCircle className="w-4 h-4" />
                        <span className="text-sm font-medium">Skipped</span>
                    </div>
                ) : question.isCorrect ? (
                    <div className="flex items-center gap-2 bg-green-50 text-green-700 px-3 py-1.5 rounded-full">
                        <CheckCircle2 className="w-4 h-4" />
                        <span className="text-sm font-medium">Correct</span>
                    </div>
                ) : (
                    <div className="flex items-center gap-2 bg-red-50 text-red-700 px-3 py-1.5 rounded-full">
                        <XCircle className="w-4 h-4" />
                        <span className="text-sm font-medium">Incorrect</span>
                    </div>
                )}
            </div>

            {/* Question Content */}
            <div className="mb-6">
                <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">
                    {question.content}
                </p>
            </div>

            {/* Answer Choices */}
            <div className="space-y-3">
                <h4 className="text-sm font-semibold text-gray-700 mb-3">Answer Choices:</h4>
                {question.choices.map((choice) => {
                    const isUserAnswer = choice.label === question.userAnswerLabel;
                    const isCorrectAnswer = choice.label === question.correctAnswer;
                    const isWrong = isUserAnswer && !isCorrectAnswer;

                    return (
                        <div
                            key={choice.label}
                            className={`p-4 rounded-lg border-2 transition-all ${isCorrectAnswer
                                    ? 'border-green-500 bg-green-50'
                                    : isWrong
                                        ? 'border-red-500 bg-red-50'
                                        : 'border-gray-200 bg-gray-50'
                                }`}
                        >
                            <div className="flex items-start gap-3">
                                <span
                                    className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${isCorrectAnswer
                                            ? 'bg-green-600 text-white'
                                            : isWrong
                                                ? 'bg-red-600 text-white'
                                                : 'bg-gray-300 text-gray-700'
                                        }`}
                                >
                                    {choice.label}
                                </span>
                                <div className="flex-1">
                                    <p className="text-gray-800">{choice.pilihan}</p>
                                    <div className="flex items-center gap-3 mt-2">
                                        {isUserAnswer && (
                                            <span className="text-xs font-medium text-blue-700 bg-blue-100 px-2 py-1 rounded">
                                                Your Answer
                                            </span>
                                        )}
                                        {isCorrectAnswer && (
                                            <span className="text-xs font-medium text-green-700 bg-green-100 px-2 py-1 rounded">
                                                ✓ Correct Answer
                                            </span>
                                        )}
                                    </div>
                                </div>
                                {isCorrectAnswer && <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />}
                                {isWrong && <XCircle className="w-5 h-5 text-red-600 flex-shrink-0" />}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Status Message */}
            {!question.isSkipped && (
                <div className={`mt-6 p-4 rounded-lg ${question.isCorrect
                        ? 'bg-green-50 border border-green-200'
                        : 'bg-red-50 border border-red-200'
                    }`}>
                    <p className={`text-sm ${question.isCorrect ? 'text-green-800' : 'text-red-800'
                        }`}>
                        {question.isCorrect
                            ? '✅ You got this right! Use the chat to verify your understanding.'
                            : '❌ Let\'s discuss why this answer was incorrect using the Socratic method.'}
                    </p>
                </div>
            )}
        </div>
    );
}
