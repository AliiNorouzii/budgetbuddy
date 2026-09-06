# BudgetBuddy Backend

This is the backend service for **BudgetBuddy**, a personal expense tracker built with **NestJS**, **Prisma**, and **PostgreSQL**.

The backend currently provides the core API foundation for managing:

- accounts
- categories
- transactions

It is being developed incrementally with a focus on clean module structure, schema alignment, and stable runtime behavior.

---

## Tech Stack

- NestJS
- TypeScript
- Prisma ORM
- PostgreSQL
- class-validator
- class-transformer

---

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
