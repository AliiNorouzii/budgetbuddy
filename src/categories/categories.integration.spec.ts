import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { AppModule } from '../app.module';
import { PrismaService } from '../prisma/prisma.service';
const request = require('supertest');

describe('CategoriesController (Integration)', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
    await app.init();

    prisma = moduleFixture.get<PrismaService>(PrismaService);
  });

  beforeEach(async () => {
    // ابتدا رکوردهای قبلی که به کاربر مرتبط هستند را پاک می‌کنیم
    await prisma.category.deleteMany({});
    await prisma.user.deleteMany({});
  });

  afterAll(async () => {
    await app.close();
  });

  describe('POST /categories', () => {
    it('should create a new category', async () => {
      // ایجاد یک کاربر موقت برای برقراری کلید خارجی
      const user = await prisma.user.create({
        data: {
          id: 'test-user-id-cat',
          email: 'cat-test@example.com',
          name: 'Cat Test User',
          password: 'securepassword123',
        },
      });

      const categoryData = {
        userId: user.id,
        name: 'Groceries',
        color: '#FF5733',
        icon: 'shopping-cart',
      };

      const response = await request(app.getHttpServer())
        .post('/categories')
        .send(categoryData)
        .expect(201);

      expect(response.body).toHaveProperty('id');
      expect(response.body.name).toBe(categoryData.name);
      expect(response.body.userId).toBe(categoryData.userId);
      expect(response.body.color).toBe(categoryData.color);
      expect(response.body.icon).toBe(categoryData.icon);

      // بررسی ثبت در دیتابیس
      const categoryInDb = await prisma.category.findUnique({
        where: { id: response.body.id },
      });
      expect(categoryInDb).toBeTruthy();
    });

    it('should fail validation if name is missing', async () => {
      const response = await request(app.getHttpServer())
        .post('/categories')
        .send({
          userId: 'some-user-id',
        })
        .expect(400);

      expect(response.body.message).toContain('name must be a string');
    });
  });

  describe('GET /categories', () => {
    it('should return a list of categories', async () => {
      const user = await prisma.user.create({
        data: {
          id: 'test-user-id-cat-2',
          email: 'cat-test-2@example.com',
          name: 'Cat Test User 2',
          password: 'securepassword123',
        },
      });

      await prisma.category.create({
        data: {
          userId: user.id,
          name: 'Utilities',
          color: '#00FF00',
          icon: 'bolt',
        },
      });

      const response = await request(app.getHttpServer())
        .get('/categories')
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThanOrEqual(1);
      expect(response.body[0].name).toBe('Utilities');
    });
  });
});
