# JobFlow CRM

Job application tracker with a Kanban board and pipeline management.

## Screenshots

![Kanban Board](https://github.com/user-attachments/assets/c265a219-2569-4293-b029-5dbddba1bd48)

![Dashboard](https://github.com/user-attachments/assets/6d2e85fa-f150-4e02-9ebf-1621dc6942a9)

## Features

- Kanban board with drag-and-drop
- List and board view modes
- AI-powered vacancy analysis
- Search and status filtering
- JWT Auth (access/refresh tokens)
- Create, edit, delete vacancies

## Tech Stack

**Frontend:** Next.js 16, React 19, TypeScript, Tailwind CSS 4, Zustand, dnd-kit  
**Backend:** NestJS, PostgreSQL, Prisma, JWT Auth

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL
- pnpm

### Backend

```bash
cd backend
pnpm install
cp .env.example .env
npx prisma migrate dev
pnpm run start:dev
```

### Frontend

```bash
cd frontend
pnpm install
pnpm run dev
```

## Author

Frontend Developer based in Israel · Open to work  
[LinkedIn](https://www.linkedin.com/in/aleksei-zhuravlev1803/)
