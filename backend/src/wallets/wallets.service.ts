import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuditService } from '../audit/audit.service';
import { WalletMode } from '@walletx/shared';
import { ethers } from 'ethers';
import * as crypto from 'crypto';

@Injectable()
export class WalletsService {
  constructor(
    private prisma: PrismaService,
    private auditService: AuditService,
  ) {}

  async createWallet(
    userId: string,
    chain: string,
    mode: WalletMode,
    encryptedBlob?: any,
    address?: string,
    ip?: string,
    userAgent?: string,
  ) {
    // Check if wallet already exists for this user + chain
    const existing = await this.prisma.wallet.findUnique({
      where: {
        userId_chain: {
          userId,
          chain,
        },
      },
    });

    if (existing) {
      throw new BadRequestException('Wallet already exists for this chain');
    }

    // For non-custodial: client provides encryptedBlob and address
    // For custodial: server generates key and stores encrypted in KMS
    let walletAddress = address;
    let kmsKeyId: string | null = null;

    if (mode === WalletMode.CUSTODIAL) {
      // Generate wallet for custodial mode
      // In production, this would use AWS KMS or similar
      const wallet = ethers.Wallet.createRandom();
      walletAddress = wallet.address;
      
      // TODO: Encrypt private key with KMS
      // For now, we'll store a placeholder
      kmsKeyId = `kms-key-${crypto.randomUUID()}`;
      
      // In production: Store encrypted private key in KMS
      // const encryptedKey = await this.encryptWithKMS(wallet.privateKey);
    }

    if (!walletAddress) {
      throw new BadRequestException('Wallet address is required');
    }

    const wallet = await this.prisma.wallet.create({
      data: {
        userId,
        chain,
        address: walletAddress,
        encryptedBlob: encryptedBlob || null,
        mode,
        kmsKeyId,
      },
    });

    await this.auditService.log(
      userId,
      'wallet.created',
      { walletId: wallet.id, chain, mode },
      ip,
      userAgent,
    );

    return wallet;
  }

  async getWallets(userId: string) {
    return this.prisma.wallet.findMany({
      where: { userId },
      select: {
        id: true,
        chain: true,
        address: true,
        mode: true,
        createdAt: true,
        updatedAt: true,
        // Never return encryptedBlob to client in non-custodial mode
        encryptedBlob: false,
      },
    });
  }

  async getWallet(userId: string, walletId: string) {
    const wallet = await this.prisma.wallet.findFirst({
      where: {
        id: walletId,
        userId,
      },
    });

    if (!wallet) {
      throw new NotFoundException('Wallet not found');
    }

    // Return encrypted blob only - client decrypts locally
    return {
      id: wallet.id,
      chain: wallet.chain,
      address: wallet.address,
      mode: wallet.mode,
      encryptedBlob: wallet.mode === WalletMode.NON_CUSTODIAL ? wallet.encryptedBlob : null,
      createdAt: wallet.createdAt,
      updatedAt: wallet.updatedAt,
    };
  }

  async exportWallet(userId: string, walletId: string) {
    const wallet = await this.getWallet(userId, walletId);

    if (wallet.mode === WalletMode.NON_CUSTODIAL) {
      // Return encrypted blob for client to decrypt
      return {
        encryptedBlob: wallet.encryptedBlob,
        chain: wallet.chain,
        address: wallet.address,
      };
    } else {
      throw new ForbiddenException('Custodial wallets cannot be exported');
    }
  }

  async updateWallet(userId: string, walletId: string, updates: any) {
    const wallet = await this.prisma.wallet.findFirst({
      where: {
        id: walletId,
        userId,
      },
    });

    if (!wallet) {
      throw new NotFoundException('Wallet not found');
    }

    // Only allow updating encrypted blob for non-custodial wallets
    if (updates.encryptedBlob && wallet.mode === WalletMode.NON_CUSTODIAL) {
      return this.prisma.wallet.update({
        where: { id: walletId },
        data: {
          encryptedBlob: updates.encryptedBlob,
          blobVersion: updates.blobVersion || wallet.blobVersion,
          updatedAt: new Date(),
        },
      });
    }

    throw new BadRequestException('Invalid update');
  }

  async deleteWallet(userId: string, walletId: string) {
    const wallet = await this.prisma.wallet.findFirst({
      where: {
        id: walletId,
        userId,
      },
    });

    if (!wallet) {
      throw new NotFoundException('Wallet not found');
    }

    await this.prisma.wallet.delete({
      where: { id: walletId },
    });

    await this.auditService.log(
      userId,
      'wallet.deleted',
      { walletId, chain: wallet.chain },
    );
  }

  // For custodial mode: sign transaction server-side
  async signTransactionCustodial(
    userId: string,
    walletId: string,
    transaction: any,
  ) {
    const wallet = await this.prisma.wallet.findFirst({
      where: {
        id: walletId,
        userId,
      },
    });

    if (!wallet) {
      throw new NotFoundException('Wallet not found');
    }

    if (wallet.mode !== WalletMode.CUSTODIAL) {
      throw new BadRequestException('Only custodial wallets can use server-side signing');
    }

    // TODO: Retrieve private key from KMS and sign
    // const privateKey = await this.decryptFromKMS(wallet.kmsKeyId);
    // const signer = new ethers.Wallet(privateKey);
    // const signedTx = await signer.signTransaction(transaction);
    
    throw new Error('KMS integration not yet implemented');
  }
}

