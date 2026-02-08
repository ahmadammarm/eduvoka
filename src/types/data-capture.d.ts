export type CaptureEventType =
    // Latihan Soal Events
    | 'SESSION_START'
    | 'SESSION_COMPLETE'
    | 'ANSWER_SUBMIT'
    | 'ANSWER_SKIP'
    | 'QUESTION_VIEW'
    | 'QUESTION_NAVIGATE'
    | 'ANSWER_CHANGE'   // user changed answer before submit

    // Study / Materi Events
    | 'STUDY_START'
    | 'STUDY_HEARTBEAT'
    | 'STUDY_END'
    | 'STUDY_SCROLL'
    | 'STUDY_VISIBILITY_CHANGE'
    | 'STUDY_IDLE_START'
    | 'STUDY_IDLE_END';

export interface CaptureEvent {
    id: string;                       // client-generated unique ID
    type: CaptureEventType;
    userId?: string;                  // filled by hook if available
    timestamp: number;                // Date.now()
    sessionRef?: string;              // LatihanSession.id or StudySession.id
    payload: Record<string, unknown>;
}

export interface BufferConfig {
    maxSize: number;              // max events before forced flush
    flushIntervalMs: number;      // periodic flush interval
    maxLocalStorageBytes: number; // cap localStorage usage
    retryBaseDelayMs: number;     // initial retry delay
    retryMaxDelayMs: number;      // max retry delay (exponential backoff cap)
    retryMaxAttempts: number;     // max retry attempts before dropping batch
}

export interface SyncStatus {
    isPending: boolean;
    lastSyncAt: number | null;
    failedAttempts: number;
    nextRetryAt: number | null;
    queuedEvents: number;
}

export interface StudySessionState {
    sessionId: string | null;
    materiId: string;
    isActive: boolean;
    isVisible: boolean;
    isIdle: boolean;
    startedAt: number;
    totalActiveTime: number;     // seconds
    totalIdleTime: number;       // seconds
    totalHiddenTime: number;     // seconds
    totalScrollEvents: number;   // count
    visibilityChanges: number;   // count
    scrollDepthMax: number;      // 0-100
    scrollDepthCurrent: number;  // 0-100
    scrollDepthSum: number;      // sum of all scroll depth readings (for avg calculation)
    scrollDepthReadings: number; // count of scroll depth readings
    lastActivityAt: number;      // timestamp
}

export interface LatihanCaptureContext {
    sessionId: string;
    materiId: string;
    currentSoalId: string;
    questionViewedAt: number;    // timestamp when current question was first shown
    answerChanges: number;       // count of answer changes before submit
}

export interface EventSyncPayload {
    events: CaptureEvent[];
    clientTimestamp: number;
    batchId: string;
}

export interface EventSyncResponse {
    success: boolean;
    processed: number;
    batchId: string;
}