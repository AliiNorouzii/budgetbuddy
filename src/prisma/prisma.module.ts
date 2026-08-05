import { Module, Global } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Global() // این باعث می‌شود در کل پروژه در دسترس باشد
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
