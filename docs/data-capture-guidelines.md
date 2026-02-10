# EDUVOKA — Frontend Data Capture Hooks


## Daftar Isi

- [Arsitektur](#arsitektur)
- [Hooks yang Tersedia](#hooks-yang-tersedia)
  - [useEventBuffer](#1-useeventbuffer)
  - [useLatihanCapture](#2-uselatihanCapture)
  - [useStudyCapture](#3-usestudycapture)
- [API Endpoints](#api-endpoints)
- [Database Schema](#database-schema)
- [Integrasi UI Materi](#panduan-integrasi-ui-materi)
  - [Setup Dasar](#setup-dasar)
  - [Konfigurasi Lanjutan](#konfigurasi-lanjutan)
- [Catatan Penting](#catatan-penting)

---

### Event yang Di-Capture

| Sumber | Event yang Dicatat |
|--------|-------------------|
| **Latihan Soal** | Session start/complete, question view, answer submit/skip/change, navigasi antar soal |
| **Belajar Materi** | Study start/end, scroll depth, idle detection, visibility (tab active/inactive), heartbeat periodik |

### Alur Data

```
User Interaction
      │
      ▼
Hook (useLatihanCapture / useStudyCapture)
      │
      ▼
useEventBuffer.pushEvent()
      │
      ├──► localStorage (immediate persist, throttled 2 detik)
      │
      ▼
Buffer penuh (50 events) ATAU 30 detik interval ATAU page unload
      │
      ▼
POST /api/capture/sync ──► Tabel RawEventLog
      │
      ├── Success: clear buffer + localStorage
      └── Failed: exponential backoff (2s → 4s → 8s → ... → 120s max, 5 tries)
```

---

## Arsitektur

```
src/hooks/capture/
├── index.ts                  # Unified export
├── use-event-buffer.ts       # Core engine: batching, offline-first, retry
├── use-latihan-capture.ts    # Wrapper untuk latihan soal events
└── use-study-capture.ts      # Wrapper untuk study/materi events

src/app/api/capture/
├── sync/
│   └── route.ts              # POST — Menerima batch events
└── study-session/
    ├── route.ts              # POST — Buat study session baru
    └── [sessionId]/
        └── route.ts          # PATCH/POST — Update study session

src/types/
└── data-capture.d.ts         # Type definitions
```

---

## Hooks yang Tersedia

### 1. `useEventBuffer`

> **Core engine** — Tidak perlu digunakan langsung kecuali membuat custom capture hook.

Engine internal yang menangani:
- **Batching**: Mengumpulkan events, kirim sekaligus
- **Offline-first**: Simpan ke `localStorage`, sync saat online
- **Exponential backoff**: Jika server error, retry dengan jeda meningkat
- **Auto-flush**: Saat buffer penuh (50), interval (30s), atau page unload (`sendBeacon`)
- **Storage cap**: Maksimal 500KB di localStorage, trim otomatis jika melebihi

#### API

```typescript
const { pushEvent, forceFlush, syncStatus, getBufferSize } = useEventBuffer();
```

| Return | Type | Deskripsi |
|--------|------|-----------|
| `pushEvent` | `(event) => CaptureEvent` | Tambahkan event ke buffer |
| `forceFlush` | `() => Promise<void>` | Paksa kirim semua events sekarang |
| `syncStatus` | `SyncStatus` | Status sinkronisasi saat ini |
| `getBufferSize` | `() => number` | Jumlah events di buffer |

#### SyncStatus

```typescript
interface SyncStatus {
    isPending: boolean;         // Sedang mengirim?
    lastSyncAt: number | null;  // Timestamp sync terakhir berhasil
    failedAttempts: number;     // Jumlah percobaan gagal berturut
    nextRetryAt: number | null; // Kapan retry berikutnya
    queuedEvents: number;       // Jumlah events menunggu
}
```

---

### 2. `useLatihanCapture`

> Wrapper untuk menangkap events dari flow latihan soal. **Sudah terintegrasi** di `src/app/dashboard/latihan-soal/[materiId]/practice/page.tsx`.

#### API

```typescript
const {
    initCapture,
    captureQuestionView,
    captureAnswerChange,
    captureAnswerSubmit,
    captureAnswerSkip,
    captureSessionComplete,
    syncStatus,
} = useLatihanCapture();
```

| Method | Parameter | Event Type | Kapan Dipanggil |
|--------|-----------|------------|-----------------|
| `initCapture` | `(sessionId, materiId)` | `SESSION_START` | Saat session latihan dibuat |
| `captureQuestionView` | `(soalId, index, total)` | `QUESTION_VIEW` + `QUESTION_NAVIGATE` | Saat berpindah soal |
| `captureAnswerChange` | `(soalId, pilihanId)` | `ANSWER_CHANGE` | Saat user mengubah pilihan jawaban |
| `captureAnswerSubmit` | `(soalId, pilihanId, isCorrect, timeSpent)` | `ANSWER_SUBMIT` | Saat jawaban di-submit |
| `captureAnswerSkip` | `(soalId)` | `ANSWER_SKIP` | Saat soal di-skip |
| `captureSessionComplete` | `({ score, totalQuestions, correctCount, totalDurationSeconds })` | `SESSION_COMPLETE` | Saat sesi selesai |

#### Catatan Integrasi

- `initCapture` memiliki **dedup guard** — memanggil ulang dengan `sessionId` yang sama tidak akan membuat event duplikat
- `captureQuestionView` memiliki **dedup guard** — memanggil ulang dengan `soalId` yang sama tidak akan membuat event duplikat
- Semua callbacks **stable** (tidak berubah antar render) — aman digunakan di dependency `useEffect`
- `captureAnswerSkip` menghitung `timeSpentSeconds` otomatis dari waktu question pertama kali dilihat

---

### 3. `useStudyCapture`

> **Ini yang digunakan untuk fitur Materi.** Menangkap study time, scroll progress, idle detection, dan visibility.

#### API

```typescript
const {
    startStudy,
    endStudy,
    sessionState,
    syncStatus,
} = useStudyCapture({
    materiId: string;                                    // WAJIB
    scrollContainerRef?: React.RefObject<HTMLElement>;    // Opsional
    idleTimeoutMs?: number;                              // Default: 60000 (60 detik)
    heartbeatIntervalMs?: number;                        // Default: 30000 (30 detik)
});
```

#### Parameter

| Parameter | Type | Default | Deskripsi |
|-----------|------|---------|-----------|
| `materiId` | `string` | — | **Wajib.** ID materi dari tabel `Materi` |
| `scrollContainerRef` | `RefObject<HTMLElement>` | `window` | Elemen scrollable untuk tracking scroll depth. Jika tidak diisi, menggunakan `window` |
| `idleTimeoutMs` | `number` | `60000` | Durasi tanpa aktivitas sebelum dianggap idle (ms) |
| `heartbeatIntervalMs` | `number` | `30000` | Interval heartbeat saat user aktif (ms) |

#### Return

| Return | Type | Deskripsi |
|--------|------|-----------|
| `startStudy` | `() => Promise<void>` | Mulai sesi belajar — buat session di server, mulai tracking |
| `endStudy` | `() => void` | Akhiri sesi belajar — kirim summary, update server |
| `sessionState` | `StudySessionState` | State real-time sesi belajar |
| `syncStatus` | `SyncStatus` | Status sinkronisasi events |

#### StudySessionState

```typescript
interface StudySessionState {
    sessionId: string | null;   // ID dari server (atau client-generated fallback)
    materiId: string;           // ID materi
    isActive: boolean;          // Apakah sesi aktif?
    isVisible: boolean;         // Apakah tab browser aktif?
    isIdle: boolean;            // Apakah user idle (tidak ada aktivitas)?
    startedAt: number;          // Timestamp mulai
    totalActiveTime: number;    // Total detik aktif (exclude idle)
    totalIdleTime: number;      // Total detik idle
    scrollDepthMax: number;     // Scroll depth tertinggi (0-100%)
    scrollDepthCurrent: number; // Scroll depth saat ini (0-100%)
    lastActivityAt: number;     // Timestamp aktivitas terakhir
}
```

#### Events yang Di-Generate

| Event Type | Kapan | Data Payload |
|------------|-------|-------------|
| `STUDY_START` | `startStudy()` dipanggil | `materiId`, `startedAt` |
| `STUDY_HEARTBEAT` | Setiap 30 detik (jika aktif & visible) | `totalActiveTimeSeconds`, `totalIdleTimeSeconds`, `scrollDepthMax`, `scrollDepthCurrent`, `isVisible` |
| `STUDY_SCROLL` | User scroll (debounced 500ms) | `scrollDepth`, `scrollDepthMax` |
| `STUDY_VISIBILITY_CHANGE` | Tab active/inactive | `isVisible`, `totalActiveTimeSoFar` |
| `STUDY_IDLE_START` | 60 detik tanpa aktivitas | `idleStartedAt`, `totalActiveTimeBeforeIdle` |
| `STUDY_IDLE_END` | Aktivitas terdeteksi setelah idle | `idleDurationSeconds` |
| `STUDY_END` | `endStudy()` dipanggil atau komponen unmount | `totalActiveTimeSeconds`, `totalIdleTimeSeconds`, `scrollDepthMax`, `sessionDurationSeconds` |

#### Deteksi Aktivitas

Hook ini mendeteksi aktivitas user melalui event berikut:
- `mousemove`, `keydown`, `scroll`, `touchstart`, `click`

Jika **tidak ada satupun** event di atas selama `idleTimeoutMs` (default 60 detik), user dianggap **idle** dan waktu idle tidak dihitung sebagai study time aktif.

#### Deteksi Visibility

Menggunakan `document.visibilityState`. Jika user pindah tab atau minimize browser:
- Waktu **tidak dihitung** sebagai active time
- Event `STUDY_VISIBILITY_CHANGE` dicatat
- Saat kembali, timer dilanjutkan

#### Auto-cleanup

Jika komponen yang menggunakan `useStudyCapture` di-unmount saat sesi masih aktif, hook akan otomatis:
1. Mengirim event `STUDY_END`
2. Update study session di server via `sendBeacon` (reliable saat page unload)
3. Flush semua events di buffer

---

## API Endpoints

### `POST /api/capture/sync`

Menerima batch events dari frontend.

**Request:**
```json
{
    "events": [
        {
            "id": "evt_1770374384180_abc1234",
            "type": "STUDY_START",
            "timestamp": 1770374384180,
            "sessionRef": "cmabc123...",
            "payload": { "materiId": "materi-pu-001", "startedAt": 1770374384180 }
        }
    ],
    "clientTimestamp": 1770374384200,
    "batchId": "batch_1770374384200_xyz5678"
}
```

**Response:**
```json
{
    "success": true,
    "processed": 1,
    "batchId": "batch_1770374384200_xyz5678"
}
```

### `POST /api/capture/study-session`

Buat study session baru di server.

**Request:**
```json
{ "materiId": "materi-pu-001" }
```

**Response:**
```json
{ "sessionId": "cmlarc55y0001..." }
```

### `PATCH /api/capture/study-session/[sessionId]`

Update study session saat selesai.

**Request:**
```json
{
    "totalDuration": 340,
    "idleDuration": 60,
    "scrollDepthMax": 92.5,
    "isCompleted": true,
    "isAbandoned": false
}
```

### `POST /api/capture/study-session/[sessionId]`

Sama dengan PATCH — fallback untuk `sendBeacon` yang hanya mendukung POST.

---

## Database Schema

### Tabel `RawEventLog`

Menyimpan **semua** raw events dari frontend.

| Column | Type | Deskripsi |
|--------|------|-----------|
| `id` | `String` | CUID primary key |
| `userId` | `String` | Foreign key ke `User` |
| `eventType` | `String` | e.g., `STUDY_START`, `ANSWER_SUBMIT` |
| `payload` | `Text` | JSON stringified event data |
| `timestamp` | `DateTime` | Waktu event terjadi (dari client) |
| `sessionRef` | `String?` | Referensi ke `LatihanSession.id` atau `StudySession.id` |
| `synced` | `Boolean` | Selalu `true` saat sudah di DB |

### Tabel `StudySession`

Menyimpan summary per sesi belajar materi.

| Column | Type | Deskripsi |
|--------|------|-----------|
| `id` | `String` | CUID primary key |
| `userId` | `String` | Foreign key ke `User` |
| `materiId` | `String` | Foreign key ke `Materi` |
| `startedAt` | `DateTime` | Waktu mulai |
| `endedAt` | `DateTime?` | Waktu selesai |
| `totalDuration` | `Int` | Detik aktif belajar (exclude idle) |
| `idleDuration` | `Int` | Detik idle terdeteksi |
| `scrollDepthMax` | `Float` | Scroll depth tertinggi (0-100) |
| `scrollDepthAvg` | `Float` | Rata-rata scroll position |
| `totalScrollEvents` | `Int` | Jumlah scroll events |
| `totalVisibleTime` | `Int` | Detik tab aktif |
| `totalHiddenTime` | `Int` | Detik tab tersembunyi |
| `visibilityChanges` | `Int` | Berapa kali toggle tab |
| `isCompleted` | `Boolean` | `true` jika scroll depth ≥ 80% |
| `isAbandoned` | `Boolean` | `true` jika active time < 10 detik |

---

## Integrasi UI Materi

### Setup Dasar

Untuk mengintegrasikan data capture di halaman materi, hanya butuh **satu hook**: `useStudyCapture`.


> **Cukup panggil `startStudy()` dan `endStudy()`.** Scroll tracking, idle detection, visibility, heartbeat — semuanya otomatis.

---

### Konfigurasi Lanjutan

#### 1. Scroll Tracking di Container Khusus

Jika konten materi berada di dalam container scrollable (bukan window scroll):

```tsx
const contentRef = useRef<HTMLDivElement>(null);

const { startStudy, endStudy, sessionState } = useStudyCapture({
    materiId,
    scrollContainerRef: contentRef,
});

return (
    <div ref={contentRef} className="overflow-y-auto h-[calc(100vh-64px)]">
        {/* konten materi */}
    </div>
);
```

Jika menggunakan **window scroll** (halaman biasa tanpa container):

```tsx
// Tidak perlu scrollContainerRef — otomatis pakai window
const { startStudy, endStudy, sessionState } = useStudyCapture({
    materiId,
});
```

#### 2. Custom Idle Timeout

Untuk materi video/konten panjang dimana user mungkin diam lebih lama:

```tsx
const { startStudy, endStudy, sessionState } = useStudyCapture({
    materiId,
    idleTimeoutMs: 120_000, // 2 menit baru dianggap idle
});
```

#### 3. Menampilkan Study Stats

`sessionState` di-update **setiap detik** saat sesi aktif:

```tsx
// Real-time stats
<p>Aktif: {sessionState.totalActiveTime} detik</p>
<p>Idle: {sessionState.totalIdleTime} detik</p>
<p>Scroll: {sessionState.scrollDepthMax}%</p>
<p>Tab visible: {sessionState.isVisible ? 'Ya' : 'Tidak'}</p>
<p>Idle: {sessionState.isIdle ? 'Ya' : 'Tidak'}</p>
```

#### 4. Menentukan "Selesai" Membaca

Secara default, materi dianggap `isCompleted` jika scroll depth ≥ 80%. Logika ini ada di hook saat `endStudy()`:

```typescript
// Di dalam use-study-capture.ts
isCompleted: stateRef.current.scrollDepthMax >= 80,
isAbandoned: activeTimeAccumulator.current < 10,
```

Jika ingin custom logic, bisa cek `sessionState.scrollDepthMax` sebelum memanggil `endStudy()`.

---

## Catatan Penting

### Important things

1. **`materiId` harus valid** — harus ada di tabel `Materi`. Jika tidak, `POST /api/capture/study-session` akan return 404, tapi hook tetap berjalan dengan client-generated session ID sebagai fallback.

2. **Jangan panggil `startStudy()` di render** — selalu panggil di event handler atau `useEffect`. Hook sudah di-design agar `startStudy` dan `endStudy` stable (tidak berubah antar render).

3. **Satu instance per halaman** — Jangan gunakan multiple `useStudyCapture` di halaman yang sama karena masing-masing membuat `useEventBuffer` sendiri.

4. **Data yang masuk ke `RawEventLog` adalah raw** — belum di-aggregate. Jangan query tabel ini untuk dashboard user. Gunakan `StudySession` untuk summary.

### Unimportant things

- Tidak perlu handle `beforeunload` sendiri — hook sudah handle
- Tidak perlu manual sync/flush — otomatis
- Tidak perlu tracking multi-tab — di luar scope
- Tidak perlu handle mobile differently — di luar scope saat ini
- Tidak perlu conditional render berdasarkan `paketUser` — belum ditentukan

---

## Troubleshooting

### Events tidak masuk ke database

1. Cek browser console — apakah ada error `[EventBuffer] Sync failed`?
2. Cek Network tab — apakah `POST /api/capture/sync` return 200?
3. Cek apakah user sudah login (session NextAuth aktif)
4. Cek localStorage key `eduvoka_event_buffer` — apakah events tertahan di sana?

### RAM tinggi / browser lambat

1. Pastikan **tidak ada infinite loop** di `useEffect`. Semua callback dari hook ini sudah stable (empty deps).
2. Jangan letakkan `sessionState` sebagai dependency di `useEffect` yang memanggil fungsi capture — ini akan loop karena `sessionState` update setiap detik.

**Salah:**
```tsx
useEffect(() => {
    if (sessionState.isActive) {
        // do something with capture
    }
}, [sessionState]); // sessionState berubah setiap detik!
```

**Benar:**
```tsx
useEffect(() => {
    startStudy();
    return () => endStudy();
}, [startStudy, endStudy]); // stable references
```

### Duplikat events di database

Hook sudah memiliki dedup guard:
- `initCapture` — skip jika `sessionId` sama
- `captureQuestionView` — skip jika `soalId` sama

Jika masih ada duplikat, cek apakah komponen di-mount ulang (React Strict Mode di development mount 2x — ini normal, di production hanya 1x).

### localStorage penuh

Hook otomatis trim 30% events terlama jika melebihi 500KB. Jika masih bermasalah, panggil `forceFlush()` secara manual atau kurangi `maxLocalStorageBytes` di config.

---

## Event Type Reference

```typescript
type CaptureEventType =
    // Latihan Soal
    | 'SESSION_START'
    | 'SESSION_COMPLETE'
    | 'ANSWER_SUBMIT'
    | 'ANSWER_SKIP'
    | 'QUESTION_VIEW'
    | 'QUESTION_NAVIGATE'
    | 'ANSWER_CHANGE'

    // Study / Materi
    | 'STUDY_START'
    | 'STUDY_HEARTBEAT'
    | 'STUDY_END'
    | 'STUDY_SCROLL'
    | 'STUDY_VISIBILITY_CHANGE'
    | 'STUDY_IDLE_START'
    | 'STUDY_IDLE_END';
```
