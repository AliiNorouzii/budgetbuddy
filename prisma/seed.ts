import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  // 1. Clean existing data for a repeatable (idempotent) run
  await prisma.budget.deleteMany({});
  await prisma.transaction.deleteMany({});
  await prisma.category.deleteMany({});
  await prisma.account.deleteMany({});
  await prisma.user.deleteMany({});
  console.log('🧹 Cleared existing data');

  // ===================== USERS =====================
  const userAli = await prisma.user.create({
    data: {
      email: 'ali@budgetbuddy.com',
      passwordHash: await bcrypt.hash('Password123!', 10),
      name: 'Ali Norouzi',
    },
  });

  const userSarah = await prisma.user.create({
    data: {
      email: 'sarah@budgetbuddy.com',
      passwordHash: await bcrypt.hash('SarahPass!456', 10),
      name: 'Sarah Miller',
    },
  });

  const userReza = await prisma.user.create({
    data: {
      email: 'reza@budgetbuddy.com',
      passwordHash: await bcrypt.hash('RezaPass!789', 10),
      name: 'Reza Karimi',
    },
  });

  console.log('👤 Created 3 users');

  // ===================== ACCOUNTS =====================
  // balances in cents (e.g. 25,000,000 toman = 2,500,000,000 cents)
  const aliMain = await prisma.account.create({
    data: { name: 'Ali Main Bank Account', type: 'BANK', balanceCents: 2500000000, userId: userAli.id },
  });
  const aliCash = await prisma.account.create({
    data: { name: 'Ali Cash Wallet', type: 'CASH', balanceCents: 350000000, userId: userAli.id },
  });
  const aliCredit = await prisma.account.create({
    data: { name: 'Ali Credit Card', type: 'CREDIT', balanceCents: -120000000, userId: userAli.id },
  });

  const sarahMain = await prisma.account.create({
    data: { name: 'Sarah Savings Account', type: 'BANK', balanceCents: 4000000000, userId: userSarah.id },
  });
  const sarahCash = await prisma.account.create({
    data: { name: 'Sarah Wallet', type: 'CASH', balanceCents: 80000000, userId: userSarah.id },
  });

  const rezaMain = await prisma.account.create({
    data: { name: 'Reza Business Account', type: 'BUSINESS', balanceCents: 6000000000, userId: userReza.id },
  });
  const rezaCash = await prisma.account.create({
    data: { name: 'Reza Travelling Cash', type: 'CASH', balanceCents: 500000000, userId: userReza.id },
  });

  console.log('💳 Created 7 accounts');

  // ===================== CATEGORIES =====================
  // --- Income categories (with colors and icons) ---
  const catSalary = await prisma.category.create({
    data: { name: 'Salary', color: '#22c55e', icon: 'briefcase', userId: userAli.id },
  });
  const catFreelance = await prisma.category.create({
    data: { name: 'Freelance', color: '#3b82f6', icon: 'code', userId: userAli.id },
  });
  const catInvestment = await prisma.category.create({
    data: { name: 'Investment Returns', color: '#a855f7', icon: 'trending-up', userId: userSarah.id },
  });
  const catBusiness = await prisma.category.create({
    data: { name: 'Business Revenue', color: '#f59e0b', icon: 'store', userId: userReza.id },
  });

  // --- Expense categories ---
  const catFood = await prisma.category.create({
    data: { name: 'Food & Restaurant', color: '#ef4444', icon: 'utensils', userId: userAli.id },
  });
  const catTransport = await prisma.category.create({
    data: { name: 'Transportation', color: '#6366f1', icon: 'car', userId: userAli.id },
  });
  const catRent = await prisma.category.create({
    data: { name: 'Rent & Utilities', color: '#f97316', icon: 'home', userId: userAli.id },
  });
  const catEntertainment = await prisma.category.create({
    data: { name: 'Entertainment', color: '#ec4899', icon: 'film', userId: userAli.id },
  });
  const catHealth = await prisma.category.create({
    data: { name: 'Healthcare', color: '#14b8a6', icon: 'heart-pulse', userId: userSarah.id },
  });
  const catShopping = await prisma.category.create({
    data: { name: 'Shopping', color: '#8b5cf6', icon: 'shopping-bag', userId: userSarah.id },
  });
  const catTravel = await prisma.category.create({
    data: { name: 'Travel', color: '#06b6d4', icon: 'plane', userId: userReza.id },
  });
  const catEducation = await prisma.category.create({
    data: { name: 'Education', color: '#84cc16', icon: 'graduation-cap', userId: userReza.id },
  });

  console.log('🏷️ Created 12 categories');

  // ===================== TRANSACTIONS =====================
  // amounts in cents
  await prisma.transaction.createMany({
    data: [
      // --- Ali ---
      {
        amountCents: 2500000000, type: 'INCOME', description: 'Monthly salary deposit',
        notes: 'Deposited by employer', transactionDate: new Date('2026-08-20'),
        accountId: aliMain.id, categoryId: catSalary.id, userId: userAli.id,
      },
      {
        amountCents: 550000000, type: 'INCOME', description: 'Freelance web project',
        notes: 'Frontend milestone', transactionDate: new Date('2026-08-15'),
        accountId: aliMain.id, categoryId: catFreelance.id, userId: userAli.id,
      },
      {
        amountCents: 45000000, type: 'EXPENSE', description: 'Weekly supermarket shopping',
        notes: null, transactionDate: new Date('2026-08-22'),
        accountId: aliMain.id, categoryId: catFood.id, userId: userAli.id,
      },
      {
        amountCents: 35000000, type: 'EXPENSE', description: 'Weekend restaurant dinner',
        notes: 'With friends', transactionDate: new Date('2026-08-24'),
        accountId: aliCash.id, categoryId: catFood.id, userId: userAli.id,
      },
      {
        amountCents: 120000000, type: 'EXPENSE', description: 'Monthly metro and taxi pass',
        notes: null, transactionDate: new Date('2026-08-18'),
        accountId: aliMain.id, categoryId: catTransport.id, userId: userAli.id,
      },
      {
        amountCents: 800000000, type: 'EXPENSE', description: 'Apartment monthly rent',
        notes: 'Paid via bank transfer', transactionDate: new Date('2026-08-05'),
        accountId: aliMain.id, categoryId: catRent.id, userId: userAli.id,
      },
      {
        amountCents: 90000000, type: 'EXPENSE', description: 'Cinema and concert tickets',
        notes: 'Weekend outing', transactionDate: new Date('2026-08-26'),
        accountId: aliCredit.id, categoryId: catEntertainment.id, userId: userAli.id,
      },
      // --- Sarah ---
      {
        amountCents: 1500000000, type: 'INCOME', description: 'Quarterly dividend payout',
        notes: 'From portfolio', transactionDate: new Date('2026-08-10'),
        accountId: sarahMain.id, categoryId: catInvestment.id, userId: userSarah.id,
      },
      {
        amountCents: 320000000, type: 'EXPENSE', description: 'Monthly grocery shopping',
        notes: null, transactionDate: new Date('2026-08-12'),
        accountId: sarahMain.id, categoryId: catFood.id, userId: userSarah.id,
      },
      {
        amountCents: 200000000, type: 'EXPENSE', description: 'New office outfit',
        notes: 'Work attire', transactionDate: new Date('2026-08-19'),
        accountId: sarahMain.id, categoryId: catShopping.id, userId: userSarah.id,
      },
      {
        amountCents: 45000000, type: 'EXPENSE', description: 'Dental checkup and cleaning',
        notes: 'Routine visit', transactionDate: new Date('2026-08-14'),
        accountId: sarahCash.id, categoryId: catHealth.id, userId: userSarah.id,
      },
      // --- Reza ---
      {
        amountCents: 4500000000, type: 'INCOME', description: 'Office furniture contract payment',
        notes: 'Invoice #1024', transactionDate: new Date('2026-08-08'),
        accountId: rezaMain.id, categoryId: catBusiness.id, userId: userReza.id,
      },
      {
        amountCents: 2200000000, type: 'INCOME', description: 'Client onboarding retainer',
        notes: 'New client', transactionDate: new Date('2026-08-25'),
        accountId: rezaMain.id, categoryId: catBusiness.id, userId: userReza.id,
      },
      {
        amountCents: 1500000000, type: 'EXPENSE', description: 'Business trip to Dubai',
        notes: 'Flights and hotel', transactionDate: new Date('2026-08-16'),
        accountId: rezaMain.id, categoryId: catTravel.id, userId: userReza.id,
      },
      {
        amountCents: 500000000, type: 'EXPENSE', description: 'Online MBA course enrollment',
        notes: 'Semester fee', transactionDate: new Date('2026-08-06'),
        accountId: rezaMain.id, categoryId: catEducation.id, userId: userReza.id,
      },
      {
        amountCents: 180000000, type: 'EXPENSE', description: 'Team lunch during work trip',
        notes: 'Business meal', transactionDate: new Date('2026-08-17'),
        accountId: rezaCash.id, categoryId: catFood.id, userId: userReza.id,
      },
    ],
  });

  console.log('📊 Created 16 transactions');

  // ===================== BUDGETS =====================
  await prisma.budget.createMany({
    data: [
      { userId: userAli.id, categoryId: catFood.id, month: '2026-08', amountCents: 600000000 },
      { userId: userAli.id, categoryId: catTransport.id, month: '2026-08', amountCents: 150000000 },
      { userId: userAli.id, categoryId: catEntertainment.id, month: '2026-08', amountCents: 120000000 },
      { userId: userSarah.id, categoryId: catShopping.id, month: '2026-08', amountCents: 300000000 },
      { userId: userSarah.id, categoryId: catHealth.id, month: '2026-08', amountCents: 100000000 },
      { userId: userReza.id, categoryId: catTravel.id, month: '2026-08', amountCents: 2000000000 },
      { userId: userReza.id, categoryId: catEducation.id, month: '2026-08', amountCents: 800000000 },
    ],
  });

  console.log('🎯 Created 7 budgets');

  console.log('✅ Seeding finished successfully.');
  console.log('   Summary: 3 users, 7 accounts, 12 categories, 16 transactions, 7 budgets');
}

main()
  .catch((e) => {
    console.error('❌ Error while seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
