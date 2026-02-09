'use client';

import { useState, useCallback } from 'react';
import type { BurnoutCalculationResult } from '@/types/burnout';

interface UseBurnoutMetricsReturn {
	burnoutData: BurnoutCalculationResult | null;
	isCalculating: boolean;
	error: string | null;
	calculateBurnout: (sessionId: string) => Promise<BurnoutCalculationResult | null>;
	clearBurnout: () => void;
}

export function useBurnoutMetrics(): UseBurnoutMetricsReturn {
	const [burnoutData, setBurnoutData] = useState<BurnoutCalculationResult | null>(null);
	const [isCalculating, setIsCalculating] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const calculateBurnout = useCallback(async (sessionId: string) => {
		setIsCalculating(true);
		setError(null);

		try {
			const response = await fetch(`/api/metrics/burnout/${sessionId}`);

			if (!response.ok) {
				const errorData = await response.json();
				throw new Error(errorData.reason || errorData.error || 'Failed to calculate burnout');
			}

			const result = await response.json();

			setBurnoutData(result);
			return result;

		} catch (err) {
			const errorMessage = err instanceof Error ? err.message : 'Unknown error';
			setError(errorMessage);
			console.error('[useBurnoutMetrics] Error:', err);
			return null;

		} finally {
			setIsCalculating(false);
		}
	}, []);

	const clearBurnout = useCallback(() => {
		setBurnoutData(null);
		setError(null);
	}, []);

	return {
		burnoutData,
		isCalculating,
		error,
		calculateBurnout,
		clearBurnout
	};
}