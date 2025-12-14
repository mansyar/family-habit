PRODUCT REQUIREMENTS DOCUMENT (PRD)
PROJECT NAME: Family Habit & Reward Game
VERSION: 1.2 (Dev Infrastructure Added)
AUDIENCE: AI Coding Agent / Solo Developer
PLATFORM: Web App (PWA-first with full offline support, multi-device)
LANGUAGE: English only (MVP)

==================================================

1. # PURPOSE & GOALS

1.1 Purpose
Build a family-focused habit and reward application that helps parents establish healthy routines for young children by using positive reinforcement, with clear role separation between parents and children.

1.2 Primary Goals

- Support daily habit building for children (~3 years old)
- Provide parents with control, insights, and analytics
- Allow safe child interaction without authentication complexity
- Support multiple devices per family
- Use secure, production-grade authentication for parents
- Provide a reproducible local development environment

  1.3 Non-Goals

- No public or social features
- No competitive elements
- No monetization in MVP
- No child-managed accounts

# ==================================================

2. USER ROLES & PERMISSIONS

2.1 Roles

Parent

- Authenticated user
- Full access to system features

Child

- Session-based role
- No authentication
- Limited interaction

  2.2 Permission Matrix

Parent:

- Login / logout
- Create and manage child profiles
- Add, edit, enable, disable tasks
- Confirm task completion
- View analytics dashboard
- Reset progress and rewards
- Manage app settings

Child:

- View assigned tasks
- View rewards and collections
- Watch animations
- Cannot modify data
- Cannot confirm tasks

# ==================================================

3. AUTHENTICATION & SESSION MODEL

3.1 Authentication Strategy

- Parent-only authentication
- Implemented using better-auth
- Secure session-based authentication
- Role enforced server-side

  3.2 Child Access Model

- Child never logs in
- Parent logs in first
- Parent explicitly starts a “Child Session”
- Child session is device-local and can be exited by parent

  3.3 Multi-Device Support

- Parents can log in on multiple devices
- Application data synced via backend database
- Child sessions do not persist across devices

# ==================================================

4. CORE CONCEPT

Children complete real-life tasks.
Parents confirm task completion.
System grants positive visual rewards.
Children interact only within a parent-authorized session.

Key principles:

- No failure states
- No negative feedback
- Parent retains control

# ==================================================

5. USER FLOWS

5.1 Parent Login Flow

1. Open app
2. Parent logs in via better-auth
3. Redirect to Parent Dashboard

5.2 Child Play Flow

1. Parent selects child profile
2. Parent starts Child Session
3. App switches to Child Mode UI
4. Child views tasks and rewards
5. Parent exits Child Mode

5.3 Task Completion Flow

1. Task completed in real life
2. Parent confirms completion
3. Reward animation triggered
4. Completion stored in database

# ==================================================

6. FEATURES (MVP)

6.1 Parent Dashboard

- Overview of today’s task completion
- Simple analytics per task
- Access to task and child management
- Entry point to start Child Session

  6.2 Analytics (Simple)

- Daily completion counts per task
- Weekly totals
- No streak pressure
- No comparative analytics

  6.3 Tasks
  Template tasks (available for parents to add):

- Brush teeth
- Clean toys
- Read a book
- Sleep on time
- Eat fruits

Task properties:

- id
- title
- icon
- frequency (daily | weekly)
- enabled
- createdBy (system | parent)

Parents can:

- Add from template tasks
- Add custom tasks
- Edit or disable any task

  6.4 Rewards System

- Stars (1 per completed task)
- Stickers unlocked after 5 stars (configurable threshold)
- 15 unique fun sticker designs for collection
- Rewards are purely visual
- Playful reward animations (star burst, confetti)

  6.5 Child Profiles

- id
- parentId
- name
- avatar (pre-defined animal icons)
- createdAt

# ==================================================

7. SCREENS & UI REQUIREMENTS

7.1 Authentication Screens

- Parent login
- Minimal error states

  7.2 Parent Dashboard

- Analytics cards
- Task management
- Child profile management

  7.3 Child Mode Screens

- Today’s Tasks (large cards)
- Rewards / Sticker Collection
- No navigation to parent areas

  7.4 Parent Settings

- Manage tasks
- Manage children
- App preferences
- Logout

# ==================================================

8. UI / UX RULES

Design Style:

- Playful & colorful aesthetic
- Bright primary colors with friendly accents
- Child-friendly visual language

Child Mode:

- Large touch targets
- Minimal text
- No scrolling
- Calm but playful animations
- One action per screen

Parent Mode:

- Clear layout
- Fast access to management actions
- No dark patterns

# ==================================================

9. DATA MODEL

User (Parent)

- id
- email
- passwordHash
- createdAt

Child

- id
- parentId
- name
- avatar
- createdAt

Task

- id
- title
- icon
- frequency
- enabled
- parentId (nullable for system tasks)

Completion

- id
- childId
- taskId
- date

Reward

- id
- childId
- type (star | sticker)
- unlockedAt

# ==================================================

10. TECHNICAL REQUIREMENTS

10.1 Application Stack

- Frontend: Next.js (App Router)
- Backend: Next.js Server Actions / API Routes
- Auth: better-auth
- Database: PostgreSQL
- ORM: Prisma
- Styling: Tailwind CSS
- Package Manager: pnpm

  10.2 Development Environment

- Entire dev environment must be runnable with Docker
- No local system dependencies required except Docker

  10.3 PWA Requirements

- Full offline support with service workers
- App manifest for "Add to Home Screen"
- Offline data caching with sync on reconnect
- Works without network after initial load

# ==================================================

11. CONTAINERIZATION REQUIREMENTS

11.1 Dockerfile (Application)

The project must include a Dockerfile that:

- Uses an official Node.js LTS base image
- Installs dependencies
- Builds the Next.js application
- Runs the app in production mode
- Exposes the application port

Dockerfile responsibilities:

- Multi-stage build (build + runtime)
- Environment variables injected at runtime
- Compatible with better-auth and Prisma

  11.2 Docker Compose (Development)

A docker-compose.yml file must be provided for local development that includes:

Services:

1. postgres
   - Official PostgreSQL image
   - Local development only
   - Persistent volume for data
   - Exposes port for local access (optional)

Environment variables:

- DATABASE_URL
- AUTH_SECRET
- APP_ENV=development

# ==================================================

12. DATABASE & MIGRATIONS

- Prisma used for schema definition
- Prisma migrations run against local PostgreSQL container
- Database schema must support multi-device usage
- No SQLite in development once Docker is enabled

# ==================================================

13. SECURITY & SAFETY

- Parent-only authentication via better-auth
- Secure password hashing and sessions
- No child credentials stored
- No analytics tracking
- No ads or external links
- All role checks enforced server-side

# ==================================================

14. EDGE CASES

- Parent logs out during child session → child session ends
- Network unavailable → app shows read-only state
- Multiple devices updating data → last-write-wins acceptable for MVP
- App restarted → authentication state restored

# ==================================================

15. MVP SUCCESS CRITERIA

- App runs with a single docker compose up
- Parent can authenticate securely
- Child cannot access parent features
- Custom tasks can be added easily
- Analytics visible in dashboard
- Works across multiple devices
- Calm and safe child experience

# ==================================================

16. FUTURE EXTENSIONS (OUT OF SCOPE)

- Production cloud deployment
- Advanced analytics
- Virtual pet rewards
- Native mobile apps
- Multi-parent roles (caregivers)

==================================================
END OF DOCUMENT
==================================================
