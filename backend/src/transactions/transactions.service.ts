import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ethers } from 'ethers';
import { CHAIN_CONFIGS } from '@walletx/shared';
import { WalletsService } from '../wallets/wallets.service';
import { AuditService } from '../audit/audit.service';

@Injectable()
export class TransactionsService {
  constructor(
    private prisma: PrismaService,
    private walletsService: WalletsService,
    private auditService: AuditService,
  ) {}

  async getBalance(address: string, chainId: number) {
    const config = CHAIN_CONFIGS[chainId];
    if (!config) {
      throw new NotFoundException('Unsupported chain');
    }

    const provider = new ethers.JsonRpcProvider(config.rpcUrl);
    const balance = await provider.getBalance(address);

    return {
      address,
      chainId,
      balance: balance.toString(),
      formatted: ethers.formatEther(balance),
    };
  }

  async getTokenBalances(address: string, chainId: number) {
    // TODO: Integrate with Alchemy/Covalent API for token balances
    // For now, return native balance only
    const nativeBalance = await this.getBalance(address, chainId);
    
    return {
      native: nativeBalance,
      tokens: [], // TODO: Fetch from indexer
    };
  }

  async getTransactionHistory(address: string, chainId: number, limit = 50) {
    const config = CHAIN_CONFIGS[chainId];
    if (!config) {
      throw new NotFoundException('Unsupported chain');
    }

    // TODO: Integrate with block explorer API or indexer
    // For now, return empty array
    return [];
  }

  async estimateGas(transaction: any, chainId: number) {
    const config = CHAIN_CONFIGS[chainId];
    if (!config) {
      throw new NotFoundException('Unsupported chain');
    }

    const provider = new ethers.JsonRpcProvider(config.rpcUrl);
    const gasEstimate = await provider.estimateGas(transaction);

    return {
      gasLimit: gasEstimate.toString(),
    };
  }

  async sendTransaction(
    userId: string,
    walletId: string,
    transaction: any,
    chainId: number,
    signedTx?: string,
    ip?: string,
    userAgent?: string,
  ) {
    const wallet = await this.walletsService.getWallet(userId, walletId);

    if (wallet.mode === 'noncustodial') {
      // For non-custodial: client signs and sends signed transaction
      if (!signedTx) {
        throw new Error('Signed transaction required for non-custodial wallets');
      }

      const config = CHAIN_CONFIGS[chainId];
      if (!config) {
        throw new NotFoundException('Unsupported chain');
      }

      const provider = new ethers.JsonRpcProvider(config.rpcUrl);
      const txResponse = await provider.broadcastTransaction(signedTx);

      await this.auditService.log(
        userId,
        'tx.sent',
        {
          walletId,
          txHash: txResponse.hash,
          chainId,
        },
        ip,
        userAgent,
      );

      return {
        hash: txResponse.hash,
        status: 'pending',
      };
    } else {
      // For custodial: server signs and broadcasts
      const signedTx = await this.walletsService.signTransactionCustodial(
        userId,
        walletId,
        transaction,
      );

      // TODO: Broadcast transaction
      throw new Error('Custodial signing not yet fully implemented');
    }
  }

  async getTransactionStatus(txHash: string, chainId: number) {
    const config = CHAIN_CONFIGS[chainId];
    if (!config) {
      throw new NotFoundException('Unsupported chain');
    }

    const provider = new ethers.JsonRpcProvider(config.rpcUrl);
    const receipt = await provider.getTransactionReceipt(txHash);

    if (!receipt) {
      return { status: 'pending' };
    }

    return {
      status: receipt.status === 1 ? 'confirmed' : 'failed',
      blockNumber: receipt.blockNumber,
      gasUsed: receipt.gasUsed.toString(),
    };
  }
}

