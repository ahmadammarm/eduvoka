'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
    Play,
    SkipForward,
    CheckCircle2,
    XCircle,
    ChevronLeft,
    ChevronRight,
    MessageSquare,
    Lightbulb,
    TrendingUp,
    Award
} from 'lucide-react';
import QuestionReviewCard from '@/components/review/QuestionReviewCard';
import SocraticChat from '@/components/practice/SocraticChat';

interface ReviewQuestion {
    soalId: string;
    content: string;
    choices: Array<{ label: string; pilihan: string }>;
    userAnswer: string | null;
    userAnswerLabel: string | null;
    correctAnswer: string;
    isCorrect: boolean | null;
    isSkipped: boolean;
    timeSpent: number | null;
}

interface ReviewData {
    sessionId: string;
    materiId: string;
    score: number;
    totalQuestions: number;
    correctAnswers: number;
    wrongAnswers: number;
    questions: ReviewQuestion[];
}

interface ReviewClientProps {
    reviewData: ReviewData;
}

export default function ReviewClient({ reviewData }: ReviewClientProps) {
    const router = useRouter();
    const [reviewStarted, setReviewStarted] = useState(false);
    const [reviewAllQuestions, setReviewAllQuestions] = useState(false);
    const [currentReviewIndex, setCurrentReviewIndex] = useState(0);
    const [understoodQuestions, setUnderstoodQuestions] = useState<Set<string>>(new Set());
    const [currentPhase, setCurrentPhase] = useState<'PROBE' | 'ANALYZE' | 'PERSIST' | 'EVALUATE'>('PROBE');
    const [showSkipTooltip, setShowSkipTooltip] = useState(true);

    // Filter questions based on toggle
    const questionsToReview = reviewAllQuestions
        ? reviewData.questions
        : reviewData.questions.filter(q => !q.isCorrect);

    const currentQuestion = questionsToReview[currentReviewIndex];
    const isLastReviewQuestion = currentReviewIndex === questionsToReview.length - 1;
    const progress = ((currentReviewIndex + 1) / questionsToReview.length) * 100;

    useEffect(() => {
        // Track MBA boost when reaching EVALUATE phase
        if (currentPhase === 'EVALUATE' && currentQuestion) {
            // Mark question as having deep discussion
            // This will boost MBA score in behavioral analysis
            setUnderstoodQuestions(prev => new Set(prev).add(currentQuestion.soalId));
        }
    }, [currentPhase, currentQuestion]);

    const handleStartReview = () => {
        setReviewStarted(true);
    };

    const handleSkipToResults = () => {
        router.push(`/dashboard/latihan-soal/${reviewData.materiId}/result?sessionId=${reviewData.sessionId}`);
    };

    const handleMarkAsUnderstood = () => {
        if (currentQuestion) {
            setUnderstoodQuestions(prev => new Set(prev).add(currentQuestion.soalId));
        }
        handleNext();
    };

    const handleNext = () => {
        if (isLastReviewQuestion) {
            // Review completed, go to results
            router.push(`/dashboard/latihan-soal/${reviewData.materiId}/result?sessionId=${reviewData.sessionId}&mbaBoost=${understoodQuestions.size}`);
        } else {
            setCurrentReviewIndex(prev => prev + 1);
            setCurrentPhase('PROBE'); // Reset phase for next question
        }
    };

    const handlePrevious = () => {
        if (currentReviewIndex > 0) {
            setCurrentReviewIndex(prev => prev - 1);
            setCurrentPhase('PROBE');
        }
    };

    // Intro Screen (Not Started)
    if (!reviewStarted) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex items-center justify-center p-4">
                <div className="max-w-2xl w-full">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full mb-4 shadow-lg">
                            <MessageSquare className="w-10 h-10 text-white" />
                        </div>
                        <h1 className="text-4xl font-bold text-gray-900 mb-2">
                            Review & Insights
                        </h1>
                        <p className="text-gray-600 text-lg">
                            Let's discuss your answers with AI guidance
                        </p>
                    </div>

                    {/* Stats Card */}
                    <div className="bg-white rounded-2xl shadow-xl p-8 mb-6 border border-gray-100">
                        <div className="grid grid-cols-3 gap-6 mb-6">
                            <div className="text-center">
                                <div className="text-3xl font-bold text-gray-900">{reviewData.totalQuestions}</div>
                                <div className="text-sm text-gray-600">Total Questions</div>
                            </div>
                            <div className="text-center">
                                <div className="text-3xl font-bold text-green-600">{reviewData.correctAnswers}</div>
                                <div className="text-sm text-gray-600">Correct</div>
                            </div>
                            <div className="text-center">
                                <div className="text-3xl font-bold text-red-600">{reviewData.wrongAnswers}</div>
                                <div className="text-sm text-gray-600">To Review</div>
                            </div>
                        </div>

                        {/* Toggle */}
                        <div className="border-t pt-6">
                            <label className="flex items-center justify-center gap-3 cursor-pointer group">
                                <input
                                    type="checkbox"
                                    checked={reviewAllQuestions}
                                    onChange={(e) => setReviewAllQuestions(e.target.checked)}
                                    className="w-5 h-5 text-indigo-600 rounded focus:ring-2 focus:ring-indigo-500"
                                />
                                <span className="text-gray-700 font-medium group-hover:text-indigo-600 transition-colors">
                                    Review All Questions (including correct ones)
                                </span>
                            </label>
                            <p className="text-center text-sm text-gray-500 mt-2">
                                {reviewAllQuestions
                                    ? `You'll review all ${reviewData.totalQuestions} questions`
                                    : `Focus on ${reviewData.wrongAnswers} wrong answers to optimize study time`}
                            </p>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="space-y-3">
                        <button
                            onClick={handleStartReview}
                            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold py-4 px-6 rounded-xl shadow-lg transition-all flex items-center justify-center gap-3 text-lg"
                        >
                            <Play className="w-6 h-6" />
                            Start Socratic Review
                        </button>

                        <button
                            onClick={handleSkipToResults}
                            onMouseEnter={() => setShowSkipTooltip(true)}
                            onMouseLeave={() => setShowSkipTooltip(false)}
                            className="w-full bg-white hover:bg-gray-50 text-gray-700 font-semibold py-4 px-6 rounded-xl border-2 border-gray-300 transition-all flex items-center justify-center gap-3 relative"
                        >
                            <SkipForward className="w-5 h-5" />
                            Skip to Results

                            {/* Tooltip */}
                            {showSkipTooltip && (
                                <div className="absolute -top-20 left-1/2 transform -translate-x-1/2 bg-yellow-500 text-white px-4 py-3 rounded-lg shadow-lg text-sm font-medium whitespace-nowrap">
                                    <div className="flex items-center gap-2">
                                        <TrendingUp className="w-4 h-4" />
                                        Discussing mistakes can increase Learning Velocity by 40%!
                                    </div>
                                    <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 rotate-45 w-3 h-3 bg-yellow-500"></div>
                                </div>
                            )}
                        </button>
                    </div>

                    {/* Benefits */}
                    <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                        <div className="flex items-start gap-3">
                            <Lightbulb className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                            <div>
                                <p className="text-sm text-blue-900 font-medium">Why review with AI?</p>
                                <ul className="text-sm text-blue-800 mt-2 space-y-1">
                                    <li>• Understand WHY you got it wrong, not just the correct answer</li>
                                    <li>• Build conceptual thinking (MBA approach)</li>
                                    <li>• Boost your Learning Velocity score</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Active Review Screen
    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-indigo-50 p-4">
            <div className="max-w-7xl mx-auto">
                {/* Header with Progress */}
                <div className="mb-6">
                    <div className="bg-white rounded-lg shadow-md p-4">
                        <div className="flex items-center justify-between mb-3">
                            <div>
                                <h2 className="text-xl font-bold text-gray-900">
                                    Question {currentReviewIndex + 1} of {questionsToReview.length}
                                </h2>
                                <p className="text-sm text-gray-600">
                                    {understoodQuestions.size} marked as understood
                                </p>
                            </div>
                            <button
                                onClick={handleSkipToResults}
                                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors flex items-center gap-2"
                            >
                                <SkipForward className="w-4 h-4" />
                                Skip to Results
                            </button>
                        </div>

                        {/* Progress Bar */}
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                            <div
                                className="bg-gradient-to-r from-indigo-600 to-purple-600 h-2.5 rounded-full transition-all duration-300"
                                style={{ width: `${progress}%` }}
                            />
                        </div>
                    </div>
                </div>

                {/* Split View */}
                <div className="grid lg:grid-cols-2 gap-6">
                    {/* Left: Question Review Card */}
                    <div>
                        <QuestionReviewCard
                            question={currentQuestion}
                            questionNumber={currentReviewIndex + 1}
                            isUnderstood={understoodQuestions.has(currentQuestion.soalId)}
                        />
                    </div>

                    {/* Right: Socratic Chat */}
                    <div className="h-[600px]">
                        <SocraticChat
                            questionId={currentQuestion.soalId}
                            questionContent={currentQuestion.content}
                            selectedOption={currentQuestion.userAnswerLabel || undefined}
                            onPhaseChange={setCurrentPhase}
                        />

                        {/* PAPE Phase Indicator */}
                        <div className="mt-4 p-3 bg-white rounded-lg shadow-md">
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium text-gray-700">AI Phase:</span>
                                <div className="flex items-center gap-2">
                                    <div className={`w-2 h-2 rounded-full ${currentPhase === 'PROBE' ? 'bg-blue-500 animate-pulse' :
                                            currentPhase === 'ANALYZE' ? 'bg-green-500 animate-pulse' :
                                                currentPhase === 'PERSIST' ? 'bg-yellow-500 animate-pulse' :
                                                    'bg-purple-500 animate-pulse'
                                        }`} />
                                    <span className="text-sm font-bold text-gray-900">{currentPhase}</span>
                                </div>
                            </div>
                            <p className="text-xs text-gray-600 mt-1">
                                {currentPhase === 'PROBE' && 'AI is probing your reasoning...'}
                                {currentPhase === 'ANALYZE' && 'AI is analyzing your understanding...'}
                                {currentPhase === 'PERSIST' && 'AI is providing guidance...'}
                                {currentPhase === 'EVALUATE' && '✅ Deep learning achieved! MBA boost applied.'}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Navigation */}
                <div className="mt-6 bg-white rounded-lg shadow-md p-4">
                    <div className="flex items-center justify-between gap-4">
                        <button
                            onClick={handlePrevious}
                            disabled={currentReviewIndex === 0}
                            className="px-6 py-3 bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed text-gray-700 font-semibold rounded-lg transition-colors flex items-center gap-2"
                        >
                            <ChevronLeft className="w-5 h-5" />
                            Previous
                        </button>

                        <button
                            onClick={handleMarkAsUnderstood}
                            className="flex-1 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold rounded-lg transition-all flex items-center justify-center gap-2 shadow-lg"
                        >
                            {understoodQuestions.has(currentQuestion.soalId) ? (
                                <>
                                    <CheckCircle2 className="w-5 h-5" />
                                    Understood ✓
                                </>
                            ) : (
                                <>
                                    <Award className="w-5 h-5" />
                                    Mark as Understood
                                </>
                            )}
                        </button>

                        <button
                            onClick={handleNext}
                            className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg transition-colors flex items-center gap-2"
                        >
                            {isLastReviewQuestion ? 'Finish Review' : 'Next'}
                            <ChevronRight className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
