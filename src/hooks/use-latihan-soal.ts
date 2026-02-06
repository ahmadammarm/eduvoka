// hooks/use-latihan-soal.ts
import { useState, useEffect, useCallback } from 'react';
import {
	Materi,
	SoalLatihan,
	SessionType,
	JawabanUser,
	SoalProgress,
	SessionResult
} from '@/types/latihan-soal';

export function useMateriList() {
	const [materiList, setMateriList] = useState<Materi[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		async function fetchMateri() {
			try {
				const response = await fetch('/api/latihan-soal');
				if (!response.ok) throw new Error('Failed to fetch materi');

				const data = await response.json();
				setMateriList(data.data || []);
			} catch (err) {
				setError(err instanceof Error ? err.message : 'Unknown error');
			} finally {
				setLoading(false);
			}
		}

		fetchMateri();
	}, []);

	return { materiList, loading, error };
}

export function useSoalByMateri(materiId: string | null, tipeSesi?: SessionType) {
	const [soalList, setSoalList] = useState<SoalLatihan[]>([]);
	const [materi, setMateri] = useState<Materi | null>(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const fetchSoal = useCallback(async () => {
		if (!materiId) return;

		setLoading(true);
		setError(null);

		try {
			const params = new URLSearchParams();
			if (tipeSesi) params.append('tipeSesi', tipeSesi);

			const url = `/api/latihan-soal/${materiId}?${params.toString()}`;
			const response = await fetch(url);

			if (!response.ok) throw new Error('Failed to fetch soal');

			const data = await response.json();
			setSoalList(data.data.soal || []);
			setMateri(data.data.materi || null);
		} catch (err) {
			setError(err instanceof Error ? err.message : 'Unknown error');
		} finally {
			setLoading(false);
		}
	}, [materiId, tipeSesi]);

	useEffect(() => {
		fetchSoal();
	}, [fetchSoal]);

	return { soalList, materi, loading, error, refetch: fetchSoal };
}

export function useLatihanSession() {
	const [sessionId, setSessionId] = useState<string | null>(null);
	const [currentIndex, setCurrentIndex] = useState(0);
	const [progress, setProgress] = useState<Map<string, SoalProgress>>(new Map());
	const [startTime, setStartTime] = useState<number>(Date.now());
	const [questionStartTime, setQuestionStartTime] = useState<number>(Date.now());
	const [isCreating, setIsCreating] = useState(false);

	// Tambahkan materiId sebagai parameter
	const createSession = useCallback(async (type: SessionType, materiId?: string) => {
		if (isCreating) {
			console.log('Session creation already in progress, skipping...');
			return sessionId;
		}

		if (sessionId) {
			console.log('Session already exists:', sessionId);
			return sessionId;
		}

		setIsCreating(true);
		try {
			console.log('Creating new session:', { type, materiId });

			const response = await fetch('/api/latihan-soal/session', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ type, materiId }) // Kirim materiId
			});

			if (!response.ok) {
				const errorData = await response.json();
				console.error('Session creation failed:', errorData);
				throw new Error(errorData.details || errorData.error || 'Failed to create session');
			}

			const data = await response.json();
			console.log('Session created successfully:', data.data);

			const newSessionId = data.data.sessionId;
			setSessionId(newSessionId);
			setStartTime(Date.now());
			setQuestionStartTime(Date.now());

			return newSessionId;
		} catch (err) {
			console.error('Error creating session:', err);
			throw err;
		} finally {
			setIsCreating(false);
		}
	}, [sessionId, isCreating]);

	const submitAnswer = async (
		materiId: string,
		soalId: string,
		pilihanId: string | null,
		isSkipped: boolean = false
	): Promise<JawabanUser | null> => {
		if (!sessionId) {
			console.error('No session ID available');
			throw new Error('Session belum dibuat. Silakan refresh halaman.');
		}

		try {
			const timeSpent = Math.floor((Date.now() - questionStartTime) / 1000);

			console.log('Submitting answer:', {
				sessionId,
				soalId,
				pilihanId,
				materiId,
				timeSpent,
				isSkipped
			});

			const response = await fetch(`/api/latihan-soal/${materiId}/answer`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					sessionId,
					soalLatihanId: soalId,
					pilihanId,
					timeSpent,
					isSkipped
				})
			});

			if (!response.ok) {
				const errorData = await response.json();
				console.error('Submit answer failed:', errorData);
				throw new Error(errorData.error || 'Failed to submit answer');
			}

			const data = await response.json();
			console.log('Answer submitted successfully:', data);

			// Update progress
			setProgress(prev => {
				const newProgress = new Map(prev);
				newProgress.set(soalId, {
					soalId,
					answered: true,
					isCorrect: data.data.isCorrect,
					pilihanId: pilihanId || undefined,
					timeSpent
				});
				return newProgress;
			});

			// Reset timer untuk soal berikutnya
			setQuestionStartTime(Date.now());

			return data.data;
		} catch (err) {
			console.error('Error submitting answer:', err);
			throw err;
		}
	};

	const completeSession = async (): Promise<SessionResult | null> => {
		if (!sessionId) return null;

		try {
			const response = await fetch(`/api/latihan-soal/session/${sessionId}/complete`, {
				method: 'POST'
			});

			if (!response.ok) throw new Error('Failed to complete session');

			const data = await response.json();
			return data.data;
		} catch (err) {
			console.error('Error completing session:', err);
			throw err;
		}
	};

	const nextQuestion = () => setCurrentIndex(prev => prev + 1);
	const previousQuestion = () => setCurrentIndex(prev => Math.max(0, prev - 1));
	const goToQuestion = (index: number) => {
		setCurrentIndex(index);
		setQuestionStartTime(Date.now());
	};

	const resetSession = () => {
		setSessionId(null);
		setCurrentIndex(0);
		setProgress(new Map());
		setStartTime(Date.now());
		setQuestionStartTime(Date.now());
	};

	return {
		sessionId,
		currentIndex,
		progress,
		startTime,
		createSession,
		submitAnswer,
		completeSession,
		nextQuestion,
		previousQuestion,
		goToQuestion,
		resetSession
	};
}