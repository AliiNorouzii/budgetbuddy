import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { TransactionType } from '@prisma/client';

@Injectable()
export class TransactionsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createTransactionDto: CreateTransactionDto) {
    const { userId, accountId, categoryId, amountCents, type, description, notes, transactionDate } = createTransactionDto;

    return await this.prisma.$transaction(async (tx) => {
      // ۱. بررسی وجود حساب و دسته‌بندی
      const account = await tx.account.findFirst({ where: { id: accountId, userId } });
      if (!account) throw new NotFoundException('Account not found');

      if (categoryId) {
        const category = await tx.category.findFirst({ where: { id: categoryId, userId } });
        if (!category) throw new NotFoundException('Category not found');
      }

      // ۲. ایجاد تراکنش
      const transaction = await tx.transaction.create({
        data: { userId, accountId, categoryId: categoryId || null, type, description, amountCents, notes, transactionDate: new Date(transactionDate) },
      });

      // ۳. آپدیت موجودی
      const balanceChange = type === TransactionType.INCOME ? amountCents : -amountCents;
      await tx.account.update({
        where: { id: accountId },
        data: { balanceCents: { increment: balanceChange } },
      });

      return transaction;
    });
  }

  async findAll(userId: string) {
    return this.prisma.transaction.findMany({
      where: { userId },
      include: { account: true, category: true },
    });
  }

  async findOne(id: string, userId: string) {
    const transaction = await this.prisma.transaction.findFirst({
      where: { id, userId },
      include: { account: true, category: true },
    });
    if (!transaction) throw new NotFoundException('Transaction not found');
    return transaction;
  }

  async update(id: string, userId: string, updateTransactionDto: UpdateTransactionDto) {
    const currentTx = await this.findOne(id, userId);

    return await this.prisma.$transaction(async (tx) => {
      const { accountId, categoryId, amountCents, type, description, notes, transactionDate } = updateTransactionDto;

      const finalAccountId = accountId || currentTx.accountId;
      const finalType = type || currentTx.type;
      const finalAmountCents = amountCents !== undefined ? amountCents : currentTx.amountCents;

      // بررسی دسترسی حساب جدید
      if (accountId && accountId !== currentTx.accountId) {
        const targetAccount = await tx.account.findFirst({ where: { id: accountId, userId } });
        if (!targetAccount) throw new NotFoundException('Target account not found');
      }

      // محاسبه تغییرات
      const oldEffect = currentTx.type === TransactionType.INCOME ? currentTx.amountCents : -currentTx.amountCents;
      const newEffect = finalType === TransactionType.INCOME ? finalAmountCents : -finalAmountCents;

      // معکوس کردن اثر قبلی
      await tx.account.update({
        where: { id: currentTx.accountId },
        data: { balanceCents: { decrement: oldEffect } },
      });

      // اعمال اثر جدید
      await tx.account.update({
        where: { id: finalAccountId },
        data: { balanceCents: { increment: newEffect } },
      });

      // آپدیت تراکنش
      return await tx.transaction.update({
        where: { id },
        data: {
          accountId: finalAccountId,
          categoryId: categoryId === undefined ? currentTx.categoryId : (categoryId || null),
          type: finalType,
          description: description !== undefined ? description : currentTx.description,
          amountCents: finalAmountCents,
          notes: notes !== undefined ? notes : currentTx.notes,
          transactionDate: transactionDate ? new Date(transactionDate) : currentTx.transactionDate,
        },
      });
    });
  }

  async remove(id: string, userId: string) {
    const transaction = await this.findOne(id, userId);

    return await this.prisma.$transaction(async (tx) => {
      const balanceChange = transaction.type === TransactionType.INCOME ? -transaction.amountCents : transaction.amountCents;

      await tx.account.update({
        where: { id: transaction.accountId },
        data: { balanceCents: { increment: balanceChange } },
      });

      return await tx.transaction.delete({ where: { id } });
    });
  }
}
