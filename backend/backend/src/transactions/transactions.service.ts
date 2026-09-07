import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';

@Injectable()
export class TransactionsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createTransactionDto: CreateTransactionDto) {
    const {
      amount,
      type,
      description,
      accountId,
      categoryId,
      transactionDate,
      userId,
    } = createTransactionDto;

    return this.prisma.$transaction(async (tx) => {
      const account = await tx.account.findFirst({
        where: { id: accountId, userId },
      });

      if (!account) {
        throw new NotFoundException(`حسابی با شناسه ${accountId} برای این کاربر یافت نشد.`);
      }

      if (categoryId) {
        const category = await tx.category.findFirst({
          where: { id: categoryId, userId },
        });

        if (!category) {
          throw new NotFoundException(`دسته‌بندی با شناسه ${categoryId} برای این کاربر یافت نشد.`);
        }
      }

      return tx.transaction.create({
        data: {
          amountCents: amount,
          type,
          description: description ?? '',
          accountId,
          categoryId: categoryId ?? null,
          userId,
          transactionDate: transactionDate ? new Date(transactionDate) : new Date(),
        },
      });
    });
  }

  async findAll(userId: string) {
    const userExists = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!userExists) {
      throw new NotFoundException(`کاربری با شناسه ${userId} یافت نشد.`);
    }

    return this.prisma.transaction.findMany({
      where: { userId },
      include: {
        account: { select: { name: true } },
        category: { select: { name: true, color: true, icon: true } },
      },
      orderBy: { transactionDate: 'desc' },
    });
  }

  async findOne(id: string, userId: string) {
    const transaction = await this.prisma.transaction.findFirst({
      where: { id, userId },
      include: {
        account: { select: { name: true } },
        category: { select: { name: true, color: true, icon: true } },
      },
    });

    if (!transaction) {
      throw new NotFoundException(`تراکنشی با شناسه ${id} برای این کاربر یافت نشد.`);
    }

    return transaction;
  }

  async update(id: string, userId: string, updateTransactionDto: UpdateTransactionDto) {
    return this.prisma.$transaction(async (tx) => {
      const currentTx = await tx.transaction.findFirst({
        where: { id, userId },
      });

      if (!currentTx) {
        throw new NotFoundException(`تراکنشی با شناسه ${id} یافت نشد.`);
      }

      const targetAccountId = updateTransactionDto.accountId ?? currentTx.accountId;
      const targetCategoryId =
        updateTransactionDto.categoryId !== undefined
          ? updateTransactionDto.categoryId
          : currentTx.categoryId;

      if (targetAccountId !== currentTx.accountId) {
        const targetAccount = await tx.account.findFirst({
          where: { id: targetAccountId, userId },
        });

        if (!targetAccount) {
          throw new NotFoundException(`حساب مورد نظر یافت نشد.`);
        }
      }

      if (targetCategoryId) {
        const targetCategory = await tx.category.findFirst({
          where: { id: targetCategoryId, userId },
        });

        if (!targetCategory) {
          throw new NotFoundException(`دسته‌بندی مورد نظر یافت نشد.`);
        }
      }

      return tx.transaction.update({
        where: { id },
        data: {
          amountCents:
            updateTransactionDto.amount !== undefined
              ? updateTransactionDto.amount
              : currentTx.amountCents,
          type: updateTransactionDto.type ?? currentTx.type,
          description: updateTransactionDto.description ?? currentTx.description,
          accountId: targetAccountId,
          categoryId: targetCategoryId ?? null,
          transactionDate: updateTransactionDto.transactionDate
            ? new Date(updateTransactionDto.transactionDate)
            : currentTx.transactionDate,
        },
      });
    });
  }

  async remove(id: string, userId: string) {
    return this.prisma.$transaction(async (tx) => {
      const transaction = await tx.transaction.findFirst({
        where: { id, userId },
      });

      if (!transaction) {
        throw new NotFoundException(`تراکنشی با شناسه ${id} یافت نشد.`);
      }

      return tx.transaction.delete({
        where: { id },
      });
    });
  }
}
