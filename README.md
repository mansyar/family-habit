# Family Habit & Reward Game 🌟

A family-focused habit and reward application that helps parents establish healthy routines for young children using positive reinforcement.

## ✨ Features

### For Parents

- **Dashboard** - Overview of daily task completion with simple analytics
- **Task Management** - Create, edit, and manage habit tasks for children
- **Child Profiles** - Manage multiple child profiles with fun animal avatars
- **Analytics** - Daily and weekly completion tracking (no streak pressure!)
- **Settings** - Configure rewards threshold and app preferences

### For Children

- **Child Mode** - Large, friendly interface with minimal text
- **Visual Rewards** - Earn stars for completed tasks and unlock fun stickers
- **Sticker Collection** - 15 unique sticker designs to collect
- **Playful Animations** - Star bursts, confetti, and celebration effects

## 🛠️ Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org) (App Router)
- **Language**: TypeScript
- **Database**: PostgreSQL with [Prisma](https://prisma.io) ORM
- **Authentication**: [Better Auth](https://better-auth.com)
- **Styling**: [Tailwind CSS](https://tailwindcss.com)
- **PWA**: Full offline support with service workers
- **Package Manager**: pnpm

## 🚀 Getting Started

### Prerequisites

- [Docker](https://docker.com) and Docker Compose
- [Node.js](https://nodejs.org) 20+ (for local development without Docker)
- [pnpm](https://pnpm.io) package manager

### Quick Start with Docker

The entire development environment runs with a single command:

```bash
docker compose up
```

This starts:

- PostgreSQL database
- Next.js development server

### Local Development

1. **Clone and install dependencies**

   ```bash
   git clone <repository-url>
   cd family-habit
   pnpm install
   ```

2. **Set up environment variables**

   ```bash
   cp .env.local.example .env.local
   ```

   Edit `.env.local` with your configuration:

   - `DATABASE_URL` - PostgreSQL connection string
   - `BETTER_AUTH_SECRET` - Secret key for authentication
   - `BETTER_AUTH_URL` - Application URL

3. **Start the database** (if not using Docker)

   ```bash
   docker compose up postgres -d
   ```

4. **Run database migrations**

   ```bash
   pnpm prisma migrate dev
   ```

5. **Start the development server**

   ```bash
   pnpm dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) in your browser

## 📁 Project Structure

```
family-habit/
├── src/
│   ├── app/          # Next.js App Router pages
│   ├── components/   # Reusable UI components
│   ├── hooks/        # Custom React hooks
│   ├── lib/          # Utilities, auth, and database
│   └── types/        # TypeScript type definitions
├── prisma/           # Database schema and migrations
├── public/           # Static assets and PWA manifest
├── docs/             # Documentation (PRD, etc.)
└── docker-compose.yml
```

## 🔧 Available Scripts

| Command                   | Description              |
| ------------------------- | ------------------------ |
| `pnpm dev`                | Start development server |
| `pnpm build`              | Build for production     |
| `pnpm start`              | Start production server  |
| `pnpm lint`               | Run ESLint               |
| `pnpm prisma migrate dev` | Run database migrations  |
| `pnpm prisma studio`      | Open Prisma Studio       |

## 🔐 Authentication Model

- **Parents**: Secure authentication via Better Auth
- **Children**: Session-based access (no login required)
  - Parent initiates "Child Mode"
  - Child cannot access parent features
  - All data modifications require parent authentication

## 📱 PWA Support

This app is designed as a Progressive Web App:

- Works offline after initial load
- Add to Home Screen support
- Data syncs when connection is restored

## 📚 Documentation

- [Product Requirements Document](./docs/PRD.md) - Detailed project specifications

## 🤝 Design Principles

- **No failure states** - Children only see positive feedback
- **No negative reinforcement** - Focus on encouragement
- **Parent control** - Parents confirm all task completions
- **Child-safe** - No ads, analytics tracking, or external links
- **Calm experience** - Playful but not overstimulating

## 📄 License

Private project - All rights reserved.
