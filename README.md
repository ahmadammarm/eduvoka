# Spektrum Learn

Spectrum Learn is an adaptive e-learning platform designed to personalize the learning experience based on students’ individual learning styles, particularly the Visual, Auditory, and Kinesthetic (VAK) model.

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
fulusin/
├── src/
│   ├── app/            # Next.js app router pages
│   ├── components/     # Reusable React components
│   ├── lib/            # Core utilities and helpers
│   ├── provider/       # Next Auth and React Query Client provider configurations
│   ├── schemas/        # Form validation schemas
```

## Key Features
- VAK-Based Personalized Learning Content Delivery
- AI-Driven Adaptive Practice and Assessment (“Learn By AI”)
- Structured Interactive Discussion Forums
- Expert-Guided Problem Solving Sessions (Pro Players)

## Getting Started

1. Clone the repository:
```sh
git clone https://github.com/ahmadammarm/spektrum-learn.git
```

2. Navigate to the project directory:

```sh
cd spektrum-learn
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


5. Run development server:
```bash
pnpm dev
```

## Getting Started with Docker

1. Clone the repository:
```sh
git clone https://github.com/ahmadammarm/spektrum-learn.git
```

2. Navigate to the project directory:

```sh
cd spektrum-learn
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