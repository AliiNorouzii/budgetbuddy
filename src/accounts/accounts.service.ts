// backend/src/accounts/accounts.service.ts

import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';

@Injectable()
export class AccountsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: string, dto: CreateAccountDto) {
    const userExists = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { id: true },
    });

    if (!userExists) {
      throw new NotFoundException('User not found');
    }

    return this.prisma.account.create({
      data: {
        userId,
        name: dto.name,
        type: dto.type,
        balanceCents: dto.balanceCents,
      },
    });
  }

  async findAllForUser(userId: string) {
    return this.prisma.account.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(userId: string, accountId: string) {
    const account = await this.prisma.account.findFirst({
      where: {
        id: accountId,
        userId,
      },
    });

    if (!account) {
      throw new NotFoundException('Account not found');
    }

    return account;
  }

  async update(
    userId: string,
    accountId: string,
    dto: UpdateAccountDto,
  ) {
    const account = await this.prisma.account.findFirst({
      where: {
        id: accountId,
        userId,
      },
      select: {
        id: true,
      },
    });

    if (!account) {
      throw new NotFoundException('Account not found');
    }

    return this.prisma.account.update({
      where: {
        id: accountId,
      },
      data: {
        ...(dto.name !== undefined && { name: dto.name }),
        ...(dto.type !== undefined && { type: dto.type }),
        ...(dto.balanceCents !== undefined && {
          balanceCents: dto.balanceCents,
        }),
      },
    });
  }
}
