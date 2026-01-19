# 🚀 Eduvoka Team Kickoff Brief
### Google Gemini Hackathon - Learning Analytics Transformation

> *"Kita tidak hanya membangun aplikasi. Kita menciptakan pengalaman belajar yang memahami siswa lebih baik dari mereka memahami diri sendiri."*

---

## 1. The 'Big Pivot' Vision

### Mengapa Kita Bermigrasi?

```
┌──────────────────────────────────────────────────────────────────────────┐
│                                                                          │
│   🔴 KEMARIN (VAK System)              🟢 BESOK (Learning Analytics)    │
│                                                                          │
│   "Kamu Visual Learner,                "Kamu cenderung burnout di       │
│    jadi ini video untukmu"              menit ke-25. Mari istirahat      │
│                                         sebentar dan kita coba           │
│   ❌ Berbasis preferensi (asumsi)       pendekatan berbeda."             │
│   ❌ Satu tes → label selamanya                                          │
│   ❌ Tidak ada bukti ilmiah kuat        ✅ Berbasis DATA perilaku nyata  │
│                                         ✅ Adaptif setiap sesi           │
│                                         ✅ Backed by Learning Science    │
│                                                                          │
└──────────────────────────────────────────────────────────────────────────┘
```

### Visi Kompetisi Internasional

**VAK sudah outdated.** Riset pendidikan modern menunjukkan bahwa gaya belajar statis tidak efektif. Yang benar-benar mempengaruhi hasil belajar adalah:

1. **Kecepatan adaptasi** (Learning Velocity) - seberapa cepat siswa menguasai konsep baru
2. **Kondisi kognitif** (Burnout Detection) - kapan otak butuh istirahat
3. **Pola kesalahan** (Weakness Clustering) - di mana titik lemah yang perlu diperbaiki
4. **Dialog reflektif** (Socratic AI) - belajar melalui bertanya, bukan diberitahu

**Dengan Gemini AI, kita bisa melakukan semua ini secara real-time.**

---

## 2. High-Level System Map

### Alur Data: Dari Klik User Hingga Percakapan AI

```
╔══════════════════════════════════════════════════════════════════════════╗
║                         EDUVOKA DATA FLOW                                ║
╠══════════════════════════════════════════════════════════════════════════╣
║                                                                          ║
║  ┌─────────────────┐                                                     ║
║  │  👤 AKTIVITAS   │                                                     ║
║  │     USER        │                                                     ║
║  │                 │                                                     ║
║  │ • Jawab soal    │                                                     ║
║  │ • Ganti jawaban │                                                     ║
║  │ • Skip soal     │                                                     ║
║  │ • Waktu per Q   │                                                     ║
║  └────────┬────────┘                                                     ║
║           │                                                              ║
║           ▼                                                              ║
║  ┌─────────────────┐     ┌─────────────────┐                            ║
║  │  📊 METRIC      │     │  📈 OUTPUT      │                            ║
║  │     ENGINE      │────▶│                 │                            ║
║  │                 │     │ Learning        │                            ║
║  │ Hitung:         │     │ Velocity: 78.5  │                            ║
║  │ • Velocity      │     │                 │                            ║
║  │ • Burnout Score │     │ Burnout: MILD   │                            ║
║  │ • Time Patterns │     │ (score: 35)     │                            ║
║  └────────┬────────┘     └─────────────────┘                            ║
║           │                                                              ║
║           ▼                                                              ║
║  ┌─────────────────┐     ┌─────────────────┐                            ║
║  │  🤖 GEMINI      │     │  📋 OUTPUT      │                            ║
║  │     ANALYZER    │────▶│                 │                            ║
║  │                 │     │ Clusters:       │                            ║
║  │ Analisis:       │     │ • Silogisme ❌  │                            ║
║  │ • Error pattern │     │ • Aritmatika ✅ │                            ║
║  │ • Topic gaps    │     │ • Literal ⚠️   │                            ║
║  │ • Severity      │     │                 │                            ║
║  └────────┬────────┘     └─────────────────┘                            ║
║           │                                                              ║
║           ▼                                                              ║
║  ┌─────────────────┐     ┌─────────────────┐                            ║
║  │  💬 SOCRATIC    │     │  🎯 OUTPUT      │                            ║
║  │     AI TUTOR    │────▶│                 │                            ║
║  │                 │     │ "Menarik! Bisa  │                            ║
║  │ Metode PAPE:    │     │  ceritakan      │                            ║
║  │ • Probe (tanya) │     │  bagaimana kamu │                            ║
║  │ • Analyze       │     │  sampai pada    │                            ║
║  │ • Persist       │     │  jawaban itu?"  │                            ║
║  │ • Evaluate      │     │                 │                            ║
║  └─────────────────┘     └─────────────────┘                            ║
║                                                                          ║
╚══════════════════════════════════════════════════════════════════════════╝
```

### Ringkasan Alur

| Step | Input | Proses | Output |
|------|-------|--------|--------|
| 1 | Klik, waktu, perubahan jawaban | Metric Engine | Velocity & Burnout scores |
| 2 | Jawaban salah + konteks soal | Gemini Analyzer | Weakness clusters (JSON) |
| 3 | Cluster + dialog history | Socratic AI | Pertanyaan penuntun |
| 4 | Pemahaman baru siswa | Evaluation | Konfirmasi & next step |

---

## 3. The User Experience Story

### 🎭 Skenario: "Rina dan Silogisme yang Membingungkan"

> **Setting:** Rina, siswa kelas 12, baru saja menyelesaikan tryout TPS. Dia salah menjawab soal silogisme.

---

**📋 SOAL:**
> *Jika semua A adalah B, dan semua B adalah C, maka dapat disimpulkan bahwa...*

**Jawaban Rina:** "Semua C adalah A" ❌  
**Jawaban Benar:** "Semua A adalah C" ✅

---

#### 🔍 PHASE 1: PROBE (Menggali Pemikiran)

```
┌─────────────────────────────────────────────────────────────────┐
│ 🤖 EDUVOKA AI                                                   │
│                                                                 │
│ "Hai Rina! Saya lihat kamu sudah menyelesaikan sesi TPS.       │
│  Sebelum kita lanjut, boleh cerita sedikit tentang soal        │
│  silogisme tadi?                                                │
│                                                                 │
│  Jawaban yang kamu pilih adalah 'Semua C adalah A'.            │
│                                                                 │
│  🤔 Aku penasaran — apa yang membuat opsi itu terasa            │
│     paling masuk akal untukmu?"                                │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│ 👧 RINA                                                         │
│                                                                 │
│ "Hmm, soalnya kan ada A, B, dan C. Terus B itu kayak           │
│  jembatan yang menghubungkan A dan C. Jadi kupikir bisa        │
│  dibalik arahnya..."                                           │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

**💡 Apa yang terjadi:** AI tidak mengatakan "salah", tapi meminta Rina menjelaskan proses berpikirnya.

---

#### 🔬 PHASE 2: ANALYZE (Identifikasi Miskonsepsi)

```
   ┌────────────────────────────────────────────────────────────┐
   │ 🧠 INTERNAL AI ANALYSIS (tidak ditampilkan ke user)       │
   │                                                            │
   │ Miskonsepsi terdeteksi:                                    │
   │ • Rina memahami B sebagai "jembatan" ✅                    │
   │ • Tapi keliru bahwa hubungan bisa "dibalik" ❌             │
   │ • Tidak memahami konsep "subset" dalam silogisme           │
   │                                                            │
   │ Strategi: Gunakan analogi konkret untuk koreksi            │
   └────────────────────────────────────────────────────────────┘
```

---

#### 🔧 PHASE 3: PERSIST (Scaffolding Bertahap)

```
┌─────────────────────────────────────────────────────────────────┐
│ 🤖 EDUVOKA AI                                                   │
│                                                                 │
│ "Ah, saya paham pemikiranmu! Kamu melihat B sebagai            │
│  jembatan — itu benar sekali! 👍                                │
│                                                                 │
│  Sekarang, coba bayangkan seperti ini:                         │
│                                                                 │
│      🐱 Semua KUCING adalah HEWAN                               │
│      🐾 Semua HEWAN adalah MAKHLUK HIDUP                        │
│                                                                 │
│  Dengan logika yang sama...                                    │
│  Apakah berarti 'Semua MAKHLUK HIDUP adalah KUCING'? 🤔"       │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│ 👧 RINA                                                         │
│                                                                 │
│ "Oh! Tidak dong, karena ada banyak makhluk hidup lain          │
│  selain kucing. Ada anjing, pohon, ikan..."                    │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│ 🤖 EDUVOKA AI                                                   │
│                                                                 │
│ "Tepat sekali, Rina! 🎉                                         │
│                                                                 │
│  Jadi dalam silogisme, arah itu PENTING.                       │
│  A → B → C tidak sama dengan C → B → A                         │
│                                                                 │
│  Yang valid adalah: Semua KUCING adalah MAKHLUK HIDUP          │
│  (dari kecil ke besar, bukan sebaliknya)"                      │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

**💡 Apa yang terjadi:** AI menggunakan analogi sehari-hari untuk membantu Rina menemukan kesalahan sendiri.

---

#### ✅ PHASE 4: EVALUATE (Konfirmasi Pemahaman)

```
┌─────────────────────────────────────────────────────────────────┐
│ 🤖 EDUVOKA AI                                                   │
│                                                                 │
│ "Sekarang, dengan pemahaman baru ini, coba lihat kembali       │
│  soal aslinya:                                                  │
│                                                                 │
│  'Jika semua A adalah B, dan semua B adalah C...'              │
│                                                                 │
│  Menurutmu, arah mana yang valid untuk kesimpulannya?"         │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│ 👧 RINA                                                         │
│                                                                 │
│ "Ohhh! Jadi yang benar 'Semua A adalah C'!                     │
│  Karena A paling kecil, masuk ke B, masuk ke C yang            │
│  paling besar. Bukan dibalik!"                                 │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│ 🤖 EDUVOKA AI                                                   │
│                                                                 │
│ "Sempurna! 🌟 Kamu sudah memahami konsep subset dalam          │
│  silogisme.                                                     │
│                                                                 │
│  📊 Saya catat ini sebagai topik yang sudah kamu kuasai.       │
│  Mau lanjut ke latihan serupa, atau istirahat dulu?"           │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

### 🎯 Takeaway untuk Tim

| Fase | Yang AI Lakukan | Yang AI TIDAK Lakukan |
|------|-----------------|----------------------|
| Probe | Bertanya "bagaimana" dan "mengapa" | Langsung bilang "salah" |
| Analyze | Identifikasi root cause | Memberi label negatif |
| Persist | Berikan analogi & scaffolding | Langsung kasih jawaban |
| Evaluate | Minta siswa menyimpulkan sendiri | Menggurui |

---

## 4. Modular Responsibility: The 4 Pillars

### Tim Kita = 4 Orang, 4 Pilar Mandiri

```
╔══════════════════════════════════════════════════════════════════════════╗
║                        TEAM RESPONSIBILITY MAP                            ║
╠══════════════════════════════════════════════════════════════════════════╣
║                                                                          ║
║   ┌──────────────┐        ┌──────────────┐                              ║
║   │   PERSON A   │───────▶│   PERSON C   │                              ║
║   │   Metric     │ scores │   Dashboard  │                              ║
║   │   Engineer   │        │   Visualizer │                              ║
║   └──────────────┘        └──────────────┘                              ║
║          │                       ▲                                       ║
║          │ raw events            │ clusters                              ║
║          ▼                       │                                       ║
║   ┌──────────────┐        ┌──────────────┐                              ║
║   │   PERSON B   │───────▶│   PERSON D   │                              ║
║   │   Gemini     │clusters│   Socratic   │                              ║
║   │   Analyst    │        │   UI/Chat    │                              ║
║   └──────────────┘        └──────────────┘                              ║
║                                                                          ║
╚══════════════════════════════════════════════════════════════════════════╝
```

---

### 👤 PERSON A: Metric Engineer

**Mission:**  
*"Ubah setiap klik dan detik menjadi insight yang bisa diukur."*

**Responsibilities:**
- Implementasi data capture (waktu per soal, perubahan jawaban, skip events)
- Kalkulasi Learning Velocity score
- Deteksi Burnout Signal
- Extend Prisma schema untuk `SessionMetrics`

**Interface Contract:**

| Menerima Dari | Data | 
|---------------|------|
| Frontend | Raw events: `{soalId, timestamp, action, pilihanId}` |

| Memberikan Ke | Data |
|---------------|------|
| Person B | `sessionData` dengan temporal patterns |
| Person C | `velocityScore`, `burnoutLevel`, `burnoutIndicators` |

**Deliverable Week 1:**  
Schema `SessionMetrics` + API endpoint `/api/metrics/calculate`

---

### 👤 PERSON B: Gemini Analyst

**Mission:**  
*"Jadikan Gemini sebagai otak analitis yang memahami pola kelemahan siswa."*

**Responsibilities:**
- Setup Gemini SDK (`@google/generative-ai`)
- Buat prompt template untuk Weakness Clustering
- Parse dan validasi JSON response dari Gemini
- Store clusters ke database

**Interface Contract:**

| Menerima Dari | Data |
|---------------|------|
| Person A | `wrongAnswers[]` dengan konteks soal |

| Memberikan Ke | Data |
|---------------|------|
| Person C | `clusters[]` untuk visualisasi |
| Person D | `clusters[]` + `errorPatterns` untuk dialog AI |

**Deliverable Week 1:**  
File `src/lib/gemini.ts` + API `/api/analysis/weakness-cluster`

---

### 👤 PERSON C: Dashboard Visualizer

**Mission:**  
*"Tampilkan data kompleks menjadi visual yang siswa dan guru bisa pahami dalam 3 detik."*

**Responsibilities:**
- Komponen chart untuk Velocity trend
- Burnout indicator (color-coded badge)
- Weakness cluster visualization (topic heatmap)
- Progress timeline

**Interface Contract:**

| Menerima Dari | Data |
|---------------|------|
| Person A | `velocityScore`, `burnoutLevel` |
| Person B | `clusters[]` dengan severity |

| Memberikan Ke | Data |
|---------------|------|
| Person D | Selected cluster ID ketika user klik untuk deep-dive |

**Deliverable Week 1:**  
Komponen `<VelocityChart>` + `<BurnoutBadge>` + `<ClusterMap>`

---

### 👤 PERSON D: Socratic UI/Chat

**Mission:**  
*"Buat percakapan AI yang terasa seperti mentor, bukan robot."*

**Responsibilities:**
- Chat interface untuk Deep Inquiry
- Implementasi PAPE flow dalam UI
- System prompt untuk Socratic dialogue
- Conversation history management

**Interface Contract:**

| Menerima Dari | Data |
|---------------|------|
| Person B | `clusters[]`, `errorPatterns` |
| Person C | `selectedClusterId` untuk fokus dialogue |

| Memberikan Ke | Data |
|---------------|------|
| Database | `conversationHistory[]` |
| Person A | `masteredTopics[]` setelah evaluasi berhasil |

**Deliverable Week 1:**  
Komponen `<SocraticChat>` + API `/api/learning/deep-inquiry`

---

## 5. Implementation Checklist

### 🔴 P0 - Critical (Week 1)
*Tanpa ini, sistem tidak berjalan.*

| # | Task | Owner | Duration |
|---|------|-------|----------|
| 1 | Extend Prisma schema: `SessionMetrics`, `WeaknessCluster` | Person A | 2 days |
| 2 | Setup Gemini SDK + API key handling | Person B | 1 day |
| 3 | Implement data capture hooks di `UTBKTryout.tsx` | Person A | 2 days |
| 4 | Basic Gemini prompt + JSON parsing | Person B | 2 days |
| 5 | Skeleton UI untuk dashboard metrics | Person C | 2 days |

### 🟡 P1 - High Priority (Week 2)
*Core functionality yang membedakan kita.*

| # | Task | Owner | Duration |
|---|------|-------|----------|
| 6 | Learning Velocity calculation complete | Person A | 2 days |
| 7 | Burnout detection algorithm | Person A | 2 days |
| 8 | Weakness Clustering full implementation | Person B | 3 days |
| 9 | Velocity & Burnout charts | Person C | 2 days |
| 10 | Cluster heatmap visualization | Person C | 2 days |
| 11 | Socratic chat UI scaffolding | Person D | 2 days |
| 12 | PAPE system prompt implementation | Person D | 2 days |

### 🟢 P2 - Enhancement (Week 3+)
*Polish dan competitive advantage.*

| # | Task | Owner | Duration |
|---|------|-------|----------|
| 13 | i18n database schema | TBD | 3 days |
| 14 | Multi-language Gemini prompts | Person B | 2 days |
| 15 | Conversation history persistence | Person D | 2 days |
| 16 | Progress timeline component | Person C | 2 days |
| 17 | Mastered topics tracking | Person D | 2 days |
| 18 | UI translations (id/en) | Person C | 3 days |

---

## ⚡ Quick Reference: Data Types

Untuk menghindari miscommunication, ini adalah contract types yang kita sepakati:

```
VelocityScore     : number (0-100)
BurnoutLevel      : "NONE" | "MILD" | "MODERATE" | "SEVERE"
ClusterSeverity   : "low" | "medium" | "high" | "critical"
PAPEPhase         : "PROBE" | "ANALYZE" | "PERSIST" | "EVALUATE"
```

---

## 🎯 Closing Message

Tim, kita punya 3 minggu untuk membuktikan bahwa Learning Analytics bukan hanya buzzword. 

Setiap baris kode yang kalian tulis akan:
- Membantu siswa memahami diri mereka sendiri
- Mencegah burnout yang tidak perlu
- Memberikan feedback yang membangun, bukan menghakimi

**VAK bilang: "Kamu tipe Visual."**  
**Kita bilang: "Kamu sedang berkembang, dan ini caranya."**

Let's build something that matters. 🚀

---

> **Document Version:** 1.0  
> **Prepared for:** Team Kickoff Meeting  
> **Date:** January 2026
