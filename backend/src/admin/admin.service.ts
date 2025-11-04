import { Injectable, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}

  async isAdmin(userId: string): Promise<boolean> {
    // TODO: Implement proper admin check (e.g., role-based)
    // For now, return false
    return false;
  }

  async getUsers(limit = 100, offset = 0) {
    // Only admins can access
    return this.prisma.user.findMany({
      take: limit,
      skip: offset,
      select: {
        id: true,
        email: true,
        createdAt: true,
        lastLogin: true,
        twoFaEnabled: true,
        oauthProvider: true,
        // Never return sensitive data
      },
    });
  }

  async getUserAuditLogs(userId: string, limit = 100) {
    return this.prisma.auditLog.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });
  }

  async getUserWallets(userId: string) {
    // Return wallets without encrypted blobs
    return this.prisma.wallet.findMany({
      where: { userId },
      select: {
        id: true,
        chain: true,
        address: true,
        mode: true,
        createdAt: true,
        // Never return encryptedBlob
      },
    });
  }
}

