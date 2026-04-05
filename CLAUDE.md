# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

JobFlow CRM — a job application tracker with a NestJS backend and Next.js frontend, organized as a monorepo with `backend/` and `frontend/` directories.

## Commands

### Backend (NestJS + Prisma + PostgreSQL)
```bash
cd backend
pnpm install
pnpm run start:dev          # dev server (watch mode), runs on :3001
pnpm run build              # production build
pnpm run test               # unit tests (Jest)
pnpm run test:e2e           # e2e tests
pnpm run lint               # eslint with --fix
pnpm run format             # prettier
npx prisma migrate dev      # run migrations
npx prisma generate         # regenerate Prisma client
```

### Frontend (Next.js 16 + React 19 + Tailwind 4)
```bash
cd frontend
pnpm install
pnpm run dev                # dev server (webpack mode)
pnpm run build              # production build
pnpm run lint               # eslint
```

**Important:** Frontend uses Next.js 16 which has breaking changes from earlier versions. Check `node_modules/next/dist/docs/` for current API docs before making assumptions.

## Architecture

### Backend — NestJS modular architecture
- **Database:** PostgreSQL via Prisma ORM (`backend/prisma/schema.prisma`)
- **Auth:** JWT + Passport (`auth/` module), bcrypt for passwords
- **Modules:** `auth`, `users`, `vacancies`, `prisma`, `health`
- **Models:** `User` (uuid, email, passwordHash, role) and `Types` (uuid, title, company, status enum, notes, userId FK)
- **Types pipeline statuses:** `SAVED → APPLIED → SCREENING → INTERVIEW → OFFER → REJECTED`

### Frontend — Feature-Sliced Design (FSD)
```
frontend/src/
├── app/          # Next.js App Router pages & layouts
├── entities/     # Domain entities (vacancy model, VacancyCard)
├── features/     # Feature logic (CreateVacancyForm, VacanciesToolbar, auth store)
├── shared/       # API clients, utils, constants
├── widgets/      # Composite UI blocks
└── lib/          # General utilities
```

- **State management:** Zustand (auth store)
- **Auth flow:** JWT stored in localStorage, AuthProvider initializes on mount
- **API base URL:** `NEXT_PUBLIC_API_URL` env var (defaults to `http://localhost:3001`)
- **Styling:** Tailwind CSS (utility classes, no component library)

### API Endpoints (consumed by frontend)
- `POST /auth/login` → `{ accessToken, user }`
- `POST /auth/register`
- `GET /users/me` (Bearer token)
- `GET/POST /vacancies`, `PATCH/DELETE /vacancies/:id` (Bearer token)
