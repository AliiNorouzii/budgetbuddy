import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // فعال‌سازی هوک‌های خاموشی برای بستن اتصالات دیتابیس
  app.enableShutdownHooks(); 
  
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
