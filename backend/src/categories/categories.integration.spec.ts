import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../app.module';
import { PrismaService } from '../prisma/prisma.service';
import * as request from 'supertest';

describe('Categories (Integration)', () => {
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
        email: 'cat_test@example.com',
        name: 'Cat User',
        passwordHash: 'hashed-password',
      },
    });
  });

  afterAll(async () => {
    await prisma.cleanDb();
    await app.close();
  });

  describe('POST /categories', () => {
    it('should create a new category', async () => {
      const dto = { userId, name: 'Food', color: '#FF0000' };

      const response = await request(app.getHttpServer())
        .post('/categories')
        .send(dto)
        .expect(201);

      expect(response.body).toHaveProperty('id');
      expect(response.body.name).toBe('Food');
    });
  });

  describe('GET /categories', () => {
    it('should return list of categories', async () => {
      await prisma.category.create({
        data: { userId, name: 'Transport' },
      });

      const response = await request(app.getHttpServer())
        .get('/categories')
        .expect(200);

      expect(response.body).toHaveLength(1);
      expect(response.body[0].name).toBe('Transport');
    });
  });
});
