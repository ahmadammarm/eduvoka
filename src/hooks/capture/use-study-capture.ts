'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { useEventBuffer } from './use-event-buffer';
import type { StudySessionState } from '@/types/data-capture';

const IDLE_TIMEOUT_MS = 60_000;
const HEARTBEAT_INTERVAL_MS = 30_000;
const SCROLL_DEBOUNCE_MS = 500;

interface UseStudyCaptureOptions {
    materiId: string;
    scrollContainerRef?: React.RefObject<HTMLElement | null>;
    idleTimeoutMs?: number;
    heartbeatIntervalMs?: number;
}

export function useStudyCapture({
    materiId,
    scrollContainerRef,
    idleTimeoutMs = IDLE_TIMEOUT_MS,
    heartbeatIntervalMs = HEARTBEAT_INTERVAL_MS,
}: UseStudyCaptureOptions) {
    const { pushEvent, forceFlush, syncStatus } = useEventBuffer();

    const [sessionState, setSessionState] = useState<StudySessionState>({
        sessionId: null,
        materiId,
        isActive: false,
        isVisible: true,
        isIdle: false,
        startedAt: 0,
        totalActiveTime: 0,
        totalIdleTime: 0,
        totalHiddenTime: 0,
        totalScrollEvents: 0,
        visibilityChanges: 0,
        scrollDepthMax: 0,
        scrollDepthCurrent: 0,
        scrollDepthSum: 0,
        scrollDepthReadings: 0,
        lastActivityAt: Date.now(),
    });

    const stateRef = useRef(sessionState);
    const idleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const heartbeatRef = useRef<ReturnType<typeof setInterval> | null>(null);
    const activeTimeAccumulator = useRef(0);
    const idleTimeAccumulator = useRef(0);
    const hiddenTimeAccumulator = useRef(0);
    const scrollEventCounter = useRef(0);
    const visibilityChangeCounter = useRef(0);
    const scrollDepthSumAccumulator = useRef(0);
    const scrollDepthReadingsCounter = useRef(0);
    const lastTickRef = useRef(Date.now());
    const scrollDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const serverSessionId = useRef<string | null>(null);
    const isEndingRef = useRef(false);
    const isMountedRef = useRef(true);
    const hasStartedRef = useRef(false);
    const isStartingRef = useRef(false);

    // Keep ref in sync
    useEffect(() => {
        stateRef.current = sessionState;
    }, [sessionState]);

    useEffect(() => {
        isMountedRef.current = true;
        return () => {
            isMountedRef.current = false;
        };
    }, []);

    // Create study session on server
    const createServerSession = useCallback(async (): Promise<string | null> => {
        try {
            const response = await fetch('/api/capture/study-session', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ materiId }),
            });

            if (!response.ok) throw new Error('Failed to create study session');

            const data = await response.json();
            return data.sessionId;
        } catch (error) {
            console.error('[StudyCapture] Failed to create server session:', error);
            return `client_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
        }
    }, [materiId]);

    // Time tracking ticker — FIXED: track all time states
    useEffect(() => {
        if (!sessionState.isActive) return;

        const ticker = setInterval(() => {
            const now = Date.now();
            const elapsed = Math.floor((now - lastTickRef.current) / 1000);
            lastTickRef.current = now;

            if (elapsed <= 0) return;

            if (!stateRef.current.isVisible) {
                // Tab is hidden
                hiddenTimeAccumulator.current += elapsed;
                if (isMountedRef.current) {
                    setSessionState((prev) => ({
                        ...prev,
                        totalHiddenTime: hiddenTimeAccumulator.current,
                    }));
                }
            } else if (stateRef.current.isIdle) {
                // Visible but idle
                idleTimeAccumulator.current += elapsed;
                if (isMountedRef.current) {
                    setSessionState((prev) => ({
                        ...prev,
                        totalIdleTime: idleTimeAccumulator.current,
                    }));
                }
            } else {
                // Visible and active
                activeTimeAccumulator.current += elapsed;
                if (isMountedRef.current) {
                    setSessionState((prev) => ({
                        ...prev,
                        totalActiveTime: activeTimeAccumulator.current,
                    }));
                }
            }
        }, 1_000);

        return () => clearInterval(ticker);
    }, [sessionState.isActive]);

    // Idle detection
    const resetIdleTimer = useCallback(() => {
        if (idleTimerRef.current) {
            clearTimeout(idleTimerRef.current);
        }

        if (stateRef.current.isIdle && stateRef.current.isActive) {
            pushEvent({
                type: 'STUDY_IDLE_END',
                sessionRef: serverSessionId.current ?? undefined,
                payload: {
                    materiId,
                    idleDurationSeconds: idleTimeAccumulator.current,
                },
            });

            setSessionState((prev) => ({ ...prev, isIdle: false }));
        }

        idleTimerRef.current = setTimeout(() => {
            if (!stateRef.current.isActive) return;

            setSessionState((prev) => ({ ...prev, isIdle: true }));

            pushEvent({
                type: 'STUDY_IDLE_START',
                sessionRef: serverSessionId.current ?? undefined,
                payload: {
                    materiId,
                    idleStartedAt: Date.now(),
                    totalActiveTimeBeforeIdle: activeTimeAccumulator.current,
                },
            });
        }, idleTimeoutMs);
    }, [materiId, idleTimeoutMs, pushEvent]);

    // Activity listeners
    useEffect(() => {
        if (!sessionState.isActive) return;

        const handleActivity = () => {
            setSessionState((prev) => ({
                ...prev,
                lastActivityAt: Date.now(),
            }));
            resetIdleTimer();
        };

        const events = ['mousemove', 'keydown', 'touchstart', 'click'];
        events.forEach((evt) => window.addEventListener(evt, handleActivity, { passive: true }));

        return () => {
            events.forEach((evt) => window.removeEventListener(evt, handleActivity));
        };
    }, [sessionState.isActive, resetIdleTimer]);

    // Visibility change detection
    useEffect(() => {
        if (!sessionState.isActive) return;

        const handleVisibilityChange = () => {
            const isVisible = document.visibilityState === 'visible';

            visibilityChangeCounter.current += 1;

            setSessionState((prev) => ({
                ...prev,
                isVisible,
                visibilityChanges: visibilityChangeCounter.current,
            }));

            pushEvent({
                type: 'STUDY_VISIBILITY_CHANGE',
                sessionRef: serverSessionId.current ?? undefined,
                payload: {
                    materiId,
                    isVisible,
                    totalActiveTimeSoFar: activeTimeAccumulator.current,
                    totalHiddenTimeSoFar: hiddenTimeAccumulator.current,
                    visibilityChangeCount: visibilityChangeCounter.current,
                },
            });

            if (isVisible) {
                lastTickRef.current = Date.now();
                resetIdleTimer();
            }
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);
        return () => {
            document.removeEventListener('visibilitychange', handleVisibilityChange);
        };
    }, [sessionState.isActive, materiId, pushEvent, resetIdleTimer]);

    // Scroll tracking
    useEffect(() => {
        if (!sessionState.isActive) return;

        const container = scrollContainerRef?.current;

        if (scrollContainerRef && !container) return;

        const handleScroll = () => {
            if (scrollDebounceRef.current) {
                clearTimeout(scrollDebounceRef.current);
            }

            scrollDebounceRef.current = setTimeout(() => {
                let scrollDepth: number;

                if (container) {
                    const scrollable = container.scrollHeight - container.clientHeight;
                    scrollDepth =
                        scrollable > 0
                            ? Math.round((container.scrollTop / scrollable) * 100)
                            : 0;
                } else {
                    const scrollable =
                        document.documentElement.scrollHeight - window.innerHeight;
                    scrollDepth =
                        scrollable > 0
                            ? Math.round((window.scrollY / scrollable) * 100)
                            : 0;
                }

                scrollEventCounter.current += 1;
                scrollDepthSumAccumulator.current += scrollDepth;
                scrollDepthReadingsCounter.current += 1;

                setSessionState((prev) => ({
                    ...prev,
                    scrollDepthCurrent: scrollDepth,
                    scrollDepthMax: Math.max(prev.scrollDepthMax, scrollDepth),
                    totalScrollEvents: scrollEventCounter.current,
                    scrollDepthSum: scrollDepthSumAccumulator.current,
                    scrollDepthReadings: scrollDepthReadingsCounter.current,
                }));

                pushEvent({
                    type: 'STUDY_SCROLL',
                    sessionRef: serverSessionId.current ?? undefined,
                    payload: {
                        materiId,
                        scrollDepth,
                        scrollDepthMax: Math.max(
                            stateRef.current.scrollDepthMax,
                            scrollDepth
                        ),
                        scrollEventCount: scrollEventCounter.current,
                    },
                });
            }, SCROLL_DEBOUNCE_MS);
        };

        const target = container ?? window;
        target.addEventListener('scroll', handleScroll, { passive: true });

        return () => {
            target.removeEventListener('scroll', handleScroll);
            if (scrollDebounceRef.current) {
                clearTimeout(scrollDebounceRef.current);
            }
        };
    }, [sessionState.isActive, materiId, scrollContainerRef, pushEvent]);

    // Heartbeat
    useEffect(() => {
        if (!sessionState.isActive) return;

        heartbeatRef.current = setInterval(() => {
            if (!stateRef.current.isVisible || stateRef.current.isIdle) return;

            pushEvent({
                type: 'STUDY_HEARTBEAT',
                sessionRef: serverSessionId.current ?? undefined,
                payload: {
                    materiId,
                    totalActiveTimeSeconds: activeTimeAccumulator.current,
                    totalIdleTimeSeconds: idleTimeAccumulator.current,
                    totalHiddenTimeSeconds: hiddenTimeAccumulator.current,
                    scrollDepthMax: stateRef.current.scrollDepthMax,
                    scrollDepthCurrent: stateRef.current.scrollDepthCurrent,
                    totalScrollEvents: scrollEventCounter.current,
                    visibilityChanges: visibilityChangeCounter.current,
                    isVisible: stateRef.current.isVisible,
                },
            });
        }, heartbeatIntervalMs);

        return () => {
            if (heartbeatRef.current) {
                clearInterval(heartbeatRef.current);
            }
        };
    }, [sessionState.isActive, materiId, heartbeatIntervalMs, pushEvent]);

    // Public API
    const startStudy = useCallback(async () => {
        if (hasStartedRef.current || isStartingRef.current) return;
        isStartingRef.current = true;

        try {
            isEndingRef.current = false;

            const sid = await createServerSession();
            serverSessionId.current = sid;
            hasStartedRef.current = true;

            activeTimeAccumulator.current = 0;
            idleTimeAccumulator.current = 0;
            hiddenTimeAccumulator.current = 0;
            scrollEventCounter.current = 0;
            visibilityChangeCounter.current = 0;
            scrollDepthSumAccumulator.current = 0;
            scrollDepthReadingsCounter.current = 0;
            lastTickRef.current = Date.now();

            setSessionState({
                sessionId: sid,
                materiId,
                isActive: true,
                isVisible: true,
                isIdle: false,
                startedAt: Date.now(),
                totalActiveTime: 0,
                totalIdleTime: 0,
                totalHiddenTime: 0,
                totalScrollEvents: 0,
                visibilityChanges: 0,
                scrollDepthMax: 0,
                scrollDepthCurrent: 0,
                scrollDepthSum: 0,
                scrollDepthReadings: 0,
                lastActivityAt: Date.now(),
            });

            pushEvent({
                type: 'STUDY_START',
                sessionRef: sid ?? undefined,
                payload: {
                    materiId,
                    startedAt: Date.now(),
                },
            });

            resetIdleTimer();
        } catch (error) {
            console.error('[StudyCapture] startStudy failed:', error);
            isStartingRef.current = false;
            hasStartedRef.current = false;
        }
    }, [materiId, createServerSession, pushEvent, resetIdleTimer]);

    const endStudy = useCallback(async () => {
        if (!stateRef.current.isActive || isEndingRef.current) return;
        isEndingRef.current = true;

        // Clear timers
        if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
        if (heartbeatRef.current) clearInterval(heartbeatRef.current);

        const scrollDepthAvg =
            scrollDepthReadingsCounter.current > 0
                ? Math.round(scrollDepthSumAccumulator.current / scrollDepthReadingsCounter.current)
                : 0;

        pushEvent({
            type: 'STUDY_END',
            sessionRef: serverSessionId.current ?? undefined,
            payload: {
                materiId,
                totalActiveTimeSeconds: activeTimeAccumulator.current,
                totalIdleTimeSeconds: idleTimeAccumulator.current,
                totalHiddenTimeSeconds: hiddenTimeAccumulator.current,
                scrollDepthMax: stateRef.current.scrollDepthMax,
                scrollDepthAvg,
                totalScrollEvents: scrollEventCounter.current,
                visibilityChanges: visibilityChangeCounter.current,
                sessionDurationSeconds: Math.floor(
                    (Date.now() - stateRef.current.startedAt) / 1000
                ),
                endedAt: Date.now(),
            },
        });

        // Update server session via sendBeacon
        if (
            serverSessionId.current &&
            !serverSessionId.current.startsWith('client_')
        ) {
            const totalVisibleTime =
                    activeTimeAccumulator.current + idleTimeAccumulator.current;

            const updatePayload = {
                totalDuration: activeTimeAccumulator.current,
                idleDuration: idleTimeAccumulator.current,
                scrollDepthMax: stateRef.current.scrollDepthMax,
                scrollDepthAvg,
                totalScrollEvents: scrollEventCounter.current,
                totalVisibleTime,
                totalHiddenTime: hiddenTimeAccumulator.current,
                visibilityChanges: visibilityChangeCounter.current,
                isCompleted: stateRef.current.scrollDepthMax >= 80,
                isAbandoned: activeTimeAccumulator.current < 10,
            };

            try {
                const response = await fetch(
                    `/api/capture/study-session/${serverSessionId.current}`,
                    {
                        method: 'PATCH',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(updatePayload),
                    }
                );

                if (!response.ok) {
                    throw new Error(`HTTP ${response.status}`);
                }
            } catch (error) {
                console.warn('[StudyCapture] fetch failed, fallback to sendBeacon:', error);
                try {
                    navigator.sendBeacon(
                        `/api/capture/study-session/${serverSessionId.current}`,
                        new Blob([JSON.stringify(updatePayload)], { type: 'application/json' })
                    );
                } catch (beaconError) {
                    console.error('[StudyCapture] sendBeacon also failed:', beaconError);
                }
            }
        }

        forceFlush();

        if (isMountedRef.current) {
            setSessionState((prev) => ({
                ...prev,
                isActive: false,
                isIdle: false,
            }));
        }

        stateRef.current = {
            ...stateRef.current,
            isActive: false,
            isIdle: false,
        };

        serverSessionId.current = null;
        isEndingRef.current = false;
        hasStartedRef.current = false;
        isStartingRef.current = false;
    }, [materiId, pushEvent, forceFlush]);

    // Stable ref for cleanup
    const endStudyRef = useRef(endStudy);
    useEffect(() => {
        endStudyRef.current = endStudy;
    }, [endStudy]);

    return {
        startStudy,
        endStudy,
        sessionState,
        syncStatus,
    };
}