# Voltcare-next

Voltcare-next is a Next.js consumer portal for electricity services. It provides
MSEDCL consumers with account access, complaint and service-request workflows,
request tracking, and an electricity bill calculator.

## Features

- Consumer registration and sign-in
- Submit and track electricity complaints
- Submit service requests and meter readings
- AI-assisted complaint analysis and support chat
- Admin complaint queue
- Electricity bill calculator
- Light and dark themes

## Tech stack

- Next.js 16 and React 19
- Prisma ORM with SQLite
- Tailwind CSS
- Google Gemini API for AI features

## Getting started

### Requirements

- Node.js compatible with the versions required by Next.js 16
- npm

### Install and configure

```bash
npm ci
```

Create `.env.local` in the project root and add a Google Gemini API key for the
AI-powered chat and complaint analysis:

```env
OPENAI_API_KEY=your_google_gemini_api_key
```

The application currently reads the Gemini key from `OPENAI_API_KEY`. Keep the
key private; `.env.local` is excluded from Git.

Create or update the local SQLite database from the Prisma schema:

```bash
npx prisma db push
```

Start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Useful commands

```bash
npm run dev       # Start the development server
npm run lint      # Run ESLint
npm run build     # Build for production
npm run start     # Start the production server
```

The Prisma schema is in [`prisma/schema.prisma`](./prisma/schema.prisma). The
local SQLite database is created at `prisma/dev.db`.
