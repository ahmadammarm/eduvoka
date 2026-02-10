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

## 4. Modular Responsibility: The 5 Pillars

### Tim Kita = 5 Orang, 1 Misi

> *"Kesuksesan kita bergantung pada sinkronisasi sempurna antara logika matematika/pedagogi dan implementasi kode."*

```
╔══════════════════════════════════════════════════════════════════════════╗
║                        TEAM RESPONSIBILITY MAP                            ║
╠══════════════════════════════════════════════════════════════════════════╣
║                                                                          ║
║                         ┌──────────────────┐                             ║
║                         │   🎯 TECH LEAD   │                             ║
║                         │   Backend &      │                             ║
║                         │   Integration    │                             ║
║                         └────────┬─────────┘                             ║
║                                  │                                       ║
║              ┌───────────────────┼───────────────────┐                   ║
║              │                   │                   │                   ║
║              ▼                   ▼                   ▼                   ║
║    ┌──────────────┐    ┌──────────────┐    ┌──────────────┐             ║
║    │  PERSON D    │    │  PERSON B    │    │  PERSON C    │             ║
║    │  Data &      │───▶│  AI & Prompt │───▶│  Frontend &  │             ║
║    │  Metrics     │    │  Specialist  │    │  UX          │             ║
║    └──────────────┘    └──────────────┘    └──────────────┘             ║
║           │                   │                   │                      ║
║           │                   │                   │                      ║
║           └───────────────────┼───────────────────┘                      ║
║                               ▼                                          ║
║                    ┌──────────────────┐                                  ║
║                    │   PERSON E       │                                  ║
║                    │   📐 Math &      │                                  ║
║                    │   Education      │                                  ║
║                    │   Expert         │                                  ║
║                    └──────────────────┘                                  ║
║                                                                          ║
╚══════════════════════════════════════════════════════════════════════════╝
```

**Kunci Kolaborasi:**
- Person E (Pedagogi) **memvalidasi** formula Person D (Metric) sebelum coding
- Person E **merancang** alur dialog PAPE yang diimplementasi Person B & C
- Tech Lead **mengintegrasikan** semua output menjadi sistem yang utuh

---

### 🎯 TECH LEAD: Backend & Integration Hub

**Mission:**  
*"Menjadi jembatan yang menyatukan setiap komponen menjadi sistem yang seamless."*

**Responsibilities:**
- Arsitektur API dan database schema design
- Integrasi antar modul (metrics → AI → frontend)
- Code review dan quality assurance
- Handle bottleneck dan edge cases
- Final integration testing

**Interface Contract:**

| Menerima Dari | Data |
|---------------|------|
| Person D | Schema proposals, metric endpoints |
| Person B | Gemini integration modules |
| Person C | Frontend components yang butuh API |
| Person E | Validasi akademis untuk diimplementasi |

| Memberikan Ke | Data |
|---------------|------|
| Semua Person | Unified API contracts, resolved conflicts |
| Production | Fully integrated system |

**Focus Area Week 1:**  
Database schema finalization + API route scaffolding + CI/CD setup

---

### 👤 PERSON B: AI & Prompt Specialist

**Mission:**  
*"Jadikan Gemini sebagai otak yang memahami siswa dan bicara seperti mentor."*

**Responsibilities:**
- Setup Gemini SDK (`@google/generative-ai`)
- Prompt engineering untuk Weakness Clustering
- Prompt engineering untuk Socratic dialogue (berdasarkan alur dari Person E)
- JSON parsing dan response validation

**Interface Contract:**

| Menerima Dari | Data |
|---------------|------|
| Person D | `wrongAnswers[]` dengan temporal context |
| Person E | Alur dialog PAPE yang sudah divalidasi akademis |
| Tech Lead | API contracts dan error handling patterns |

| Memberikan Ke | Data |
|---------------|------|
| Person C | `clusters[]`, Socratic responses untuk UI |
| Tech Lead | `src/lib/gemini.ts` module |

**🎬 Action Sekarang:**
1. Install `@google/generative-ai` 
2. Buat file `src/lib/gemini.ts` dengan basic setup
3. Tunggu draft alur PAPE dari Person E sebelum buat prompt Socratic

---

### 👤 PERSON C: Frontend & UX Specialist

**Mission:**  
*"Buat pengalaman yang siswa cintai — data kompleks dalam tampilan yang 'klik' dalam 3 detik."*

**Responsibilities:**
- Dashboard metrics visualization (Velocity chart, Burnout badge)
- Weakness cluster heatmap
- Socratic chat interface
- Responsive design & micro-interactions

**Interface Contract:**

| Menerima Dari | Data |
|---------------|------|
| Person D | `velocityScore`, `burnoutLevel`, mock data untuk development |
| Person B | `clusters[]`, `socraticResponse` |
| Person E | Guidance UX yang sesuai prinsip pedagogi |

| Memberikan Ke | Data |
|---------------|------|
| Tech Lead | React components yang production-ready |
| User Events | `{soalId, timestamp, action}` ke Person D |

**🎬 Action Sekarang:**
1. Setup komponen skeleton: `<VelocityChart>`, `<BurnoutBadge>`, `<ClusterMap>`
2. Buat mock data untuk development paralel
3. Koordinasi dengan Person E untuk chat UI yang "tidak menghakimi"

---

### 👤 PERSON D: Data & Metric Engineer

**Mission:**  
*"Ubah setiap klik dan detik menjadi insight yang terukur dan bermakna."*

**Responsibilities:**
- Extend Prisma schema (`SessionMetrics`, `AnswerEvent`)
- Data capture implementation di frontend hooks
- Kalkulasi Learning Velocity & Burnout Signal
- API endpoints untuk metrics

**Interface Contract:**

| Menerima Dari | Data |
|---------------|------|
| Person C | Raw events: `{soalId, timestamp, action, pilihanId}` |
| Person E | **Formula yang sudah divalidasi secara akademis** |
| Tech Lead | Database schema approval |

| Memberikan Ke | Data |
|---------------|------|
| Person B | `sessionData`, `wrongAnswers[]` dengan temporal patterns |
| Person C | `velocityScore`, `burnoutLevel`, `burnoutIndicators` |
| Tech Lead | `/api/metrics/calculate` endpoint |

**🎬 Action Sekarang:**
1. Draft Prisma schema extension
2. **TUNGGU validasi formula dari Person E** sebelum implementasi kalkulasi
3. Siapkan data capture hooks (struktur event logging)

---

### 📐 PERSON E: Math & Education Expert

**Mission:**  
*"Pastikan setiap angka dan setiap kata AI kita punya landasan akademis yang kuat."*

> ⚠️ **Critical Role:** Kamu adalah gatekeeper antara "terlihat bagus" dan "benar secara pedagogis".

**Responsibilities:**
- **Validasi formula** Learning Velocity & Burnout Signal (review draft Person D)
- **Rancang alur dialog PAPE** yang detail (untuk Person B implementasi ke prompt)
- **Review prompt Socratic** — pastikan AI tidak menggurui, tapi membimbing
- Konsultasi teori Kolb untuk adaptive learning flow

**Interface Contract:**

| Menerima Dari | Data |
|---------------|------|
| Person D | Draft formula (untuk validasi matematis) |
| Person B | Draft prompt (untuk validasi pedagogis) |
| Tech Lead | Requirements dan constraints teknis |

| Memberikan Ke | Data |
|---------------|------|
| Person D | ✅ Approved formula dengan penjelasan akademis |
| Person B | Alur PAPE detail: kapan Probe, kapan Persist, contoh kalimat |
| Person C | Guidelines UX: tone, wording, apa yang harus dihindari |

**🎬 Action Sekarang:**
1. **Review formula Velocity & Burnout** di `docs/learning-analytics-architecture.md`
2. **Tulis alur dialog PAPE** dalam format yang bisa jadi blueprint untuk Person B
3. Buat list "Do's and Don'ts" untuk AI responses

---

## 5. Implementation Checklist

### 🔥 SEBELUM ZOOM MEETING — Kerjakan Ini Dulu

| Person | Task Immediate | Output yang Diharapkan |
|--------|----------------|------------------------|
| **Tech Lead** | Review semua docs, setup project structure | Folder structure + base API routes |
| **Person B** | Install Gemini SDK, test basic call | Pastikan API key works |
| **Person C** | Create skeleton components dengan mock data | Dashboard bisa di-preview |
| **Person D** | Draft Prisma schema untuk `SessionMetrics` | PR ready untuk review |
| **Person E** | Review formula Velocity & Burnout | Written feedback / approval |

---

### 📅 Week 1: Foundation (P0 - Critical)

| Task | Owner | Depends On |
|------|-------|------------|
| Finalize Prisma schema | Tech Lead + Person D | Person E validates structure |
| Gemini SDK setup + test | Person B | API key configured |
| Data capture hooks | Person D | Schema approved |
| Dashboard skeleton | Person C | Mock data ready |
| Formula validation | Person E | Draft from architecture doc |
| PAPE dialogue blueprint | Person E | Own expertise |

### 📅 Week 2: Core Features (P1 - High)

| Task | Owner | Depends On |
|------|-------|------------|
| Velocity calculation | Person D | Formula approved by E |
| Burnout detection | Person D | Formula approved by E |
| Weakness Clustering prompt | Person B | PAPE blueprint from E |
| Velocity & Burnout charts | Person C | Person D provides real data |
| Socratic chat UI | Person C | Person B provides responses |
| Integration testing | Tech Lead | All modules connected |

### 📅 Week 3: Polish (P2 - Enhancement)

| Task | Owner |
|------|-------|
| i18n schema + translations | Tech Lead + Person C |
| Multi-language prompts | Person B |
| Progress timeline | Person C |
| Edge case handling | All |
| Final demo preparation | All |

---

## ⚡ Quick Reference: Data Types

```
VelocityScore     : number (0-100)
BurnoutLevel      : "NONE" | "MILD" | "MODERATE" | "SEVERE"
ClusterSeverity   : "low" | "medium" | "high" | "critical"
PAPEPhase         : "PROBE" | "ANALYZE" | "PERSIST" | "EVALUATE"
```

---

## 🤝 Closing: Kita Satu Tim

Teman-teman, kekuatan kita ada di keberagaman skill:
- **Person E** memastikan kita tidak hanya "keren" tapi **secara akademis benar**
- **Person D** mengubah teori E menjadi **angka yang bisa diukur**
- **Person B** mengubah angka menjadi **AI yang bicara seperti manusia**
- **Person C** mengemas semuanya menjadi **pengalaman yang siswa cintai**
- **Tech Lead** memastikan semua **bekerja bersama tanpa konflik**

> **Prinsip kita:**
> - Pedagogi dulu, baru kode
> - Validasi dulu, baru implementasi
> - Komunikasi terus, jangan asumsi

**VAK bilang: "Kamu tipe Visual."**  
**Kita bilang: "Kamu sedang berkembang, dan ini caranya."**

Mari kita buktikan bersama. 🚀

---

> **Document Version:** 2.0  
> **Prepared for:** Team Kickoff Meeting  
> **Team Size:** 5 People  
> **Date:** January 2026
