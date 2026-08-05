import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  private pool: Pool;

  constructor() {
    // 1. خواندن رشته اتصال از متغیرهای محیطی
    const connectionString = process.env.DATABASE_URL;
    
    if (!connectionString) {
      throw new Error('DATABASE_URL is not defined in environment variables');
    }

    // 2. ساخت Pool با مشخص کردن صریح connectionString
    const pool = new Pool({ connectionString });
    
    // 3. ایجاد آداپتور PrismaPg
    const adapter = new PrismaPg(pool);

    // 4. پاس دادن آداپتور به سازنده کلاس پدر (PrismaClient)
    super({ adapter });
    
    this.pool = pool;
  }

  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
    await this.pool.end();
  }
}
