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
    const [currentReviewIndex, setCurrentReviewIndex] = useState(0);
    const [understoodQuestions, setUnderstoodQuestions] = useState<Set<string>>(new Set());
    const [frustratedQuestions, setFrustratedQuestions] = useState<Set<string>>(new Set()); // Track user frustration
    const [currentPhase, setCurrentPhase] = useState<'PROBE' | 'ANALYZE' | 'PERSIST' | 'EVALUATE'>('PROBE');
    const [countdown, setCountdown] = useState(5);
    const [hasChatted, setHasChatted] = useState<Set<string>>(new Set()); // Track if user has chatted for each question

    // Auto-start countdown timer
    useEffect(() => {
        if (reviewStarted || countdown === 0) return;

        const timer = setInterval(() => {
            setCountdown(prev => {
                if (prev <= 1) {
                    clearInterval(timer);
                    setReviewStarted(true);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [reviewStarted, countdown]);

    // Always filter to ONLY wrong answers - no option to review all
    const questionsToReview = reviewData.questions.filter(q => !q.isCorrect);

    // If no wrong answers (perfect score), skip review entirely
    useEffect(() => {
        if (questionsToReview.length === 0) {
            // Perfect score - skip review and go directly to results
            router.push(`/dashboard/practice-questions/${reviewData.materiId}/result?sessionId=${reviewData.sessionId}`);
        }
    }, [questionsToReview.length, reviewData.materiId, reviewData.sessionId, router]);

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
        router.push(`/dashboard/practice-questions/${reviewData.materiId}/result?sessionId=${reviewData.sessionId}`);
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
            <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 flex items-center justify-center p-4">
                <div className="max-w-2xl w-full">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-orange-500 to-amber-600 rounded-full mb-4 shadow-lg">
                            <MessageSquare className="w-10 h-10 text-white" />
                        </div>
                        <h1 className="text-4xl font-bold text-gray-900 mb-2">
                            Question Review
                        </h1>
                        <p className="text-gray-600 text-lg">
                            Let's discuss your answers in-depth
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

                        {/* Info: Only reviewing wrong answers */}
                        <div className="border-t pt-6">
                            <p className="text-center text-gray-600">
                                You will review <span className="font-bold text-orange-600">{reviewData.wrongAnswers} questions</span> you answered incorrectly
                            </p>
                            <p className="text-xs text-center text-gray-500 mt-2">
                                Deep discussion to maximize your learning
                            </p>
                        </div>
                    </div>

                    {/* Action: Auto-start countdown */}
                    <div className="space-y-3">
                        {/* Countdown Display */}
                        <div className="bg-gradient-to-r from-orange-600 to-amber-600 text-white font-bold py-8 px-6 rounded-xl shadow-lg text-center">
                            <div className="text-sm mb-2">Review starts in...</div>
                            <div className="text-7xl font-bold mb-2">{countdown}</div>
                            <div className="text-sm text-orange-100">Prepare to deeply understand your mistakes!</div>
                        </div>
                    </div>

                    {/* Benefits */}
                    <div className="mt-6 p-4 bg-orange-50 rounded-lg border border-orange-200">
                        <div className="flex items-start gap-3">
                            <Lightbulb className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
                            <div>
                                <p className="text-sm text-orange-900 font-medium">Why deep review matters?</p>
                                <ul className="text-sm text-orange-800 mt-2 space-y-1">
                                    <li>• Understand WHY you got it wrong, not just the correct answer</li>
                                    <li>• Build conceptual thinking (best test strategy)</li>
                                    <li>• Improve Learning Velocity by up to 40%</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Safety check: If review started but no questions to review (race condition for perfect scores)
    if (reviewStarted && questionsToReview.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen gap-4">
                <div className="w-16 h-16 border-4 border-orange-600 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-gray-600">Preparing your review...</p>
            </div>
        );
    }

    // Active Review Screen
    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-orange-50 p-4">
            <div className="max-w-7xl mx-auto">
                {/* Header with Progress */}
                <div className="mb-6">
                    <div className="bg-white rounded-lg shadow-md p-4">
                        <div className="mb-3">
                            <h2 className="text-xl font-bold text-gray-900">
                                Question {currentReviewIndex + 1} of {questionsToReview.length}
                            </h2>
                            <p className="text-sm text-gray-600">
                                {understoodQuestions.size} questions understood
                            </p>
                        </div>

                        {/* Progress Bar */}
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                            <div
                                className="bg-gradient-to-r from-orange-600 to-amber-600 h-2.5 rounded-full transition-all duration-300"
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
                            key={currentQuestion.soalId}
                            questionId={currentQuestion.soalId}
                            questionContent={currentQuestion.content}
                            selectedOption={currentQuestion.userAnswerLabel || undefined}
                            onPhaseChange={(phase) => {
                                setCurrentPhase(phase);
                            }}
                            onMessageSent={() => {
                                // Mark as chatted when user sends first message
                                setHasChatted(prev => new Set(prev).add(currentQuestion.soalId));
                            }}
                            onFrustrationDetected={() => {
                                // Mark as frustrated when frustration is detected
                                setFrustratedQuestions(prev => new Set(prev).add(currentQuestion.soalId));
                            }}
                            onConceptMastered={() => {
                                // Auto-advance when AI signals mastery
                                handleMarkAsUnderstood();
                            }}
                        />

                        {/* PAPE Phase Indicator */}
                        <div className="mt-4 p-3 bg-white rounded-lg shadow-md">
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium text-gray-700">Discussion Phase:</span>
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
                                {currentPhase === 'PROBE' && 'Exploring your understanding...'}
                                {currentPhase === 'ANALYZE' && 'Analyzing error patterns...'}
                                {currentPhase === 'PERSIST' && 'Providing deeper guidance...'}
                                {currentPhase === 'EVALUATE' && '✅ Deep understanding achieved!'}
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
                            disabled={!hasChatted.has(currentQuestion.soalId)}
                            className={`flex-1 px-6 py-3 font-bold rounded-lg transition-all flex items-center justify-center gap-2 shadow-lg ${hasChatted.has(currentQuestion.soalId)
                                ? 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white cursor-pointer'
                                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                }`}
                            title={!hasChatted.has(currentQuestion.soalId) ? 'Discuss with AI tutor first' : ''}
                        >
                            {understoodQuestions.has(currentQuestion.soalId) ? (
                                <>
                                    <CheckCircle2 className="w-5 h-5" />
                                    Understood ✓
                                </>
                            ) : frustratedQuestions.has(currentQuestion.soalId) ? (
                                <>
                                    <ChevronRight className="w-5 h-5" />
                                    Continue (Frustrated)
                                </>
                            ) : (
                                <>
                                    <Award className="w-5 h-5" />
                                    {hasChatted.has(currentQuestion.soalId) ? 'Mark as Understood' : 'Chat First to Continue'}
                                </>
                            )}
                        </button>

                        <button
                            onClick={handleNext}
                            className="px-6 py-3 bg-orange-600 hover:bg-orange-700 text-white font-semibold rounded-lg transition-colors flex items-center gap-2"
                        >
                            {isLastReviewQuestion ? 'Finish' : 'Next'}
                            <ChevronRight className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
