# BudgetBuddy API Documentation

## Authentication & Security
- All private routes require a Bearer JWT token in the `Authorization` header.
- Multi-tenancy and data isolation are enforced at the service level using `userId` extracted from the JWT payload.

## Endpoints Overview

### Authentication
- `POST /auth/register` - Register a new user
- `POST /auth/login` - Authenticate and receive JWT

### Accounts & Categories & Transactions
- CRUD operations for user accounts, categories, and transactions are protected.

Details are available in source code.
