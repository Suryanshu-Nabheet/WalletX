import { Injectable, NotFoundException } from '@nestjs/common';
import { ethers } from 'ethers';
import { CHAIN_CONFIGS } from '@walletx/shared';

@Injectable()
export class TransactionsService {
  constructor() { }

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
    signedTx: string,
    chainId: number,
  ) {
    const config = CHAIN_CONFIGS[chainId];
    if (!config) {
      throw new NotFoundException('Unsupported chain');
    }

    const provider = new ethers.JsonRpcProvider(config.rpcUrl);
    const txResponse = await provider.broadcastTransaction(signedTx);

    return {
      hash: txResponse.hash,
      status: 'pending',
    };
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

