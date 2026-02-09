'use client';

import { GraduationCap } from 'lucide-react';

interface SocraticMethodIndicatorProps {
    currentPhase: 'PROBE' | 'ANALYZE' | 'PERSIST' | 'EVALUATE';
}

const phases = [
    { id: 'PROBE', label: 'Ask', description: 'Understanding your thinking' },
    { id: 'ANALYZE', label: 'Clarify', description: 'Exploring your reasoning' },
    { id: 'PERSIST', label: 'Challenge', description: 'Testing with edge cases' },
    { id: 'EVALUATE', label: 'Conclude', description: 'Confirming mastery' }
];

export default function SocraticMethodIndicator({ currentPhase }: SocraticMethodIndicatorProps) {
    const currentIndex = phases.findIndex(p => p.id === currentPhase);
    const currentPhaseData = phases[currentIndex];

    return (
        <div className="bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50 rounded-xl p-4 border border-indigo-100 shadow-sm">
            <div className="flex items-center gap-2 mb-3">
                <div className="p-1.5 bg-indigo-100 rounded-lg">
                    <GraduationCap className="w-4 h-4 text-indigo-600" />
                </div>
                <div>
                    <h4 className="text-sm font-bold text-gray-900">Socratic Method Active</h4>
                    <p className="text-[10px] text-gray-500">Guiding you to discover the answer</p>
                </div>
            </div>

            {/* Progress Bar */}
            <div className="flex items-center gap-1 mb-2">
                {phases.map((phase, idx) => (
                    <div key={phase.id} className="flex-1 flex items-center">
                        {/* Node */}
                        <div
                            className={`w-3 h-3 rounded-full flex-shrink-0 transition-all duration-500 ${idx < currentIndex
                                    ? 'bg-indigo-500 shadow-md'
                                    : idx === currentIndex
                                        ? 'bg-indigo-500 ring-4 ring-indigo-200 animate-pulse shadow-lg'
                                        : 'bg-gray-300'
                                }`}
                        />
                        {/* Connector Line */}
                        {idx < phases.length - 1 && (
                            <div
                                className={`flex-1 h-0.5 transition-all duration-500 ${idx < currentIndex ? 'bg-indigo-500' : 'bg-gray-200'
                                    }`}
                            />
                        )}
                    </div>
                ))}
            </div>

            {/* Phase Labels */}
            <div className="flex justify-between text-[10px]">
                {phases.map((phase, idx) => (
                    <span
                        key={phase.id}
                        className={`font-medium transition-colors duration-300 ${idx === currentIndex
                                ? 'text-indigo-700 font-bold'
                                : idx < currentIndex
                                    ? 'text-indigo-500'
                                    : 'text-gray-400'
                            }`}
                    >
                        {phase.label}
                    </span>
                ))}
            </div>

            {/* Current Phase Description */}
            <div className="mt-3 text-center">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/80 rounded-full border border-indigo-100 shadow-sm">
                    <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-pulse" />
                    <span className="text-xs text-gray-700">{currentPhaseData?.description}</span>
                </span>
            </div>
        </div>
    );
}
