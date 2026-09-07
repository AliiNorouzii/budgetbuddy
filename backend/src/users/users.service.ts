import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

function generateTimeBasedRandId(): number {
  const timestampMod = Date.now() % 900000;
  return 100000 + (timestampMod % 900000);
}

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    const existingUser = await this.prisma.user.findUnique({
      where: { email: createUserDto.email },
    });

    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    return this.prisma.user.create({
      data: {
        email: createUserDto.email,
        fullName: createUserDto.fullName,
        randId: generateTimeBasedRandId(),
        credential: {
          create: {
            passwordHash: createUserDto.passwordHash,
          },
        },
      },
      select: {
        id: true,
        rowId: true,
        randId: true,
        email: true,
        fullName: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async findAll() {
    return this.prisma.user.findMany({
      select: {
        id: true,
        rowId: true,
        randId: true,
        email: true,
        fullName: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: {
        rowId: 'asc',
      },
    });
  }

  async findOne(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        rowId: true,
        randId: true,
        email: true,
        fullName: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return user;
  }

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
      include: {
        credential: true,
      },
    });
  }

  async findByRandId(randId: number) {
    const user = await this.prisma.user.findUnique({
      where: { randId },
      select: {
        id: true,
        rowId: true,
        randId: true,
        email: true,
        fullName: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      throw new NotFoundException(`User with randId ${randId} not found`);
    }

    return user;

  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    await this.findOne(id);

    return this.prisma.user.update({
      where: { id },
      data: {
        fullName: updateUserDto.fullName,
        email: updateUserDto.email,
      },
      select: {
        id: true,
        rowId: true,
        randId: true,
        email: true,
        fullName: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async remove(id: string) {
    await this.findOne(id);

    return this.prisma.user.delete({
      where: { id },
      select: {
        id: true,
        rowId: true,
        randId: true,
        email: true,
        fullName: true,
      },
    });
  }
}
