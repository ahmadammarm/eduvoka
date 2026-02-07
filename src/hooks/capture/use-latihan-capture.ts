'use client';

import { useCallback, useRef } from 'react';
import { useEventBuffer } from './use-event-buffer';
import type { LatihanCaptureContext } from '@/types/data-capture';

export function useLatihanCapture() {
    const { pushEvent, forceFlush, syncStatus } = useEventBuffer();
    const contextRef = useRef<LatihanCaptureContext | null>(null);
    const answerChangeCount = useRef(0);

    // Store pushEvent and forceFlush in refs to stabilize callbacks
    const pushEventRef = useRef(pushEvent);
    pushEventRef.current = pushEvent;
    const forceFlushRef = useRef(forceFlush);
    forceFlushRef.current = forceFlush;

    const initCapture = useCallback(
        (sessionId: string, materiId: string) => {
            // Prevent re-init for same session
            if (contextRef.current?.sessionId === sessionId) return;

            contextRef.current = {
                sessionId,
                materiId,
                currentSoalId: '',
                questionViewedAt: Date.now(),
                answerChanges: 0,
            };

            pushEventRef.current({
                type: 'SESSION_START',
                sessionRef: sessionId,
                payload: {
                    materiId,
                    startedAt: Date.now(),
                },
            });
        },
        [] // stable — no dependencies
    );

    const captureQuestionView = useCallback(
        (soalId: string, questionIndex: number, totalQuestions: number) => {
            if (!contextRef.current) return;
            // Prevent duplicate view events for same question
            if (contextRef.current.currentSoalId === soalId) return;

            // Capture time spent on previous question
            if (contextRef.current.currentSoalId) {
                const timeOnPrevious = Math.floor(
                    (Date.now() - contextRef.current.questionViewedAt) / 1000
                );

                pushEventRef.current({
                    type: 'QUESTION_NAVIGATE',
                    sessionRef: contextRef.current.sessionId,
                    payload: {
                        fromSoalId: contextRef.current.currentSoalId,
                        toSoalId: soalId,
                        timeOnPreviousSeconds: timeOnPrevious,
                        answerChangesOnPrevious: answerChangeCount.current,
                    },
                });
            }

            contextRef.current.currentSoalId = soalId;
            contextRef.current.questionViewedAt = Date.now();
            answerChangeCount.current = 0;

            pushEventRef.current({
                type: 'QUESTION_VIEW',
                sessionRef: contextRef.current.sessionId,
                payload: {
                    soalId,
                    questionIndex,
                    totalQuestions,
                    viewedAt: Date.now(),
                },
            });
        },
        [] // stable
    );

    const captureAnswerChange = useCallback(
        (soalId: string, pilihanId: string) => {
            if (!contextRef.current) return;

            answerChangeCount.current += 1;

            pushEventRef.current({
                type: 'ANSWER_CHANGE',
                sessionRef: contextRef.current.sessionId,
                payload: {
                    soalId,
                    pilihanId,
                    changeNumber: answerChangeCount.current,
                    timeSinceViewMs: Date.now() - contextRef.current.questionViewedAt,
                },
            });
        },
        [] // stable
    );

    const captureAnswerSubmit = useCallback(
        (
            soalId: string,
            pilihanId: string,
            isCorrect: boolean,
            timeSpentSeconds?: number
        ) => {
            if (!contextRef.current) return;

            const timeSinceViewMs = Date.now() - contextRef.current.questionViewedAt;
            const calculatedTimeSpent = timeSpentSeconds ?? Math.floor(timeSinceViewMs / 1000);

            pushEventRef.current({
                type: 'ANSWER_SUBMIT',
                sessionRef: contextRef.current.sessionId,
                payload: {
                    soalId,
                    materiId: contextRef.current.materiId,
                    pilihanId,
                    isCorrect,
                    timeSpentSeconds: calculatedTimeSpent,
                    answerChangesBeforeSubmit: answerChangeCount.current,
                    timeSinceViewMs,
                },
            });

            answerChangeCount.current = 0;
        },
        [] // stable
    );

    const captureAnswerSkip = useCallback(
        (soalId: string) => {
            if (!contextRef.current) return;

            const timeSinceViewMs = Date.now() - contextRef.current.questionViewedAt;

            pushEventRef.current({
                type: 'ANSWER_SKIP',
                sessionRef: contextRef.current.sessionId,
                payload: {
                    soalId,
                    materiId: contextRef.current.materiId,
                    timeSpentSeconds: Math.floor(timeSinceViewMs / 1000),
                    timeSinceViewMs,
                },
            });
        },
        [] // stable
    );

    const captureSessionComplete = useCallback(
        (result: {
            score: number;
            totalQuestions: number;
            correctCount: number;
            totalDurationSeconds: number;
        }) => {
            if (!contextRef.current) return;

            pushEventRef.current({
                type: 'SESSION_COMPLETE',
                sessionRef: contextRef.current.sessionId,
                payload: {
                    materiId: contextRef.current.materiId,
                    ...result,
                    completedAt: Date.now(),
                },
            });

            forceFlushRef.current();
            contextRef.current = null;
        },
        [] // stable
    );

    return {
        initCapture,
        captureQuestionView,
        captureAnswerChange,
        captureAnswerSubmit,
        captureAnswerSkip,
        captureSessionComplete,
        syncStatus,
    };
}