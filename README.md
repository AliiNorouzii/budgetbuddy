# BudgetBuddy

BudgetBuddy is a personal expense-tracking application for managing income, expenses, accounts, categories, and monthly financial summaries.

The project is designed as a full-stack application with a Next.js frontend, a NestJS backend, and a PostgreSQL database.

---

## Project Goal

The main goal of BudgetBuddy is to help users:

- Record income and expenses
- Organize transactions using categories
- Manage different financial accounts
- View monthly income, expenses, and balance
- Set monthly budgets for categories
- Review simple financial reports and charts

The application is intended for personal use and does not connect directly to banking systems.

---

## Architecture
```text
Browser
   |
   v
Next.js Frontend
   |
   v
NestJS REST API
   |
   v
PostgreSQL Database

Backend
NestJS
TypeScript
Prisma ORM
PostgreSQL
class-validator
class-transformer
Testing
Jest
Supertest
Integration tests
End-to-end tests
Main Features
Accounts
Users can manage their financial accounts, such as:

Cash
Bank account
Credit card
Planned operations include:

Creating an account
Viewing accounts
Updating an account
Archiving an account
Example routes:

http
GET    /accounts
POST   /accounts
PATCH  /accounts/:accountId
Categories
Categories are used to organize income and expenses.

Examples:

Food
Transport
Rent
Salary
Entertainment
Each category can contain information such as:

Name
Type
Color
Icon
User ownership
Example routes:

http
GET  /categories
POST /categories
Transactions
Transactions represent income and expenses made by the user.

A transaction can contain:

Account
Category
Type
Amount
Transaction date
Description
Optional note

Planned operations include:

Creating a transaction
Viewing transactions
Updating a transaction
Deleting a transaction
Filtering transactions by date, type, category, or account
Example routes:

http
GET    /transactions
POST   /transactions
PATCH  /transactions/:transactionId
DELETE /transactions/:transactionId
Monthly Budgets
Users can define a spending limit for a category in a specific month.

The budget feature should display:

Budget limit
Amount spent
Remaining amount
Warning when the budget is exceeded
Example routes:

http
GET  /budgets
POST /budgets
Reports
The reports section is responsible for calculating financial summaries.

Planned reports include:

Monthly income
Monthly expenses
Monthly balance
Expenses grouped by category
Recent transactions
Example routes:

http
GET /reports/monthly?month=2026-07
GET /reports/categories?month=2026-07
The main balance calculation is:

text
balance = total income - total expenses
Budget remaining amount is calculated as:

text
remaining = budget limit - category expenses
Data Models
The main entities of the project are:

Account
text
id
userId
name
type
archived
Category
text
id
userId
name
type
color
icon
Transaction
text
id
userId
accountId
categoryId
type
amount
transactionDate
description
note
Budget
text
id
userId
categoryId
month
limitAmount
Privacy and Data Ownership
Every user’s financial information must remain private.

Important rules:

A user can only view their own accounts.
A user can only view their own categories.
A user can only view their own transactions.
A user cannot update or delete another user’s data.
Every database query involving user data must use the authenticated user’s ID.
Archived accounts should not receive new transactions.
Example security rule:

text
Every query must include the logged-in user's ID.
Backend Project Structure
The backend follows the NestJS modular architecture:

text
backend/
├── src/
│   ├── accounts/
│   │   ├── accounts.controller.ts
│   │   ├── accounts.service.ts
│   │   ├── accounts.module.ts
│   │   └── dto/
│   ├── categories/
│   │   ├── categories.controller.ts
│   │   ├── categories.service.ts
│   │   ├── categories.module.ts
│   │   └── dto/
│   ├── transactions/
│   ├── budgets/
│   ├── reports/
│   ├── prisma/
│   ├── app.module.ts
│   └── main.ts
├── prisma/
│   └── schema.prisma
├── test/
│   ├── app.e2e-spec.ts
│   └── jest-e2e.json
└── package.json
Environment Variables
The backend requires a PostgreSQL connection string.

Create a .env file in the backend directory:

env
DATABASE_URL="postgresql://USERNAME:PASSWORD@localhost:5432/budgetbuddy"
Replace the following values with the local PostgreSQL configuration:

USERNAME
PASSWORD
Database name
Port, if it is different from 5432
The .env file should not be committed to Git.

A safe .env.example file can be added to the project:

env
DATABASE_URL="postgresql://USERNAME:PASSWORD@localhost:5432/budgetbuddy"
Installation
Navigate to the backend directory:

bash
cd backend
Install the dependencies:

bash
npm install
Generate the Prisma Client:

bash
npx prisma generate
Running the Backend
Run the backend in development mode:

bash
npm run start:dev
Build the backend:

bash
npm run build
Testing
Run the unit and integration tests:

bash
npm test
Run the end-to-end tests:

bash
npm run test:e2e
The current E2E test verifies that the NestJS application is created and initialized successfully.

Expected result:

text
Test Suites: 1 passed, 1 total
Tests:       1 passed, 1 total
The application startup test is intentionally used instead of testing the / route because the project does not currently define a controller for the root path.

Current Development Status
Completed
NestJS backend base structure created
Prisma configured for the project
PostgreSQL connection configured through DATABASE_URL
AccountsModule created
Accounts controller and service implemented
Accounts DTO validation added
CategoriesModule created
Categories controller and service implemented
Categories DTO created
Integration tests for accounts completed successfully
E2E test environment configured with dotenv/config
Prisma connection cleanup implemented through OnModuleDestroy
Database pool is closed correctly after tests
Application startup E2E test passes successfully
Jest and Supertest testing workflow stabilized
In Progress
Completing the transactions module
Adding transactions DTOs and validation
Implementing transaction CRUD operations
Adding integration tests for transactions
Connecting frontend pages to the backend API
Improving reports and dashboard calculations
Next Steps
Push the latest changes to GitHub.
Implement the transactions module.
Add validation for transaction amounts and dates.
Add ownership checks for all user-related queries.
Add integration tests for transactions.
Add budget and report modules.
Connect the frontend dashboard to the API.
Add more complete E2E scenarios.
Update this README after each major development day.
Testing Requirements
The following cases should be covered by the test suite:

A user can create an account.
A user can view their own accounts.
A user can update an account.
A user can archive an account.
A user can create a category.
A user can create an income transaction.
A user can create an expense transaction.
A user cannot view another user’s transactions.
A user cannot modify another user’s transactions.
Negative or invalid amounts are rejected.
Monthly income and expense totals are calculated correctly.
Category expense totals are calculated correctly.
Archived accounts cannot receive new transactions.
Git Commit Convention
The project uses descriptive commit messages.

Examples:

text
feat: add categories module
test: stabilize accounts integration tests
test: add categories integration tests
fix: close prisma pool after tests
test: stabilize e2e application startup test
docs: update README and stabilize e2e tests
License
This project is currently developed as a personal educational project.


## Current Status
- **Build:** Stable (Compiled to `/dist`).
- **Data Model:** Uses integer-based currency (`amountCents`) to prevent floating-point errors.
- **Security:** User Scoping is enforced on all resource operations to ensure data isolation.

## Commands
- `npm run build`: Compile