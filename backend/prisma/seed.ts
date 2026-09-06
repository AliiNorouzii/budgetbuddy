import 'dotenv/config';
import { PrismaClient, TransactionType } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import * as bcrypt from 'bcrypt';

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error('DATABASE_URL environment variable is missing.');
}

const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('🌱 Starting database seed...');

  // 1. پاکسازی داده‌های قبلی به ترتیب روابط
  await prisma.transaction.deleteMany();
  await prisma.budget.deleteMany();
  await prisma.account.deleteMany();
  await prisma.category.deleteMany();
  await prisma.userCredential.deleteMany();
  await prisma.user.deleteMany();

  // 2. ساخت کاربران تستی همراه با UserCredential مجزا (Nested Create)
  const passwordHashDefault = await bcrypt.hash('Password123!', 10);
  const passwordHashSarah = await bcrypt.hash('SarahPass!456', 10);
  const passwordHashReza = await bcrypt.hash('RezaPass!789', 10);

  const ali = await prisma.user.create({
    data: {
      email: 'ali@budgetbuddy.local',
      fullName: 'Ali Norouzi',
      credential: {
        create: {
          passwordHash: passwordHashDefault,
        },
      },
    },
  });

  const sarah = await prisma.user.create({
    data: {
      email: 'sarah@budgetbuddy.local',
      fullName: 'Sarah Ahmadi',
      credential: {
        create: {
          passwordHash: passwordHashSarah,
        },
      },
    },
  });

  const reza = await prisma.user.create({
    data: {
      email: 'reza@budgetbuddy.local',
      fullName: 'Reza Tehrani',
      credential: {
        create: {
          passwordHash: passwordHashReza,
        },
      },
    },
  });

  console.log('✅ Users and Credentials created.');

  // 3. ساخت حساب‌های بانکی نمونه برای کاربر علی
  const mainAccount = await prisma.account.create({
    data: {
      userId: ali.id,
      name: 'حساب اصلی (بانک ملت)',
      type: 'CHECKING',
      balanceCents: 500000000, // 5,000,000 تومان
    },
  });

  const savingsAccount = await prisma.account.create({
    data: {
      userId: ali.id,
      name: 'پس‌انداز (بانک سامان)',
      type: 'SAVINGS',
      balanceCents: 1200000000, // 12,000,000 تومان
    },
  });

  // 4. ساخت دسته‌بندی‌های نمونه
  const catGroceries = await prisma.category.create({
    data: {
      userId: ali.id,
      name: 'خوراک و سوپرمارکت',
      color: '#10B981',
      icon: 'shopping-cart',
    },
  });

  const catSalary = await prisma.category.create({
    data: {
      userId: ali.id,
      name: 'حقوق و دستمزد',
      color: '#3B82F6',
      icon: 'briefcase',
    },
  });

  const catTransport = await prisma.category.create({
    data: {
      userId: ali.id,
      name: 'حمل و نقل',
      color: '#F59E0B',
      icon: 'car',
    },
  });

  // 5. ساخت تراکنش‌های نمونه
  const now = new Date();

  await prisma.transaction.create({
    data: {
      userId: ali.id,
      accountId: mainAccount.id,
      categoryId: catSalary.id,
      type: TransactionType.INCOME,
      amountCents: 350000000, // 3,500,000 تومان
      description: 'واریز حقوق ماهانه',
      transactionDate: new Date(now.getFullYear(), now.getMonth(), 1),
    },
  });

  await prisma.transaction.create({
    data: {
      userId: ali.id,
      accountId: mainAccount.id,
      categoryId: catGroceries.id,
      type: TransactionType.EXPENSE,
      amountCents: 45000000, // 450,000 تومان
      description: 'خرید هفتگی سوپرمارکت',
      transactionDate: new Date(now.getFullYear(), now.getMonth(), 3),
    },
  });

  await prisma.transaction.create({
    data: {
      userId: ali.id,
      accountId: mainAccount.id,
      categoryId: catTransport.id,
      type: TransactionType.EXPENSE,
      amountCents: 15000000, // 150,000 تومان
      description: 'بنزین و اسنپ',
      transactionDate: new Date(now.getFullYear(), now.getMonth(), 4),
    },
  });

  // 6. ساخت بودجه نمونه
  const currentMonthStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  await prisma.budget.create({
    data: {
      userId: ali.id,
      categoryId: catGroceries.id,
      month: currentMonthStr,
      amountCents: 100000000, // سقف ۱,۰۰۰,۰۰۰ تومان
    },
  });

  console.log('🚀 Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
