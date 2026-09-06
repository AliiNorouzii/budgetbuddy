import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../app.module';
import { PrismaService } from '../prisma/prisma.service';
import * as request from 'supertest';
import { TransactionType } from '@prisma/client';

describe('Transactions (Integration)', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  const userId = 'user_test_tx';
  const otherUserId = 'user_test_other';
  let accountId: string;
  let otherAccountId: string;
  let categoryId: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
    await app.init();
    prisma = moduleFixture.get<PrismaService>(PrismaService);
  });

  beforeEach(async () => {
    await prisma.cleanDb();

    // ایجاد کاربران تست
    await prisma.user.createMany({
      data: [
        { id: userId, email: 'tx_owner@example.com', passwordHash: 'hash' },
        { id: otherUserId, email: 'other@example.com', passwordHash: 'hash' },
      ],
    });

    // ایجاد حساب‌های تست
    const account = await prisma.account.create({
      data: { userId, name: 'Wallet', type: 'CASH', balanceCents: 10000 },
    });
    accountId = account.id;

    const otherAccount = await prisma.account.create({
      data: { userId: otherUserId, name: 'Other Wallet', type: 'CASH', balanceCents: 5000 },
    });
    otherAccountId = otherAccount.id;

    // ایجاد دسته‌بندی تست
    const category = await prisma.category.create({
      data: { userId, name: 'Food' },
    });
    categoryId = category.id;
  });

  afterAll(async () => {
    await prisma.cleanDb();
    await app.close();
  });

  describe('POST /transactions', () => {
    it('should create an expense and deduct balance from account', async () => {
      const dto = {
        userId,
        accountId,
        categoryId,
        type: TransactionType.EXPENSE,
        description: 'Dinner',
        amountCents: 3000,
        transactionDate: new Date().toISOString(),
      };

      const response = await request(app.getHttpServer())
        .post('/transactions')
        .send(dto)
        .expect(201);

      expect(response.body).toHaveProperty('id');
      
      // بررسی تغییر موجودی حساب
      const updatedAccount = await prisma.account.findUnique({ where: { id: accountId } });
      expect(updatedAccount?.balanceCents).toBe(7000); // 10000 - 3000
    });

    it('should prevent creating a transaction on another user\'s account', async () => {
      const dto = {
        userId,
        accountId: otherAccountId, // حساب متعلق به کاربر دیگر
        type: TransactionType.INCOME,
        description: 'Hack attempt',
        amountCents: 5000,
        transactionDate: new Date().toISOString(),
      };

      await request(app.getHttpServer())
        .post('/transactions')
        .send(dto)
        .expect(404);
    });
  });

  describe('DELETE /transactions/:id', () => {
    it('should delete a transaction and reverse its balance effect', async () => {
      const tx = await prisma.transaction.create({
        data: {
          userId,
          accountId,
          type: TransactionType.EXPENSE,
          description: 'Lunch',
          amountCents: 2000,
          transactionDate: new Date(),
        },
      });

      // کاهش دستی بالانس به خاطر ثبت تراکنش قبلی
      await prisma.account.update({
        where: { id: accountId },
        data: { balanceCents: 8000 },
      });

      await request(app.getHttpServer())
        .delete(`/transactions/${tx.id}`)
        .query({ userId })
        .expect(200);

      // موجودی باید به حالت قبل از تراکنش برگردد
      const updatedAccount = await prisma.account.findUnique({ where: { id: accountId } });
      expect(updatedAccount?.balanceCents).toBe(10000); // 8000 + 2000
    });
  });
});
