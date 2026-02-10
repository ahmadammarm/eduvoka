'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import type {
    CaptureEvent,
    BufferConfig,
    SyncStatus,
    EventSyncPayload,
} from '@/types/data-capture';

const DEFAULT_CONFIG: BufferConfig = {
    maxSize: 50,
    flushIntervalMs: 30_000,
    maxLocalStorageBytes: 512_000,
    retryBaseDelayMs: 2_000,
    retryMaxDelayMs: 120_000,
    retryMaxAttempts: 5,
};

const STORAGE_KEY = 'eduvoka_event_buffer';

function generateBatchId(): string {
    return `batch_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

function loadFromStorage(): CaptureEvent[] {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) return [];
        const parsed = JSON.parse(raw);
        return Array.isArray(parsed) ? parsed : [];
    } catch {
        localStorage.removeItem(STORAGE_KEY);
        return [];
    }
}

function saveToStorage(events: CaptureEvent[], maxBytes: number): boolean {
    try {
        const serialized = JSON.stringify(events);
        const size = new Blob([serialized]).size;

        if (size > maxBytes) {
            const trimmed = events.slice(Math.floor(events.length * 0.3));
            localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed));
            console.warn(
                `[EventBuffer] Storage exceeded ${maxBytes}B. Trimmed ${events.length - trimmed.length} oldest events.`
            );
            return true;
        }

        localStorage.setItem(STORAGE_KEY, serialized);
        return true;
    } catch (e) {
        console.error('[EventBuffer] Failed to save to localStorage:', e);
        return false;
    }
}

function clearStorage(): void {
    try {
        localStorage.removeItem(STORAGE_KEY);
    } catch {
        // silently fail
    }
}

export function useEventBuffer(config: Partial<BufferConfig> = {}) {
    const cfgRef = useRef({ ...DEFAULT_CONFIG, ...config });
    const cfg = cfgRef.current;

    const bufferRef = useRef<CaptureEvent[]>([]);
    const isFlushingRef = useRef(false);
    const failedAttemptsRef = useRef(0);
    const retryTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const flushIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
    const saveThrottleRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const isInitializedRef = useRef(false);

    // Use ref for sync status to avoid re-renders on every push
    const syncStatusRef = useRef<SyncStatus>({
        isPending: false,
        lastSyncAt: null,
        failedAttempts: 0,
        nextRetryAt: null,
        queuedEvents: 0,
    });

    // Only expose syncStatus as state for components that need to display it
    const [syncStatusState, setSyncStatusState] = useState<SyncStatus>(syncStatusRef.current);

    // Update both ref and state — but state update is debounced
    const statusUpdateTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const updateSyncStatus = useCallback((updater: (prev: SyncStatus) => SyncStatus) => {
        syncStatusRef.current = updater(syncStatusRef.current);

        // Debounce state updates to prevent render storms
        if (statusUpdateTimerRef.current) return;
        statusUpdateTimerRef.current = setTimeout(() => {
            setSyncStatusState({ ...syncStatusRef.current });
            statusUpdateTimerRef.current = null;
        }, 500);
    }, []);

    // Load persisted events on mount
    useEffect(() => {
        if (isInitializedRef.current) return;
        isInitializedRef.current = true;

        const persisted = loadFromStorage();
        if (persisted.length > 0) {
            bufferRef.current = [...persisted, ...bufferRef.current];
            updateSyncStatus((prev) => ({
                ...prev,
                queuedEvents: bufferRef.current.length,
            }));
        }
    }, [updateSyncStatus]);

    const flush = useCallback(async () => {
        if (isFlushingRef.current || bufferRef.current.length === 0) return;

        isFlushingRef.current = true;
        updateSyncStatus((prev) => ({ ...prev, isPending: true }));

        const eventsToSync = [...bufferRef.current];
        const syncedIds = new Set(eventsToSync.map((e) => e.id));
        const batchId = generateBatchId();

        try {
            const payload: EventSyncPayload = {
                events: eventsToSync,
                clientTimestamp: Date.now(),
                batchId,
            };

            const response = await fetch('/api/capture/sync', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                throw new Error(`Sync failed: ${response.status}`);
            }

            // Remove synced events by ID
            bufferRef.current = bufferRef.current.filter(
                (e) => !syncedIds.has(e.id)
            );

            if (bufferRef.current.length > 0) {
                saveToStorage(bufferRef.current, cfg.maxLocalStorageBytes);
            } else {
                clearStorage();
            }

            failedAttemptsRef.current = 0;
            updateSyncStatus(() => ({
                isPending: false,
                lastSyncAt: Date.now(),
                failedAttempts: 0,
                nextRetryAt: null,
                queuedEvents: bufferRef.current.length,
            }));
        } catch (error) {
            console.error('[EventBuffer] Sync failed:', error);

            saveToStorage(bufferRef.current, cfg.maxLocalStorageBytes);

            failedAttemptsRef.current += 1;

            if (failedAttemptsRef.current >= cfg.retryMaxAttempts) {
                console.error(
                    `[EventBuffer] Max retries (${cfg.retryMaxAttempts}) reached. Events preserved in localStorage.`
                );
                failedAttemptsRef.current = 0;
                updateSyncStatus((prev) => ({
                    ...prev,
                    isPending: false,
                    failedAttempts: 0,
                    nextRetryAt: null,
                    queuedEvents: bufferRef.current.length,
                }));
            } else {
                const delay = Math.min(
                    cfg.retryBaseDelayMs * Math.pow(2, failedAttemptsRef.current - 1),
                    cfg.retryMaxDelayMs
                );
                const nextRetryAt = Date.now() + delay;

                updateSyncStatus((prev) => ({
                    ...prev,
                    isPending: false,
                    failedAttempts: failedAttemptsRef.current,
                    nextRetryAt,
                    queuedEvents: bufferRef.current.length,
                }));

                retryTimeoutRef.current = setTimeout(() => {
                    flush();
                }, delay);
            }
        } finally {
            isFlushingRef.current = false;
        }
    }, [cfg, updateSyncStatus]);

    // Stable ref for flush
    const flushRef = useRef(flush);
    useEffect(() => {
        flushRef.current = flush;
    }, [flush]);

    // Periodic flush
    useEffect(() => {
        flushIntervalRef.current = setInterval(() => {
            if (bufferRef.current.length > 0 && !isFlushingRef.current) {
                flushRef.current();
            }
        }, cfg.flushIntervalMs);

        return () => {
            if (flushIntervalRef.current) {
                clearInterval(flushIntervalRef.current);
            }
        };
    }, [cfg.flushIntervalMs]);

    // Flush on page unload
    useEffect(() => {
        const handleBeforeUnload = () => {
            if (bufferRef.current.length > 0) {
                saveToStorage(bufferRef.current, cfg.maxLocalStorageBytes);

                try {
                    const payload: EventSyncPayload = {
                        events: bufferRef.current,
                        clientTimestamp: Date.now(),
                        batchId: generateBatchId(),
                    };
                    navigator.sendBeacon(
                        '/api/capture/sync',
                        new Blob([JSON.stringify(payload)], {
                            type: 'application/json',
                        })
                    );
                } catch {
                    // localStorage is safety net
                }
            }
        };

        window.addEventListener('beforeunload', handleBeforeUnload);
        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
        };
    }, [cfg.maxLocalStorageBytes]);

    // Throttled save
    const throttledSave = useCallback(() => {
        if (saveThrottleRef.current) return;

        saveThrottleRef.current = setTimeout(() => {
            saveToStorage(bufferRef.current, cfg.maxLocalStorageBytes);
            saveThrottleRef.current = null;
        }, 2_000);
    }, [cfg.maxLocalStorageBytes]);

    // pushEvent — NO setState calls to prevent re-render loops
    const pushEvent = useCallback(
        (event: Omit<CaptureEvent, 'id' | 'timestamp'>) => {
            const fullEvent: CaptureEvent = {
                ...event,
                id: `evt_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`,
                timestamp: Date.now(),
            };

            bufferRef.current.push(fullEvent);

            // Throttled persist — no state update here
            throttledSave();

            // Update ref only (no re-render)
            syncStatusRef.current = {
                ...syncStatusRef.current,
                queuedEvents: bufferRef.current.length,
            };

            // Auto-flush if buffer is full
            if (bufferRef.current.length >= cfg.maxSize) {
                flushRef.current();
            }

            return fullEvent;
        },
        [cfg.maxSize, throttledSave]
    );

    const forceFlush = useCallback(() => {
        saveToStorage(bufferRef.current, cfg.maxLocalStorageBytes);
        return flushRef.current();
    }, [cfg.maxLocalStorageBytes]);

    // Cleanup
    useEffect(() => {
        return () => {
            if (retryTimeoutRef.current) clearTimeout(retryTimeoutRef.current);
            if (flushIntervalRef.current) clearInterval(flushIntervalRef.current);
            if (saveThrottleRef.current) clearTimeout(saveThrottleRef.current);
            if (statusUpdateTimerRef.current) clearTimeout(statusUpdateTimerRef.current);
            if (bufferRef.current.length > 0) {
                saveToStorage(bufferRef.current, cfg.maxLocalStorageBytes);
            }
        };
    }, [cfg.maxLocalStorageBytes]);

    return {
        pushEvent,
        forceFlush,
        syncStatus: syncStatusState,
        getBufferSize: () => bufferRef.current.length,
    };
}