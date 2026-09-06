import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error('DATABASE_URL is not defined in the .env file.');
}

const adapter = new PrismaPg({
  connectionString,
});

const prisma = new PrismaClient({
  adapter,
});

async function main() {
  console.log('🌱 Starting seed...');

  // ایجاد یا یافتن کاربر آزمایشی
  const defaultUser = await prisma.user.upsert({
    where: {
      email: 'ali@budgetbuddy.local',
    },
    update: {},
    create: {
      name: 'Ali',
      email: 'ali@budgetbuddy.local',
      passwordHash: 'dummy_hash_for_dev',
    },
  });

  console.log(`👤 User ready: ${defaultUser.id}`);

  const defaultCategories = [
    { name: 'Food & Dining', color: '#FF5733', icon: 'utensils' },
    { name: 'Rent & Housing', color: '#3357FF', icon: 'home' },
    { name: 'Salary', color: '#2ECC71', icon: 'briefcase' },
    { name: 'Transportation', color: '#F1C40F', icon: 'car' },
    { name: 'Entertainment', color: '#9B59B6', icon: 'gamepad' },
  ];

  for (const category of defaultCategories) {
    await prisma.category.upsert({
      where: {
        userId_name: {
          userId: defaultUser.id,
          name: category.name,
        },
      },
      update: {
        color: category.color,
        icon: category.icon,
      },
      create: {
        userId: defaultUser.id,
        name: category.name,
        color: category.color,
        icon: category.icon,
      },
    });
  }

  console.log('✅ Default categories seeded successfully.');
}

main()
  .catch((error) => {
    console.error('❌ Seed failed:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
