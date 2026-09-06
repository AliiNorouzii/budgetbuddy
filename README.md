# 💰 BudgetBuddy

BudgetBuddy is a modern, full-stack personal finance and expense tracking application.

## 🚀 Tech Stack
- **Frontend:** Next.js, TypeScript, Tailwind CSS
- **Backend:** NestJS, JWT Authentication
- **Database:** Prisma ORM

## 📁 Structure
- `/backend`: NestJS API
- `/frontend`: Next.js App
- `/docs`: Documentation

## 📖 API Documentation
Detailed API endpoints are available in [`docs/API.md`](./docs/API.md).


## 🧑‍💻 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- A database supported by Prisma (e.g., PostgreSQL)

### 1) Install Dependencies
```bash
# Install backend dependencies
cd backend
npm install

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