# BudgetBuddy

A full-stack personal finance and expense tracking app built with Next.js, NestJS, Prisma, and PostgreSQL.

## Tech Stack

- **Frontend:** Next.js · TypeScript · Tailwind CSS · shadcn/ui
- **Backend:** NestJS · Prisma · PostgreSQL

## Project Structure
budgetbuddy/

├── backend/ # NestJS API (port 3000)

├── frontend/ # Next.js app (port 3001)

└── docs/ # Documentation

Getting Started
Prerequisites
Node.js v18+
PostgreSQL
1. Install dependencies
bash

cd backend && npm install

cd …/frontend && npm install

2. Configure environment
Create backend/.env:

env

DATABASE_URL=“postgresql://USER:PASSWORD@localhost:5432/budgetbuddy”

JWT_SECRET=“your-secret-key”

3. Set up the database
bash

cd backend

npx prisma migrate dev

npx prisma db seed

4. Run the app
bash

Backend
cd backend && npm run start:dev

Frontend
cd frontend && npm run dev

Features
User registration and login with hashed session management (24h expiry)
Manage accounts, categories, and transactions
Budget limits per category
All data is scoped to the authenticated user

Documentation
Full API reference: docs/API.md