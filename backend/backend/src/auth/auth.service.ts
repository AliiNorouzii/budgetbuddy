import {
  Injectable,
  ConflictException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async register(dto: { email: string; password: string; fullName?: string }) {
    const { email, password, fullName } = dto;

    const existingUser = await this.prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new ConflictException('ایمیل وارد شده قبلاً ثبت شده است.');
    }

    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    const user = await this.prisma.user.create({
      data: {
        email,
        fullName,
        credential: {
          create: {
            passwordHash,
          },
        },
      },
      select: {
        id: true,
        email: true,
        fullName: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return user;
  }

  async validateUser(email: string, pass: string) {
    const user = await this.prisma.user.findUnique({
      where: { email },
      include: {
        credential: true,
      },
    });

    if (!user || !user.credential) {
      return null;
    }

    const isMatch = await bcrypt.compare(pass, user.credential.passwordHash);
    if (!isMatch) {
      return null;
    }

    const { credential, ...safeUser } = user;
    return safeUser;
  }

  async login(dto: { email: string; password: string }) {
    const user = await this.validateUser(dto.email, dto.password);

    if (!user) {
      throw new UnauthorizedException('ایمیل یا رمز عبور نامعتبر است.');
    }

    const payload = {
      sub: user.id,
      email: user.email,
      fullName: user.fullName,
    };

    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
      },
    };
  }
}
