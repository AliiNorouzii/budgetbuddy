import { Module } from '@nestjs/common';
import { AccountsModule } from './accounts/accounts.module';
import { CategoriesModule } from './categories/categories.module';
import { TransactionsModule } from './transactions/transactions.module';
import { PrismaService } from './prisma/prisma.service';

@Module({
  imports: [AccountsModule, CategoriesModule, TransactionsModule],
  providers: [PrismaService],
})
export class AppModule {}
