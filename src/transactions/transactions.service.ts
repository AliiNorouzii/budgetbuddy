import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { TransactionType } from '@prisma/client';

@Injectable()
export class TransactionsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createTransactionDto: CreateTransactionDto) {
    const { userId, accountId, categoryId, amountCents, type, description, notes, transactionDate } = createTransactionDto;

    // ۱. بررسی وجود حساب کاربری متعلق به همین کاربر
    const account = await this.prisma.account.findFirst({
      where: { id: accountId, userId },
    });
    if (!account) {
      throw new NotFoundException(`Account with ID "${accountId}" not found for this user.`);
    }

    // ۲. بررسی وجود دسته‌بندی متعلق به همین کاربر (در صورت ارسال)
    if (categoryId) {
      const category = await this.prisma.category.findFirst({
        where: { id: categoryId, userId },
      });
      if (!category) {
        throw new NotFoundException(`Category with ID "${categoryId}" not found for this user.`);
      }
    }

    // ۳. ایجاد تراکنش
    const transaction = await this.prisma.transaction.create({
      data: {
        userId,
        accountId,
        categoryId: categoryId || null,
        type,
        description,
        amountCents,
        notes,
        transactionDate: new Date(transactionDate),
      },
    });

    // ۴. به‌روزرسانی موجودی حساب (balanceCents)
    const balanceChange = type === TransactionType.INCOME ? amountCents : -amountCents;
    await this.prisma.account.update({
      where: { id: accountId },
      data: {
        balanceCents: {
          increment: balanceChange,
        },
      },
    });

    return transaction;
  }

  async findAll(userId: string) {
    return this.prisma.transaction.findMany({
      where: { userId },
      include: {
        account: true,
        category: true,
      },
    });
  }

  async findOne(id: string, userId: string) {
    const transaction = await this.prisma.transaction.findFirst({
      where: { id, userId },
      include: {
        account: true,
        category: true,
      },
    });

    if (!transaction) {
      throw new NotFoundException(`Transaction with ID "${id}" not found.`);
    }

    return transaction;
  }

  async update(id: string, userId: string, updateTransactionDto: UpdateTransactionDto) {
    // ۱. پیدا کردن تراکنش فعلی و اطمینان از وجود آن
    const currentTx = await this.findOne(id, userId);

    const { accountId, categoryId, amountCents, type, description, notes, transactionDate } = updateTransactionDto;

    // ۲. بررسی دسته‌بندی در صورت ویرایش
    if (categoryId) {
      const category = await this.prisma.category.findFirst({
        where: { id: categoryId, userId },
      });
      if (!category) {
        throw new NotFoundException(`Category with ID "${categoryId}" not found for this user.`);
      }
    }

    // ۳. بررسی حساب در صورت ویرایش
    if (accountId && accountId !== currentTx.accountId) {
      const targetAccount = await this.prisma.account.findFirst({
        where: { id: accountId, userId },
      });
      if (!targetAccount) {
        throw new NotFoundException(`Account with ID "${accountId}" not found for this user.`);
      }
    }

    // محاسبه تغییرات بالانس حساب
    const finalAccountId = accountId || currentTx.accountId;
    const finalType = type || currentTx.type;
    const finalAmountCents = amountCents !== undefined ? amountCents : currentTx.amountCents;

    // بازگرداندن اثر تراکنش قبلی
    const oldEffect = currentTx.type === TransactionType.INCOME ? currentTx.amountCents : -currentTx.amountCents;
    // اعمال اثر تراکنش جدید
    const newEffect = finalType === TransactionType.INCOME ? finalAmountCents : -finalAmountCents;

    if (finalAccountId === currentTx.accountId) {
      // ویرایش روی همان حساب
      const diff = newEffect - oldEffect;
      await this.prisma.account.update({
        where: { id: currentTx.accountId },
        data: {
          balanceCents: {
            increment: diff,
          },
        },
      });
    } else {
      // انتقال تراکنش به یک حساب دیگر
      // حذف اثر از حساب قبلی
      await this.prisma.account.update({
        where: { id: currentTx.accountId },
        data: {
          balanceCents: {
            decrement: oldEffect,
          },
        },
      });
      // اضافه کردن اثر به حساب جدید
      await this.prisma.account.update({
        where: { id: finalAccountId },
        data: {
          balanceCents: {
            increment: newEffect,
          },
        },
      });
    }

    // ۴. اعمال تغییرات تراکنش در دیتابیس
    return this.prisma.transaction.update({
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
  }

  async remove(id: string, userId: string) {
    const transaction = await this.findOne(id, userId);

    // معکوس کردن اثر مالی تراکنش روی حساب قبل از حذف
    const balanceChange = transaction.type === TransactionType.INCOME ? -transaction.amountCents : transaction.amountCents;

    await this.prisma.account.update({
      where: { id: transaction.accountId },
      data: {
        balanceCents: {
          increment: balanceChange,
        },
      },
    });

    return this.prisma.transaction.delete({
      where: { id },
    });
  }
}
