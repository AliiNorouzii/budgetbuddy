import 'dotenv/config';

import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../app.module';
import { PrismaService } from '../prisma/prisma.service';

// eslint-disable-next-line @typescript-eslint/no-require-imports
const request = require('supertest');

describe('Accounts (Integration)', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  const userId = 'user_test_1';

  beforeAll(async () => {
    const moduleFixture: TestingModule =
      await Test.createTestingModule({
        imports: [AppModule],
      }).compile();

    app = moduleFixture.createNestApplication();

    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        transform: true,
      }),
    );

    await app.init();

    prisma = moduleFixture.get<PrismaService>(PrismaService);
  });

  beforeEach(async () => {
    await prisma.cleanDb();

    await prisma.user.create({
      data: {
        id: userId,
        email: 'test@example.com',
        name: 'Test User',
        passwordHash: 'hashed-password',
      },
    });
  });

  afterAll(async () => {
    if (prisma) {
      await prisma.cleanDb();
    }

    if (app) {
      await app.close();
    }
  });

  describe('POST /accounts', () => {
    it('should create a new account successfully', async () => {
      const createAccountDto = {
        userId,
        name: 'Main Account',
        type: 'CHECKING',
        balanceCents: 150000,
      };

      const response = await request(app.getHttpServer())
        .post('/accounts')
        .send(createAccountDto)
        .expect(201);

      expect(response.body).toHaveProperty('id');
      expect(response.body.userId).toBe(createAccountDto.userId);
      expect(response.body.name).toBe(createAccountDto.name);
      expect(response.body.type).toBe(createAccountDto.type);
      expect(response.body.balanceCents).toBe(
        createAccountDto.balanceCents,
      );
      expect(response.body).toHaveProperty('createdAt');
      expect(response.body).toHaveProperty('updatedAt');

      const accountInDatabase = await prisma.account.findUnique({
        where: {
          id: response.body.id,
        },
      });

      expect(accountInDatabase).not.toBeNull();
      expect(accountInDatabase?.userId).toBe(userId);
      expect(accountInDatabase?.name).toBe('Main Account');
      expect(accountInDatabase?.type).toBe('CHECKING');
      expect(accountInDatabase?.balanceCents).toBe(150000);
    });
  });

  describe('GET /accounts', () => {
    it('should return all accounts', async () => {
      const firstAccount = await prisma.account.create({
        data: {
          userId,
          name: 'Savings Account',
          type: 'SAVINGS',
          balanceCents: 50000,
        },
      });

      const secondAccount = await prisma.account.create({
        data: {
          userId,
          name: 'Checking Account',
          type: 'CHECKING',
          balanceCents: 100000,
        },
      });

      const response = await request(app.getHttpServer())
        .get('/accounts')
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body).toHaveLength(2);

      expect(response.body).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            id: firstAccount.id,
            userId,
            name: 'Savings Account',
            type: 'SAVINGS',
            balanceCents: 50000,
          }),
          expect.objectContaining({
            id: secondAccount.id,
            userId,
            name: 'Checking Account',
            type: 'CHECKING',
            balanceCents: 100000,
          }),
        ]),
      );
    });
  });
});
