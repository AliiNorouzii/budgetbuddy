<<<<<<< HEAD
# 💰 BudgetBuddy

BudgetBuddy is a modern, full-stack personal finance and expense tracking application.

## 🚀 Tech Stack
- **Frontend:** Next.js, TypeScript, Tailwind CSS
- **Backend:** NestJS, JWT Authentication
- **Database:** Prisma ORM
=======
# BudgetBuddy Backend

This is the backend service for **BudgetBuddy**, a personal expense tracker built with **NestJS**, **Prisma**, and **PostgreSQL**.

The backend currently provides the core API foundation for managing:

- accounts
- categories
- transactions

It is being developed incrementally with a focus on clean module structure, schema alignment, and stable runtime behavior.
 05ba728 (feat(auth): implement secure session management and fix schema alignment)

## 📁 Structure
- `/backend`: NestJS API
- `/frontend`: Next.js App
- `/docs`: Documentation

HEAD
## 📖 API Documentation
Detailed API endpoints are available in [`docs/API.md`](./docs/API.md).


## 🧑‍💻 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- A database supported by Prisma (e.g., PostgreSQL)
=======
## Tech Stack

- NestJS
- TypeScript
- Prisma ORM
- PostgreSQL
- class-validator
- class-transformer
 05ba728 (feat(auth): implement secure session management and fix schema alignment)

### 1) Install Dependencies
```bash
# Install backend dependencies
cd backend
npm install

 HEAD
# Install frontend dependencies
cd ../frontend
npm install

2) Configure Environment Variables
Create a .env file in the backend folder based on the provided sample (backend/.env.example) and set the following values:

env
DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/budgetbuddy"
JWT_SECRET="a-strong-secret-key"

3) Set Up the Database
bash
cd backend
npx prisma migrate dev

4) Run the Servers
bash
# Backend (port 3000)
cd backend
npm run start:dev

# Frontend (port 30000)
cd ../frontend
npm run dev
Then open http://localhost:3000 in your browser, register/login, and start managing your expenses.

👤 How to Use the App
Register on the Register page, or log in via Login.
After logging in, create your own categories on the dashboard.
Add a financial account and record your income/expense transactions.
Your transactions are shown only to you — other users cannot access your data.
In the Budgets section, you can set a spending limit for each category.
📚 Further Documentation
Full API endpoint details are available in docs/API.md.

🤝 Contributing
We welcome you to help improve this project by opening an issue or submitting a pull request.
=======
## Current Status

The backend is currently in a stable development state.

### Confirmed Working
- `npm run build` completes successfully
- `npm run start:dev` runs successfully
- main resource modules load without runtime errors
- CRUD route groups are mapped successfully by NestJS

### Implemented Modules
- Accounts
- Categories
- Transactions
- Prisma

---

## API Resources

The current backend exposes route groups for:

- `/accounts`
- `/categories`
- `/transactions`

These routes are registered and available through the NestJS application.

---

## Project Structure
```text
backend/
├── src/
│   ├── accounts/
│   ├── categories/
│   ├── transactions/
│   ├── prisma/
│   ├── app.module.ts
│   └── main.ts
├── prisma/
│   ├── schema.prisma
│   ├── migrations/
│   └── seed.ts
├── package.json
├── tsconfig.json
└── tsconfig.build.json
 05ba728 (feat(auth): implement secure session management and fix schema alignment)
