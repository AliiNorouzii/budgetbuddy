import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import * as crypto from 'crypto';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

const SESSION_TTL_MS = 24 * 60 * 60 * 1000; // ۲۴ ساعت

@Injectable()
export class AuthService {
  constructor(private readonly prisma: PrismaService) {}

  private hashToken(token: string): string {
    return crypto
      .createHash('sha256')
      .update(token)
      .digest('hex');
  }

  private async createSession(userId: string) {
    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + SESSION_TTL_MS);

    await this.prisma.session.create({
      data: {
        userId,
        sessionTokenHash: this.hashToken(token),
        expiresAt,
      },
    });

    return { token, expiresAt };
  }

  private async issueNewSessionToken(
    userId: string,
    issuedAt: Date,
    previousTokenHash: string,
  ): Promise<{ token: string; expiresAt: Date }> {
    const newToken = crypto.randomBytes(32).toString('hex');
    const newExpiresAt = new Date(issuedAt.getTime() + SESSION_TTL_MS);

    await this.prisma.session.deleteMany({
      where: {
        sessionTokenHash: previousTokenHash,
      },
    });

    await this.prisma.session.create({
      data: {
        userId,
        sessionTokenHash: this.hashToken(newToken),
        expiresAt: newExpiresAt,
      },
    });

    return { token: newToken, expiresAt: newExpiresAt };
  }

  async validateAndRenewSession(
    token: string | undefined,
  ): Promise<{
    user?: { id: string; name: string; email: string };
    newToken?: string;
    expiresAt?: Date;
  }> {
    if (!token) return {};

    const tokenHash = this.hashToken(token);
    const session = await this.prisma.session.findUnique({
      where: { sessionTokenHash: tokenHash },
      include: {
        user: {
          select: { id: true, name: true, email: true },
        },
      },
    });

    if (!session) return {};

    const now = new Date();

    // انقضای کامل — حذف سشن و رد دسترسی
    if (session.expiresAt <= now) {
      await this.prisma.session.delete({
        where: { id: session.id },
      });
      return {};
    }

    // پنجره لغزان: تمدید سشن در ۳۰ دقیقه پایانی
    const RENEW_WINDOW_MS =30 * 60 * 1000;
    const timeLeftMs = session.expiresAt.getTime() - now.getTime();

    if (timeLeftMs <= RENEW_WINDOW_MS) {

      const renewed = await this.issueNewSessionToken(
        session.userId,
        now,
        tokenHash,
      );

      return {
        user: session.user,
        newToken: renewed.token,
        expiresAt: renewed.expiresAt,
      };
    }

    return { user: session.user };
  }

  async register(dto: RegisterDto) {
    const email = dto.email.toLowerCase().trim();

    const existing = await this.prisma.user.findUnique({
      where: { email },
    });
    if (existing) {
      throw new ConflictException('کاربری با این ایمیل قبلاً ثبت‌نام کرده است.');
    }

    const passwordHash = await bcrypt.hash(dto.password, 10);

    const user = await this.prisma.user.create({
      data: {
        name: dto.name,
        email,
        passwordHash,
      },
    });

    return user;
  }

  async validateUser(email: string, password: string) {
    const normalized = email.toLowerCase().trim();
    const user = await this.prisma.user.findUnique({
      where: { email: normalized },
    });

    if (!user) return null;

    const ok = await bcrypt.compare(password, user.passwordHash);
    return ok ? user : null;
  }

  async login(dto: LoginDto) {
    const user = await this.validateUser(dto.email, dto.password);
    if (!user) {
      throw new UnauthorizedException('ایمیل یا کلمه عبور اشتباه است.');
    }

    const { token, expiresAt } = await this.createSession(user.id);

    return {
      user: { id: user.id, name: user.name, email: user.email },
      token,
      expiresAt,
    };
  }

  async logout(token: string | undefined) {
    if (!token) return;

    await this.prisma.session.deleteMany({
      where: { sessionTokenHash: this.hashToken(token },
    });
  }
}
