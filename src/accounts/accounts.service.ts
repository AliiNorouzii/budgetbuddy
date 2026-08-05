import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';

@Injectable()
export class AccountsService {
  constructor(private readonly prisma: PrismaService) {}

  // در این مرحله، تا پیش از پیاده‌سازی Login/JWT،
  // کاربر توسعه را با ایمیل ثابت پیدا می‌کنیم.
  private async getDevelopmentUser() {
    const user = await this.prisma.user.findUnique({
      where: {
        email: 'ali@budgetbuddy.local',
      },
    });

    if (!user) {
      throw new NotFoundException(
        'Development user not found. Run "npx prisma db seed" first.',
      );
    }

    return user;
  }

  // ایجاد حساب جدید
  async create(createAccountDto: CreateAccountDto) {
    const user = await this.getDevelopmentUser();

    return this.prisma.account.create({
      data: {
        userId: user.id,
        name: createAccountDto.name,
        type: createAccountDto.type,
        balanceCents: createAccountDto.balanceCents ?? 0,
      },
    });
  }

  // دریافت همه حساب‌های کاربر فعلی
  async findAll() {
    const user = await this.getDevelopmentUser();

    return this.prisma.account.findMany({
      where: {
        userId: user.id,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  // دریافت یک حساب مشخص
  async findOne(id: string) {
    const user = await this.getDevelopmentUser();

    const account = await this.prisma.account.findFirst({
      where: {
        id,
        userId: user.id,
      },
    });

    if (!account) {
      throw new NotFoundException('Account not found');
    }

    return account;
  }

  // ویرایش حساب
  async update(id: string, updateAccountDto: UpdateAccountDto) {
    // ابتدا مطمئن می‌شویم حساب وجود دارد و متعلق به کاربر فعلی است.
    await this.findOne(id);

    return this.prisma.account.update({
      where: {
        id,
      },
      data: {
        name: updateAccountDto.name,
        type: updateAccountDto.type,
        balanceCents: updateAccountDto.balanceCents,
      },
    });
  }

  // حذف حساب
  async remove(id: string) {
    // ابتدا مطمئن می‌شویم حساب وجود دارد و متعلق به کاربر فعلی است.
    await this.findOne(id);

    return this.prisma.account.delete({
      where: {
        id,
      },
    });
  }
}
