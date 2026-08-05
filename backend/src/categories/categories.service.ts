import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoriesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createCategoryDto: CreateCategoryDto) {
    const { name, color, icon, userId } = createCategoryDto;

    // ۱. بررسی وجود کاربر
    const userExists = await this.prisma.user.findUnique({
      where: { id: userId },
    });
    if (!userExists) {
      throw new NotFoundException(`کاربری با شناسه ${userId} یافت نشد.`);
    }

    // ۲. بررسی تکراری نبودن نام دسته‌بندی برای این کاربر
    const existingCategory = await this.prisma.category.findUnique({
      where: {
        userId_name: {
          userId,
          name,
        },
      },
    });
    if (existingCategory) {
      throw new ConflictException(`دسته‌بندی با نام "${name}" قبلاً برای این کاربر ایجاد شده است.`);
    }

    // ۳. ایجاد دسته‌بندی جدید
    return this.prisma.category.create({
      data: {
        name,
        color,
        icon,
        userId,
      },
    });
  }

  async findAll(userId: string) {
    // ۱. بررسی وجود کاربر
    const userExists = await this.prisma.user.findUnique({
      where: { id: userId },
    });
    if (!userExists) {
      throw new NotFoundException(`کاربری با شناسه ${userId} یافت نشد.`);
    }

    // ۲. بازگرداندن تمام دسته‌بندی‌های کاربر
    return this.prisma.category.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string, userId: string) {
    const category = await this.prisma.category.findFirst({
      where: { id, userId },
    });

    if (!category) {
      throw new NotFoundException(`دسته‌بندی مورد نظر با شناسه ${id} برای این کاربر یافت نشد.`);
    }

    return category;
  }

  async update(id: string, userId: string, updateCategoryDto: UpdateCategoryDto) {
    // ۱. ابتدا بررسی می‌کنیم که آیا دسته‌بندی متعلق به این کاربر هست یا خیر
    const category = await this.findOne(id, userId);

    // ۲. اگر نام قرار است تغییر کند، بررسی کنیم با دیگر نام‌های کاربر تداخل نداشته باشد
    if (updateCategoryDto.name && updateCategoryDto.name !== category.name) {
      const existingCategory = await this.prisma.category.findUnique({
        where: {
          userId_name: {
            userId,
            name: updateCategoryDto.name,
          },
        },
      });
      if (existingCategory) {
        throw new ConflictException(`دسته‌بندی با نام "${updateCategoryDto.name}" قبلاً برای این کاربر ثبت شده است.`);
      }
    }

    // ۳. بروزرسانی
    return this.prisma.category.update({
      where: { id },
      data: {
        name: updateCategoryDto.name,
        color: updateCategoryDto.color,
        icon: updateCategoryDto.icon,
      },
    });
  }

  async remove(id: string, userId: string) {
    // ۱. بررسی وجود و مالکیت
    await this.findOne(id, userId);

    // ۲. حذف فیزیکی دسته‌بندی
    return this.prisma.category.delete({
      where: { id },
    });
  }
}
