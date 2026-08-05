import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { AccountsModule } from './accounts/accounts.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    // ۱. ثبت پکیج تنظیمات به صورت سراسری برای لود کردن .env
    ConfigModule.forRoot({
      isGlobal: true, 
      envFilePath: '.env', // به صورت صریح فایل تنظیمات را آدرس‌دهی می‌کنیم
    }),
    // ۲. سایر ماژول‌ها که به متغیرهای محیطی نیاز دارند
    PrismaModule,
    AccountsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
