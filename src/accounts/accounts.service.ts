import { Injectable, NotFoundException } from '@nestjs/common';
import { AccountType } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';

@Injectable()
export class AccountsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: string, dto: CreateAccountDto) {
    return this.prisma.account.create({
      data: {
        userId,
        name: dto.name,
        type: dto.type ? (dto.type as AccountType) : AccountType.CASH,
      },
    });
  }

  async findAllForUser(userId: string) {
    return this.prisma.account.findMany({
      where: { userId },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findAll(userId: string) {
    return this.findAllForUser(userId);
  }

  async findOne(userId: string, id: string) {
    const account = await this.prisma.account.findFirst({
      where: {
        id,
        userId,
      },
    });

    if (!account) {
      throw new NotFoundException('حساب موردنظر پیدا نشد.');
    }

    return account;
  }

  async update(userId: string, id: string, dto: UpdateAccountDto) {
    await this.findOne(userId, id);

    return this.prisma.account.update({
      where: { id },
      data: {
        ...(dto.name !== undefined && {
          name: dto.name,
        }),
        ...(dto.type !== undefined && {
          type: dto.type as AccountType,
        }),
      },
    });
  }

  async remove(userId: string, id: string) {
    await this.findOne(userId, id);

    return this.prisma.account.delete({
      where: { id },
    });
  }
}
