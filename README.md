# Eduvoka Platform  

<div align="center">

**An adaptive e-learning platform that personalizes learning based on individual styles, tailored for SMA UTBK preparation with targeted practice, tryouts, and progress tracking.**

[![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748?logo=prisma)](https://www.prisma.io/)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)

[Features](#-features) • [Tech Stack](#-tech-stack) • [Quick Start](#-quick-start) • [Documentation](#-documentation) • [Contributing](#-contributing)

</div>

---

## 📖 About

Eduvoka is an intelligent e-learning platform that leverages the **Visual, Auditory, and Kinesthetic (VAK)** learning model to deliver personalized educational experiences. Using artificial intelligence, the platform adapts to each student's unique learning style, providing tailored practice exercises, interactive discussions, and expert-guided problem-solving sessions.

## ✨ Features

- 🎯 **VAK-Based Personalization** - Content delivery adapted to Visual, Auditory, and Kinesthetic learning styles
- 🤖 **AI-Driven Learning** - Adaptive practice, assessments, and UTBK tryouts powered by artificial intelligence
- 📝 **UTBK Tryout Simulation** - Full-length mock exams with timed sections, realistic scoring, answer explanations, and post-exam analytics
- 💬 **Interactive Forums** - Structured discussion boards for collaborative learning
- 👨‍🏫 **Expert Guidance** - Pro Player sessions for advanced problem-solving support
- 📊 **Progress Tracking** - Monitor learning progress, performance analytics, and detailed tryout score reports
- 🔐 **Secure Authentication** - Multiple authentication methods including Google OAuth

## 🛠 Tech Stack

| Category | Technology |
|----------|-----------|
| **Framework** | Next.js 16 with App Router |
| **Language** | TypeScript |
| **Styling** | TailwindCSS + shadcn/ui |
| **Database** | TiDB Cloud MySQL-based with Prisma ORM |
| **Authentication** | NextAuth (Credentials + Google OAuth) |
| **State Management** | React Query (TanStack Query) and Zustand |
| **Form Handling** | React Hook Form + Zod |
| **AI Integration** | Google Gemini API |
| **Containerization** | Docker & Docker Compose |

## 📁 Project Structure

```
eduvoka/
├── docs/                  # Documentation files
│   ├── developer-guidelines.md
│   ├── changelog-guidelines.md
│   └── releases-overview.md
│
├── prisma/
│   ├── schema.prisma     # Database schema
│   └── migrations/       # Database migrations
│
├── src/
│   ├── app/              # Next.js App Router pages
│   ├── components/       # Reusable UI components
│   ├── lib/              # Core utilities (db, auth, helpers)
│   ├── providers/        # Context providers (NextAuth, React Query)
│   └── schemas/          # Zod validation schemas
│
├── public/               # Static assets
├── .github/              # GitHub workflows and templates
├── docker-compose.yml    # Docker configuration
├── .env.example          # Environment variables template
└── package.json          # Dependencies and scripts
```

## 🚀 Quick Start

### Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** 20.x or higher
- **pnpm** (recommended) or npm
- **MySQL** 8.x or higher
- **Git**

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/ahmadammarm/eduvoka.git
   cd eduvoka
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` with your configuration:
   ```env
   # Database
   DATABASE_URL="mysql://username:password@localhost:3306/eduvoka"

   # NextAuth
   NEXTAUTH_URL="http://localhost:3000"
   NEXTAUTH_SECRET="your-secret-key-here"

   # Google OAuth
   GOOGLE_CLIENT_ID="your-google-client-id"
   GOOGLE_CLIENT_SECRET="your-google-client-secret"

   # AI Integration
   GEMINI_API_KEY="your-gemini-api-key"
   ```

4. **Set up the database**
   ```bash
   pnpm prisma generate
   pnpm prisma migrate dev
   ```

5. **Run the development server**
   ```bash
   pnpm dev
   ```

6. **Open your browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000)

### 🐳 Docker Setup (Alternative)

If you prefer using Docker:

1. **Clone the repository**
   ```bash
   git clone https://github.com/ahmadammarm/eduvoka.git
   cd eduvoka
   ```

2. **Start with Docker Compose**
   ```bash
   # Run in foreground
   docker-compose up

   # Or run in detached mode
   docker-compose up -d
   ```

3. **Stop the containers**
   ```bash
   docker-compose down
   ```

The application will be available at [http://localhost:3000](http://localhost:3000)

## 📜 Available Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start development server |
| `pnpm build` | Build for production |
| `pnpm start` | Start production server |
| `pnpm lint` | Run ESLint |
| `pnpm prisma studio` | Open Prisma Studio (Database GUI) |
| `pnpm prisma migrate dev` | Create and apply migrations |
| `pnpm prisma generate` | Generate Prisma Client |

## 📚 Documentation

For detailed information about the project, please refer to our comprehensive documentation:

| Document | Description |
|----------|-------------|
| [**Developer Guidelines**](docs/developer-guidelines.md) | Complete onboarding guide for new developers, including setup, architecture, and core concepts |
| [**Changelog Guidelines**](docs/changelog-guidelines.md) | Standards and procedures for maintaining the project changelog |
| [**Releases Overview**](docs/releases-overview.md) | Version management and release workflow guidelines |

## 🤝 Contributing

We welcome contributions from the community! Please follow these guidelines to maintain code quality and consistency.

### Branch Strategy

| Branch | Purpose |
|--------|---------|
| `main` | Production-ready code (protected) |
| `development` | Active development & staging environment |
| `feat/*` | New features |
| `fix/*` | Bug fixes |
| `hotfix/*` | Urgent production fixes |
| `refactor/*` | Code improvements without changing functionality |
| `docs/*` | Documentation updates |
| `chore/*` | Maintenance tasks |

### Contribution Workflow

1. **Fork and clone the repository**
   ```bash
   git clone https://github.com/your-username/eduvoka.git
   cd eduvoka
   ```

2. **Create a feature branch from `development`**
   ```bash
   git checkout development
   git pull origin development
   git checkout -b feat/your-feature-name
   ```

3. **Make your changes**
   - Write clean, maintainable code
   - Follow the existing code style
   - Add tests if applicable
   - Update documentation as needed

4. **Commit your changes**
   ```bash
   git add .
   git commit -m "feat: add new feature description"
   ```
   
   Follow [Conventional Commits](https://www.conventionalcommits.org/) format:
   - `feat:` New feature
   - `fix:` Bug fix
   - `docs:` Documentation changes
   - `refactor:` Code refactoring
   - `chore:` Maintenance tasks

5. **Update CHANGELOG.md**
   
   Add your changes under the `[Unreleased]` section following the format in the existing changelog.

6. **Push to your fork**
   ```bash
   git push origin feat/your-feature-name
   ```

7. **Create a Pull Request**
   - Open a PR against the `development` branch
   - Provide a clear description of your changes
   - Reference any related issues
   - Wait for code review and CI checks

### ⚠️ Important Notes

- **Never submit PRs directly to `main`** - all contributions must go through `development`
- **Update CHANGELOG.md** - required for all PRs
- **Follow branch naming conventions** - PRs with incorrect branch names will be rejected
- **Write meaningful commit messages** - helps with code review and changelog generation
- **Ensure CI passes** - all checks must be green before merging


## 📄 License

This project is licensed under the Proprietary License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments
Brewed ☕ by the **Eduvoka Development Team**

---

<div align="center">

**[Website](https://eduvoka.com)** • **[Documentation](docs/)** • **[Report Bug](https://github.com/ahmadammarm/eduvoka/issues)** • **[Request Feature](https://github.com/ahmadammarm/eduvoka/issues)**

</div>
