import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';

@Injectable()
export class TransactionsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createTransactionDto: CreateTransactionDto, userId: string) {
    const { accountId, categoryId, amountCents, type, description, transactionDate, notes } =
      createTransactionDto;

    const account = await this.prisma.account.findFirst({
      where: { id: accountId, userId },
    });

    if (!account) {
      throw new NotFoundException('Account not found or access denied');
    }

    const category = await this.prisma.category.findFirst({
      where: { id: categoryId, userId },
    });

    if (!category) {
      throw new NotFoundException('Category not found or access denied');
    }

    return this.prisma.transaction.create({
      data: {
        amountCents,
        type,
        description,
        transactionDate: new Date(transactionDate),
        accountId,
        categoryId,
        userId,
        ...(notes !== undefined ? { notes } : {}),
      },
      include: {
        account: true,
        category: true,
      },
    });
  }

  async findAll(userId: string) {
    return this.prisma.transaction.findMany({
      where: { userId },
      include: {
        account: true,
        category: true,
      },
      orderBy: { transactionDate: 'desc' },
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
      throw new NotFoundException('Transaction not found');
    }

    return transaction;
  }

  async update(id: string, updateTransactionDto: UpdateTransactionDto, userId: string) {
    const currentTx = await this.findOne(id, userId);

    const nextAccountId = updateTransactionDto.accountId ?? currentTx.accountId;
    const nextCategoryId = updateTransactionDto.categoryId ?? currentTx.categoryId;

    const account = await this.prisma.account.findFirst({
      where: { id: nextAccountId, userId },
    });

    if (!account) {
      throw new NotFoundException('Account not found or access denied');
    }

    const category = await this.prisma.category.findFirst({
      where: { id: nextCategoryId, userId },
    });

    if (!category) {
      throw new NotFoundException('Category not found or access denied');
    }

    return this.prisma.transaction.update({
      where: { id },
      data: {
        ...(updateTransactionDto.amountCents !== undefined ? { amountCents: updateTransactionDto.amountCents } : {}),
        ...(updateTransactionDto.type !== undefined ? { type: updateTransactionDto.type } : {}),
        ...(updateTransactionDto.description !== undefined ? { description: updateTransactionDto.description } : {}),
        ...(updateTransactionDto.transactionDate !== undefined
          ? { transactionDate: new Date(updateTransactionDto.transactionDate) }
          : {}),
        ...(updateTransactionDto.accountId !== undefined ? { accountId: updateTransactionDto.accountId } : {}),
        ...(updateTransactionDto.categoryId !== undefined ? { categoryId: updateTransactionDto.categoryId } : {}),
        ...(updateTransactionDto.notes !== undefined ? { notes: updateTransactionDto.notes } : {}),
      },
      include: {
        account: true,
        category: true,
      },
    });
  }

  async remove(id: string, userId: string) {
    const transaction = await this.findOne(id, userId);

    return this.prisma.transaction.delete({
      where: { id },
    });
  }
}
