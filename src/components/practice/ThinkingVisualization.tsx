'use client';

import { useEffect, useState } from 'react';
import { Brain, Sparkles } from 'lucide-react';

interface ThinkingVisualizationProps {
    isActive: boolean;
}

const thinkingSteps = [
    "Reading your answer...",
    "Identifying key concepts...",
    "Finding misconceptions...",
    "Crafting guiding questions..."
];

export default function ThinkingVisualization({ isActive }: ThinkingVisualizationProps) {
    const [currentStepIndex, setCurrentStepIndex] = useState(0);
    const [displayedText, setDisplayedText] = useState('');
    const [isTyping, setIsTyping] = useState(true);

    // Reset when activated
    useEffect(() => {
        if (isActive) {
            setCurrentStepIndex(0);
            setDisplayedText('');
            setIsTyping(true);
        }
    }, [isActive]);

    // Typing animation effect
    useEffect(() => {
        if (!isActive) return;

        const currentStep = thinkingSteps[currentStepIndex];

        if (displayedText.length < currentStep.length) {
            const timeout = setTimeout(() => {
                setDisplayedText(currentStep.slice(0, displayedText.length + 1));
            }, 30); // Typing speed
            return () => clearTimeout(timeout);
        } else {
            // Finished typing current step, move to next
            setIsTyping(false);
            const timeout = setTimeout(() => {
                if (currentStepIndex < thinkingSteps.length - 1) {
                    setCurrentStepIndex(prev => prev + 1);
                    setDisplayedText('');
                    setIsTyping(true);
                }
            }, 600); // Pause between steps
            return () => clearTimeout(timeout);
        }
    }, [isActive, currentStepIndex, displayedText]);

    if (!isActive) return null;

    return (
        <div className="flex gap-2 justify-start animate-in fade-in duration-300">
            <div className="flex-shrink-0 mt-1">
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-orange-400 to-amber-500 flex items-center justify-center shadow-lg">
                    <Brain className="w-4 h-4 text-white animate-pulse" />
                </div>
            </div>
            <div className="bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl p-4 border border-orange-200 shadow-sm max-w-[85%]">
                <div className="flex items-center gap-2 mb-2">
                    <Sparkles className="w-4 h-4 text-orange-500 animate-spin" style={{ animationDuration: '3s' }} />
                    <span className="text-xs font-semibold text-orange-700 uppercase tracking-wider">
                        Socratic AI Thinking
                    </span>
                </div>

                {/* Progress dots */}
                <div className="flex gap-1 mb-3">
                    {thinkingSteps.map((_, idx) => (
                        <div
                            key={idx}
                            className={`h-1 flex-1 rounded-full transition-all duration-300 ${idx < currentStepIndex
                                ? 'bg-orange-500'
                                : idx === currentStepIndex
                                    ? 'bg-orange-400 animate-pulse'
                                    : 'bg-gray-200'
                                }`}
                        />
                    ))}
                </div>

                {/* Typing text */}
                <div className="min-h-[24px]">
                    <p className="text-sm text-gray-700 font-medium">
                        {displayedText}
                        {isTyping && (
                            <span className="inline-block w-0.5 h-4 bg-orange-500 ml-0.5 animate-pulse" />
                        )}
                    </p>
                </div>

                {/* Completed steps */}
                {currentStepIndex > 0 && (
                    <div className="mt-2 space-y-1">
                        {thinkingSteps.slice(0, currentStepIndex).map((step, idx) => (
                            <p key={idx} className="text-xs text-gray-500 flex items-center gap-1">
                                <span className="text-green-500">✓</span> {step}
                            </p>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
