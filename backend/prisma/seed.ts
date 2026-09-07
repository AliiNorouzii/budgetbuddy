import { PrismaClient, AccountType, TransactionType } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const email = 'demo@budgetbuddy.local';

  await prisma.transaction.deleteMany();
  await prisma.category.deleteMany();
  await prisma.account.deleteMany();
  await prisma.session.deleteMany();
  await prisma.user.deleteMany({ where: { email } });

  const passwordHash = await bcrypt.hash('Password123!', 10);

  const user = await prisma.user.create({
    data: {
      email,
      name: 'Demo User',
      passwordHash,
    },
  });

  const [wallet, bank] = await Promise.all([
    prisma.account.create({
      data: {
        userId: user.id,
        name: 'کیف پول نقدی',
        type: AccountType.CASH,
      },
    }),
    prisma.account.create({
      data: {
        userId: user.id,
        name: 'حساب جاری ملت',
        type: AccountType.BANK,
      },
    }),
  ]);

  const [food, salary] = await Promise.all([
    prisma.category.create({
      data: {
        userId: user.id,
        name: 'خوراک و رستوران',
        color: '#f97316',
        icon: 'Utensils',
      },
    }),
    prisma.category.create({
      data: {
        userId: user.id,
        name: 'حقوق و دستمزد',
        color: '#22c55e',
        icon: 'Briefcase',
      },
    }),
  ]);

  await prisma.transaction.createMany({
    data: [
      {
        userId: user.id,
        accountId: bank.id,
        categoryId: salary.id,
        type: TransactionType.INCOME,
        amountCents: 2500000000,
        transactionDate: new Date(),
        description: 'واریز حقوق ماهانه',
      },
      {
        userId: user.id,
        accountId: wallet.id,
        categoryId: food.id,
        type: TransactionType.EXPENSE,
        amountCents: 4500000,
        transactionDate: new Date(),
        description: 'خرید سوپرمارکت',
      },
    ],
  });

  console.log('Seed completed successfully for user:', user.email);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
