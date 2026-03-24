# LibraryOS — AI-Powered Library Management System

A full-featured library management system with integrated AI capabilities. Built with Next.js 15, Clerk, Neon (PostgreSQL), Prisma, and Google Gemini.

## Live Demo

> Deploy your own instance following the setup guide below.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 15 (App Router) + TypeScript |
| Auth | Clerk (Google, GitHub SSO; role-based access) |
| Database | Neon (serverless PostgreSQL) + Prisma ORM |
| UI | Tailwind CSS v4 + shadcn/ui |
| AI | Google Gemini (free tier) via Vercel AI SDK |
| Validation | Zod |
| Data fetching | TanStack Query v5 |
| Deploy | Vercel |

---

## Features

### Core
- **Book catalog** — Full CRUD with search, filters, and pagination
- **Loan system** — Check-out / check-in with due dates and status tracking (Active / Returned / Overdue)
- **Member management** — Role-based access: ADMIN, LIBRARIAN, MEMBER
- **Dashboard** — Real-time stats and recent activity

### AI Features (Google Gemini)
1. **AI Librarian Chatbot** — Streaming chat with access to the real catalog
2. **Smart Book Enrichment** — Auto-fills synopsis, genres, themes, and reading level from title + author
3. **Mood-Based Recommendations** — 8 moods → 3 personalized book recommendations
4. **Reading DNA** — Unique reader profile generated from loan history
5. **AI Analytics Insights** — Weekly narrative, proactive alerts, and trend predictions
6. **Natural Language Search** — Search the catalog using plain English queries

### Role Permissions

| Feature | ADMIN | LIBRARIAN | MEMBER |
|---------|-------|-----------|--------|
| View catalog | ✅ | ✅ | ✅ |
| Add / edit / delete books | ✅ | ✅ | ❌ |
| Check out on behalf of others | ✅ | ✅ | ❌ |
| Check out own books | ✅ | ✅ | ✅ |
| View all loans | ✅ | ✅ | Own only |
| Manage members | ✅ | ❌ | ❌ |
| Change roles | ✅ | ❌ | ❌ |
| AI features | ✅ | ✅ | ✅ |
| Full analytics | ✅ | ✅ | ❌ |

---

## Local Setup

### Prerequisites
- Node.js >= 20.9.0 (recommended: v22)
- Accounts on: [Clerk](https://clerk.com), [Neon](https://neon.tech), [Google AI Studio](https://aistudio.google.com)

```bash
nvm use 22  # if using nvm
```

### 1. Clone and install

```bash
git clone https://github.com/alejandro2096/library-management.git
cd library-management
npm install
```

### 2. Environment variables

```bash
cp .env.example .env.local
```

Fill in `.env.local`:

```env
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/
CLERK_WEBHOOK_SECRET=whsec_...

# Database (Neon PostgreSQL)
DATABASE_URL="postgresql://..."

# Google Gemini API (free at aistudio.google.com)
GOOGLE_GENERATIVE_AI_API_KEY=AIza...

# App URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 3. Set up Clerk

1. Create an app at [clerk.com](https://clerk.com)
2. Enable **Google** and **GitHub** SSO
3. Copy `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` and `CLERK_SECRET_KEY` to `.env.local`
4. Go to **Developers → Webhooks**, create an endpoint:
   - URL: `https://your-domain.com/api/webhooks/clerk`
   - Events: `user.created`, `user.updated`, `user.deleted`
5. Copy the **Signing Secret** as `CLERK_WEBHOOK_SECRET`

> For local development, use [localtunnel](https://localtunnel.me) to expose your local server:
> ```bash
> npx localtunnel --port 3000
> ```

### 4. Set up Neon PostgreSQL

1. Create a project at [neon.tech](https://neon.tech)
2. Copy the **connection string** as `DATABASE_URL`

### 5. Set up Google Gemini

1. Go to [aistudio.google.com](https://aistudio.google.com)
2. Click **"Get API key" → "Create API key in new project"** (important: use a new project for free tier access)
3. Copy the key as `GOOGLE_GENERATIVE_AI_API_KEY`

### 6. Initialize the database

```bash
npm run db:push    # Apply Prisma schema to the DB
npm run db:seed    # Load 20 sample books
```

Also copy `DATABASE_URL` to `.env` (Prisma CLI reads from `.env`):
```bash
# .env
DATABASE_URL="postgresql://..."
```

### 7. Run

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000), sign up, then assign yourself ADMIN:

```bash
npm run db:studio
# Go to Member table → change your role to ADMIN
```

---

## Deployment (Vercel)

1. Push this repo to GitHub
2. Import the project at [vercel.com](https://vercel.com)
3. Add all environment variables from `.env.local` in the Vercel dashboard
4. Update `NEXT_PUBLIC_APP_URL` to your Vercel URL
5. Update the Clerk webhook URL to `https://your-app.vercel.app/api/webhooks/clerk`
6. Deploy

---

## Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Production build
npm run db:push      # Apply schema to DB
npm run db:seed      # Load sample data
npm run db:studio    # Open Prisma Studio
```

---

## Project Structure

```
src/
├── app/
│   ├── (auth)/           # Sign in / Sign up pages
│   ├── (dashboard)/      # All dashboard pages
│   │   ├── layout.tsx    # Sidebar + header layout
│   │   ├── page.tsx      # Dashboard home + stats
│   │   ├── books/        # Book CRUD
│   │   ├── loans/        # Loan management
│   │   ├── members/      # ADMIN only
│   │   ├── analytics/    # AI insights
│   │   └── ai/           # Chatbot + Mood + Reading DNA
│   └── api/              # API routes
├── components/           # UI components
├── lib/                  # DB, AI, auth, utils
├── hooks/                # TanStack Query hooks
├── types/                # TypeScript types
└── middleware.ts         # Clerk auth middleware
```
