# Developer Onboarding Guide

This guide provides comprehensive instructions for setting up and working with the Eduvoka codebase. Please follow the outlined procedures to ensure a smooth onboarding experience.

## Overview

Eduvoka is an adaptive e-learning platform engineered to personalize learning experiences based on individual learning styles, with particular emphasis on the Visual, Auditory, and Kinesthetic (VAK) model. The platform utilizes artificial intelligence to deliver adaptive practice, interactive learning, and expert-guided problem-solving within a scalable web-based architecture.

### Core Features

- VAK-Based Personalized Learning Content Delivery
- AI-Driven Adaptive Practice and Assessment ("Learn By AI")
- Structured Interactive Discussion Forums
- Expert-Guided Problem Solving Sessions (Pro Players)

## Prerequisites

The following software must be installed prior to beginning the setup process:

### Required Software

- **Node.js** v20.0.0 or higher
- **pnpm** v8.0.0 or higher
- **MySQL** 8.0 or higher
- **Git** for version control
- **VS Code** (recommended) or alternative IDE

### Recommended VS Code Extensions

- ESLint
- Prettier - Code formatter
- Tailwind CSS IntelliSense
- Prisma
- TypeScript and JavaScript Language Features

## Environment Setup

### 1. Repository Cloning

Execute the following commands to clone the repository:

```bash
git clone https://github.com/ahmadammarm/eduvoka.git
cd eduvoka
```

### 2. Dependency Installation

Install project dependencies using pnpm:

```bash
pnpm install
```

### 3. Environment Configuration

Create a local environment file from the provided template:

```bash
cp .env.example .env
```

Configure the `.env` file with the appropriate values:

```env
# Database configuration
DATABASE_URL="mysql://username:password@localhost:3306/eduvoka"

# Authentication
NEXTAUTH_SECRET="your-secret-key"

# Google OAuth configuration
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# Gemini API Key
GEMINI_API_KEY="your-gemini-api-key"
```

### 4. Database Configuration

#### Database Creation

Execute the following SQL command to create the database:

```sql
CREATE DATABASE eduvoka;
```

#### Migration Execution

Apply database migrations:

```bash
pnpm prisma migrate dev
```

#### Database Seeding (Optional)

Populate the database with initial data:

```bash
pnpm prisma db seed
```

This command creates mock users and VAK quiz data for development purposes.

### 5. Prisma Client Generation

Generate the Prisma client:

```bash
pnpm prisma generate
```

## Application Execution

### Development Mode

Initiate the development server with hot-reload functionality:

```bash
pnpm dev
```

The application will be accessible at [http://localhost:3000](http://localhost:3000)

### Production Build

Build and execute the production version:

```bash
pnpm build
pnpm start
```

## Development Workflow

### 1. Branch Management Strategy

The project adheres to the GitFlow branching model:

- **`main`** - Production-ready code
- **`development`** - Primary development branch
- **`feat/*`** - New feature development
- **`bugfix/*`** - Bug resolution
- **`hotfix/*`** - Critical production fixes
- **`release/*`** - Release preparation
- **`chore/*`** - Maintenance tasks and build updates
- **`docs/*`** - Documentation updates
- **`refactor/*`** - Code refactoring without functional changes


### 2. Feature Development Process

Follow this procedure when developing new features:

```bash
# Create and checkout a new feature branch
git checkout -b feat/your-feature-name development

# Stage and commit changes
git add .
git commit -m "feat: add new feature description"

# Push to remote repository
git push origin feat/your-feature-name
```

### 3. Commit Message Standards

This project follows [Conventional Commits](https://www.conventionalcommits.org/) specifications:

- `feat:` - New feature implementation
- `fix:` - Bug resolution
- `docs:` - Documentation modifications
- `refactor:` - Code restructuring
- `chore:` - Build process or tooling changes

Examples:
```bash
git commit -m "feat: implement user profile page"
git commit -m "fix: resolve OAuth login issue"
git commit -m "docs: update developer onboarding guide"
```

### 4. Pull Request Protocol

Adhere to the following guidelines when submitting pull requests:

1. **Pull Request Format Requirements**:
   - Use the Pull Request template: [.github/PULL_REQUEST_TEMPLATE.md](.github/PULL_REQUEST_TEMPLATE.md)
   - Set the PR title in lowercase and start with one of: `feat:`, `bugfix:`, `refactor:`, `docs:`, `chore:`
   - Write a clear Description that explains context, changes, and impact
   - Complete every item in the checklist before submitting
   - Link related issues using `#issue-number` (e.g., `#123`)

2. **Automated CI Validation**:
   - Branch naming convention verification
   - Pull request title format validation (lowercase with approved prefix)
   - Build success verification

## Key Concepts

### Application Architecture

#### Frontend Architecture
- **Next.js App Router** - File-based routing system
- **Server Components** - Default rendering mode for optimized performance
- **Client Components** - Utilized for interactive features (designated with `'use client'`)
- **React Query** - Server state management and caching layer

#### Authentication Flow
1. User registration via email/password or Google OAuth
2. Session creation and database persistence
3. Protected route validation via middleware

#### API Structure
All API routes conform to RESTful conventions:
```
GET    /api/resource/route.ts          - Retrieve resource list
POST   /api/resource/route.ts          - Create new resource
GET    /api/resource/[id]/route.ts     - Retrieve single resource
PUT    /api/resource/[id]/route.ts     - Update existing resource
DELETE /api/resource/[id]/route.ts     - Delete resource
```

## Common Development Tasks

### Creating a New API Endpoint

Implement a new API route in `app/api/your-resource/route.ts`:

```typescript
import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
    const session = await auth();
    const user = session?.user;

    if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const result = // ... implementation

    return NextResponse.json({ data: result });
}
```

### Implementing a New Page

Create a page file in the appropriate directory:

```tsx
// app/your-page/page.tsx
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Page Title',
    description: 'Page description',
};

export default function YourPage() {
    return (
        <div>
            <h1>Your Page Content</h1>
        </div>
    );
}
```

### Generating a Database Migration

1. Modify the schema in `prisma/schema.prisma`
2. Create and apply the migration:

```bash
pnpm prisma migrate dev --name your_migration_name
```

### Component Development

Create reusable components in the `components/` directory:

```tsx
// components/ui/mode-toggle.tsx
interface ModeToggleProps {
    label: string;
    onClick: () => void;
}

export function ModeToggle({ label, onClick }: ModeToggleProps) {
    return (
        <button onClick={onClick} className="btn">
            {label}
        </button>
    );
}
```

## Troubleshooting

### Common Issues and Resolutions

#### Database Connection Error
```
Error: Can't reach database server
```
**Resolution**: Verify that MySQL is running and that credentials in `.env` are correct.

#### Prisma Client Not Found
```
Error: /generated/prisma/client did not initialize yet
```
**Resolution**: Execute `pnpm prisma generate`

#### Port Already in Use
```
Error: Port 3000 is already in use
```
**Resolution**: Terminate the existing process or specify an alternative port:
```bash
PORT=3001 pnpm dev
```

#### Module Not Found
```
Error: Cannot find module '@/...'
```
**Resolution**: Verify tsconfig.json path configurations and restart the development server.

#### Authentication Failure
**Resolution**:
1. Verify that `NEXTAUTH_SECRET` is properly configured
2. Confirm that `NEXTAUTH_URL` matches your domain
3. Clear browser cookies and retry

### Support Resources

1. Consult existing documentation in `/docs`
2. Search for similar issues in the GitHub repository
3. Contact the team via the designated Slack channel
4. Submit a GitHub issue for confirmed bugs

## Best Practices

### Code Quality Standards
1. Utilize TypeScript types consistently
2. Adhere to ESLint configuration
3. Compose descriptive commit messages
4. Maintain focused, single-purpose components
5. Extract reusable logic into custom hooks

### Performance Optimization
1. Default to Server Components
2. Implement lazy loading for resource-intensive components
3. Optimize images using Next.js Image component
4. Apply appropriate caching strategies
5. Monitor and optimize bundle size

### Security Considerations
1. Never commit sensitive credentials or data
2. Validate all user inputs
3. Utilize parameterized database queries
4. Implement proper authentication verification
5. Maintain current dependency versions

### Testing Guidelines
1. Develop tests for critical functionality
2. Include edge case scenarios
3. Use descriptive test case names
4. Ensure test isolation and independence
5. Mock external dependencies appropriately

## Next Steps

Upon completion of the setup process, consider the following actions:

1. **Explore the Codebase** - Familiarize yourself with the project structure and architecture
2. **Execute the Application** - Test various features from an end-user perspective
3. **Review the Backlog** - Identify issues labeled "good first issue"
4. **Participate in Team Meetings** - Engage in sprint planning and review sessions
5. **Request Clarification** - Seek assistance when needed

We welcome you to the Eduvoka development team and look forward to your contributions.