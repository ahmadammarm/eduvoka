import { Book } from 'lucide-react';

export const ScientificMethodologyCard = () => {
    return (
        <div className="bg-gray-50 rounded-2xl p-8 border border-gray-200 mt-8">
            <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-indigo-100 rounded-lg">
                    <Book className="w-6 h-6 text-indigo-700" />
                </div>
                <div>
                    <h3 className="text-xl font-bold text-gray-900">Eduvoka Scientific Velocity Index (SVI)</h3>
                    <p className="text-sm text-gray-600">Methodology & Cognitive Science Principles</p>
                </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-4">
                    <div>
                        <h4 className="font-semibold text-gray-900 mb-1 flex items-center gap-2">
                            <span className="text-indigo-600">01.</span> Item Response Theory (IRT)
                        </h4>
                        <p className="text-sm text-gray-600 leading-relaxed">
                            Difficulty scoring is weighted based on IRT principles, where successful retrieval of higher-complexity items contributes non-linearly to velocity scores, distinguishing true mastery from surface-level guessing.
                        </p>
                    </div>
                    <div>
                        <h4 className="font-semibold text-gray-900 mb-1 flex items-center gap-2">
                            <span className="text-indigo-600">02.</span> Exponential Time Decay
                        </h4>
                        <p className="text-sm text-gray-600 leading-relaxed">
                            Time efficiency uses an exponential decay function. Speed is rewarded up to a cognitive limit (0.8x target), while excessive hesitation (&gt;2.5x) incurs steep penalties, modeling real-world exam time pressure.
                        </p>
                    </div>
                </div>

                <div className="space-y-4">
                    <div>
                        <h4 className="font-semibold text-gray-900 mb-1 flex items-center gap-2">
                            <span className="text-indigo-600">03.</span> Coefficient of Variation (CV)
                        </h4>
                        <p className="text-sm text-gray-600 leading-relaxed">
                            "Material Engagement" tracks the consistency of your cognitive flow using the Coefficient of Variation ($$CV = \sigma / \mu$$). Lower variance indicates stable, reliable performance rather than erratic, lucky guesses.
                        </p>
                    </div>
                    <div>
                        <h4 className="font-semibold text-gray-900 mb-1 flex items-center gap-2">
                            <span className="text-indigo-600">04.</span> Sigmoid Growth Curve
                        </h4>
                        <p className="text-sm text-gray-600 leading-relaxed">
                            Improvement is calculated using a sigmoid function to smooth out short-term variance and highlight sustained learning trends over the last 5 sessions.
                        </p>
                    </div>
                </div>
            </div>

            <div className="mt-6 pt-6 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-500">
                <p>
                    <strong>Formula:</strong> Velocity = (Acc × 30%) + (Diff × 20%) + (Time × 20%) + (Consistency × 15%) + (Growth × 10%) + (Eng × 5%)
                </p>
                <div className="flex gap-2">
                    <span className="px-2 py-1 bg-gray-200 rounded">CogSci v2.1</span>
                    <span className="px-2 py-1 bg-gray-200 rounded">Adaptive Learning</span>
                </div>
            </div>
        </div>
    );
};
