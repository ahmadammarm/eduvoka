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
        <div className="bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50 rounded-xl p-3 border border-indigo-100 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
                <div className="p-1.5 bg-indigo-100 rounded-lg">
                    <GraduationCap className="w-4 h-4 text-indigo-600" />
                </div>
                <div>
                    <h4 className="text-sm font-bold text-gray-900">Socratic Method Active</h4>
                    <p className="text-[10px] text-gray-500">Guiding you to discover the answer</p>
                </div>
            </div>

            {/* Progress Bar with Aligned Labels */}
            <div className="flex items-center justify-between mb-2">
                {phases.map((phase, idx) => (
                    <div key={phase.id} className="flex flex-col items-center relative" style={{ flex: idx < phases.length - 1 ? 1 : 0 }}>
                        {/* Node */}
                        <div
                            className={`w-3 h-3 rounded-full flex-shrink-0 transition-all duration-500 z-10 ${idx < currentIndex
                                ? 'bg-indigo-500 shadow-md'
                                : idx === currentIndex
                                    ? 'bg-indigo-500 ring-4 ring-indigo-200 animate-pulse shadow-lg'
                                    : 'bg-gray-300'
                                }`}
                        />
                        {/* Connector Line (to the right) */}
                        {idx < phases.length - 1 && (
                            <div
                                className={`absolute top-1.5 left-1/2 w-full h-0.5 transition-all duration-500 ${idx < currentIndex ? 'bg-indigo-500' : 'bg-gray-200'
                                    }`}
                            />
                        )}
                        {/* Label */}
                        <span
                            className={`mt-2 text-[10px] font-medium transition-colors duration-300 ${idx === currentIndex
                                ? 'text-indigo-700 font-bold'
                                : idx < currentIndex
                                    ? 'text-indigo-500'
                                    : 'text-gray-400'
                                }`}
                        >
                            {phase.label}
                        </span>
                    </div>
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
