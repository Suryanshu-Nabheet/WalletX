import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { PrismaService } from '../prisma/prisma.service';
import { AuditService } from '../audit/audit.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private prisma: PrismaService,
    private configService: ConfigService,
    private auditService: AuditService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.usersService.findByEmail(email);
    if (!user || !user.passwordHash) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const { passwordHash, ...result } = user;
    return result;
  }

  async signUp(email: string, password: string, ip?: string, userAgent?: string) {
    const existingUser = await this.usersService.findByEmail(email);
    if (existingUser) {
      throw new BadRequestException('User already exists');
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const user = await this.usersService.create({
      email,
      passwordHash,
    });

    await this.auditService.log(user.id, 'user.created', {}, ip, userAgent);

    return this.generateTokens(user.id, email);
  }

  async login(userId: string, email: string, ip?: string, userAgent?: string) {
    await this.prisma.user.update({
      where: { id: userId },
      data: { lastLogin: new Date() },
    });

    await this.auditService.log(userId, 'login.success', {}, ip, userAgent);

    return this.generateTokens(userId, email);
  }

  async refreshToken(refreshToken: string, ip?: string, userAgent?: string) {
    try {
      const refreshSecret = this.configService.get<string>('JWT_REFRESH_SECRET');
      const payload = this.jwtService.verify(refreshToken, { secret: refreshSecret });

      const session = await this.prisma.session.findFirst({
        where: {
          userId: payload.sub,
          expiresAt: { gt: new Date() },
        },
      });

      if (!session) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      const user = await this.usersService.findById(payload.sub);
      if (!user) {
        throw new UnauthorizedException('User not found');
      }

      return this.generateTokens(user.id, user.email);
    } catch (error) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  async logout(userId: string, refreshToken: string) {
    // In a real implementation, you'd hash the refresh token and delete the session
    await this.prisma.session.deleteMany({
      where: {
        userId,
      },
    });

    await this.auditService.log(userId, 'logout.success', {});
  }

  async generateTokens(userId: string, email: string) {
    const payload = { sub: userId, email };
    const refreshSecret = this.configService.get<string>('JWT_REFRESH_SECRET');
    const refreshExpiresIn = this.configService.get<string>('JWT_REFRESH_EXPIRES_IN', '7d');

    const accessToken = this.jwtService.sign(payload);
    const refreshToken = this.jwtService.sign(payload, {
      secret: refreshSecret,
      expiresIn: refreshExpiresIn,
    });

    // Store refresh token hash in database
    const refreshTokenHash = await bcrypt.hash(refreshToken, 10);
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // 7 days

    await this.prisma.session.create({
      data: {
        userId,
        refreshTokenHash,
        expiresAt,
      },
    });

    return {
      accessToken,
      refreshToken,
      user: {
        id: userId,
        email,
      },
    };
  }

  async validateOAuthUser(profile: any, provider: string) {
    let user = await this.prisma.user.findFirst({
      where: {
        oauthProvider: provider,
        oauthId: profile.id,
      },
    });

    if (!user) {
      // Check if user exists with same email
      user = await this.usersService.findByEmail(profile.emails?.[0]?.value);
      if (user) {
        // Link OAuth to existing account
        user = await this.prisma.user.update({
          where: { id: user.id },
          data: {
            oauthProvider: provider,
            oauthId: profile.id,
          },
        });
      } else {
        // Create new user
        user = await this.usersService.create({
          email: profile.emails?.[0]?.value,
          oauthProvider: provider,
          oauthId: profile.id,
        });
      }
    }

    return user;
  }
}

