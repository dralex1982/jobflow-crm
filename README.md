 # JobFlow CRM

  Job application tracker with a Kanban board and pipeline management.
  
 ## Screenshots

![Kanban Board](https://github.com/user-attachments/assets/c265a219-2569-4293-b029-5dbddba1bd48)
![Dashboard](https://github.com/user-attachments/assets/6d2e85fa-f150-4e02-9ebf-1621dc6942a9)
 
  ## Tech Stack

  - **Backend:** NestJS, Prisma, PostgreSQL, JWT auth
  - **Frontend:** Next.js 16, React 19, Tailwind CSS 4, Zustand, dnd-kit

  ## Getting Started

  ### Prerequisites

  - Node.js 18+
  - PostgreSQL
  - pnpm

  ### Backend

  ```bash
  cd backend
  pnpm install
  cp .env.example .env   # configure your database URL and secrets
  npx prisma migrate dev
  pnpm run start:dev

  Frontend

  cd frontend
  pnpm install
  pnpm run dev

  Features

  - User registration and login (JWT)
  - Create, edit, delete vacancies
  - Kanban board with drag-and-drop 
  - Search and status filtering
  - List and board view modes
