import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';

@Injectable()
export class TransactionsService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, createTransactionDto: CreateTransactionDto) {
    const { accountId, amountCents, type, categoryId } = createTransactionDto;

    return await this.prisma.$transaction(async (tx) => {
      // ۱. بررسی موجودی و ثبت تراکنش
      const transaction = await tx.transaction.create({
        data: {
          ...createTransactionDto,
          userId,
        },
      });

      // ۲. به‌روزرسانی موجودی حساب
      const adjustment = type === 'INCOME' ? amountCents : -amountCents;
      await tx.account.update({
        where: { id: accountId, userId },
        data: {
          balanceCents: { increment: adjustment },
        },
      });

      return transaction;
    });
  }

  async findAll(userId: string) {
    return this.prisma.transaction.findMany({
      where: { userId },
      orderBy: { transactionDate: 'desc' },
    });
  }
}
