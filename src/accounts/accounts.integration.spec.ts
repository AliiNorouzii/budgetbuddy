import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../app.module';
import { PrismaService } from '../prisma/prisma.service';
import * as request from 'supertest';

describe('Accounts (Integration)', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  const userId = 'user_test_1';

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
    await prisma.cleanDb();
    await app.close();
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
      expect(response.body.userId).toBe(userId);
      expect(response.body.name).toBe('Main Account');
      
      const accountInDb = await prisma.account.findUnique({ where: { id: response.body.id } });
      expect(accountInDb).not.toBeNull();
    });
  });

  describe('GET /accounts', () => {
    it('should return all accounts for the user', async () => {
      await prisma.account.create({
        data: { userId, name: 'Savings', type: 'SAVINGS', balanceCents: 50000 },
      });

      const response = await request(app.getHttpServer())
        .get('/accounts')
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body).toHaveLength(1);
    });
  });
});
