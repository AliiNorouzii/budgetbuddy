import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(private readonly prisma: PrismaService) {}

  async register(dto: RegisterDto) {
    const normalizedEmail = dto.email.toLowerCase().trim();

    const existingUser = await this.prisma.user.findUnique({
      where: {
        email: normalizedEmail,
      },
    });

    if (existingUser) {
      throw new ConflictException(
        'کاربری با این ایمیل قبلاً ثبت‌نام کرده است.',
      );
    }

    const passwordHash = await bcrypt.hash(dto.password, 10);

    const user = await this.prisma.user.create({
      data: {
        name: dto.name,
        email: normalizedEmail,
        passwordHash,
      },
    });

    return this.createSession(user.id);
  }

  async validateUser(email: string, password: string) {
    const normalizedEmail = email.toLowerCase().trim();

    const user = await this.prisma.user.findUnique({
      where: {
        email: normalizedEmail,
      },
    });

    if (!user) {
      return null;
    }

    const passwordIsValid = await bcrypt.compare(password, user.passwordHash);

    if (!passwordIsValid) {
      return null;
    }

    return user;
  }

  async login(email: string, password: string) {
    const user = await this.validateUser(email, password);

    if (!user) {
      throw new UnauthorizedException('ایمیل یا کلمه عبور اشتباه است.');
    }

    return this.createSession(user.id);
  }

  async createSession(userId: string) {
    const sessionToken = crypto.randomBytes(32).toString('hex');

    const sessionTokenHash = crypto
      .createHash('sha256')
      .update(sessionToken)
      .digest('hex');

    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

    await this.prisma.session.create({
      data: {
        userId,
        sessionTokenHash,
        expiresAt,
      },
    });

    const user = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        id: true,
        name: true,
        email: true,
      },
    });

    return {
      sessionToken,
      expiresAt,
      user,
    };
  }

  async validateSession(sessionToken: string) {
    const sessionTokenHash = crypto
      .createHash('sha256')
      .update(sessionToken)
      .digest('hex');

    const session = await this.prisma.session.findUnique({
      where: {
        sessionTokenHash,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    if (!session) {
      return null;
    }

    if (session.expiresAt <= new Date()) {
      await this.prisma.session.delete({
        where: {
          id: session.id,
        },
      });

      return null;
    }

    return session.user;
  }

  async logout(sessionToken: string) {
    const sessionTokenHash = crypto
      .createHash('sha256')
      .update(sessionToken)
      .digest('hex');

    await this.prisma.session.deleteMany({
      where: {
        sessionTokenHash,
      },
    });

    return {
      message: 'خروج از حساب با موفقیت انجام شد.',
    };
  }
}
