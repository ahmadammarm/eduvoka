# Eduvoka

Eduvoka is an adaptive e-learning platform designed to personalize learning experiences based on students’ individual learning styles, particularly the Visual, Auditory, and Kinesthetic (VAK) model. The platform leverages artificial intelligence to deliver adaptive practice, interactive learning, and expert-guided problem-solving in a scalable web-based system.

## Tech Stack

- **Framework**: Next.js 16
- **Language**: TypeScript
- **Styling**: TailwindCSS
- **UI Components**: shadcn/ui
- **Database**: MySQL with Prisma ORM
- **Authentication**: Next Auth with Credentials and Google OAuth
- **State Management**: React Query
- **Form Handling**: React Hook Form with Zod for validation
- **Containerization**: Docker(optional)

## Project Structure

```
eduvoka/
├── docs/				   # Detailed documentation files 
├── prisma/
│   ├── schema.prisma      # Prisma database schema
│   ├── migrations/        # Database migrations
│
├── src/
│   ├── app/               # Next.js App Router pages
│   ├── components/        # Reusable UI components
│   ├── lib/               # Core utilities (db, auth, helpers)
│   ├── providers/         # NextAuth & React Query providers
│   ├── schemas/           # Zod validation schemas
│
├── docker-compose.yml
├── .env.example
├── package.json

```

## Key Features
- VAK-Based Personalized Learning Content Delivery
- AI-Driven Adaptive Practice and Assessment (“Learn By AI”)
- Structured Interactive Discussion Forums
- Expert-Guided Problem Solving Sessions (Pro Players)

## Getting Started

1. Clone the repository:
```sh
git clone https://github.com/ahmadammarm/eduvoka.git
```

2. Navigate to the project directory:

```sh
cd eduvoka
```

3. Install dependencies:
```bash
pnpm install
```

4. Configure Environment Variable: Copy the file `.env.example` to `.env` and adjust it to your configuration:

```sh
cp .env.example .env
```

```
# Database config
DATABASE_URL="mysql://username:password@localhost:3306/mydb"

# Authentication
NEXTAUTH_SECRET="your-secret-key"

# Google OAuth config
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# Gemini API Key
GEMINI_API_KEY="your-gemini-api-key"
```

5. Prisma Setup:
```bash
pnpm prisma generate
pnpm prisma migrate dev
```


6. Run development server:
```bash
pnpm dev
```

## Getting Started with Docker

1. Clone the repository:
```sh
git clone https://github.com/ahmadammarm/eduvoka.git
```

2. Navigate to the project directory:

```sh
cd eduvoka
```

3. Run the Docker Compose:

```sh
docker-compose up
```

or run in detach mode:
```sh
docker-compose up -d
```

4. To stop the Docker Compose:
```sh
docker-compose down
```

Open [http://localhost:3000](http://localhost:3000) to view the application.


## Build and Deployment

```bash
# Production build
pnpm build

# Start production server
pnpm start
```

### How to Contribute?
Please follow the workflow below to keep the codebase clean and consistent.

### Branch Strategy

- main → Production branch
- development → Active development branch (staging env)
- feat/* → New features
- refactor/* New improvements without remove old functionallity

### Contribution Steps

1. Clone the repository:
```sh
git clone https://github.com/ahmadammarm/eduvoka.git
```

2. Checkout to the develop branch
```sh
git checkout development
```

3. Create a new branch
```sh
git checkout -b feat/your-feature-name
```

4. Make your changes
5. Commit with a clear and descriptive message
6. Push your new branch
7. Open a Pull Request to the development branch

Do not submit pull requests directly to the main branch!

## Detailed Documentation

For more detailed information, please refer to the following documents:

| Document | Description |
|----------|-------------|
| [**Developer Guidelines**](docs/developer-guidelines.md) | Comprehensive onboarding guide for new developers, including setup instructions, and core concepts. |
| [**Changelog Guidelines**](docs/changelog-guidelines.md) | Procedures for maintaining and updating the project changelog. |
| [**Releases Overview**](docs/releases-overview.md) | Guidelines for versioning and the release management. |

Made with enthusiasm by the Eduvoka Development Team.