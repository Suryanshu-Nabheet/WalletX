/**
 * Client-side API / Service layer replacing the old backend
 */

import { ethers } from 'ethers';
import { CHAIN_CONFIGS } from '@/shared/index';

class ApiClient {
  private providers: Record<number, ethers.JsonRpcProvider> = {};

  public getProvider(chainId: number): ethers.JsonRpcProvider {
    if (!this.providers[chainId]) {
      const rpcUrl = CHAIN_CONFIGS[chainId]?.rpcUrl;
      if (!rpcUrl) throw new Error(`No RPC URL for chain ${chainId}`);
      this.providers[chainId] = new ethers.JsonRpcProvider(rpcUrl);
    }
    return this.providers[chainId];
  }

  // Transaction endpoints
  async getBalance(address: string, chainId: number) {
    try {
      const provider = this.getProvider(chainId);
      const balance = await provider.getBalance(address);
      return { balance: ethers.formatEther(balance) };
    } catch (error) {
      console.error('Failed to fetch balance', error);
      throw error;
    }
  }

  async getHistory(address: string, chainId: number) {
    // Client-side history requires an indexer (Etherscan, Covalent, etc.)
    // For now, returning empty to prevent crash, or could implement a basic Etherscan fetch if keys were available.
    console.warn('History fetching not fully implemented without indexer API');
    return [];
  }

  async getTokenBalances(_address: string, _chainId: number) {
    // Placeholder for token fetching
    return [];
  }

  async sendTransaction(signedTx: string, chainId: number) {
    const provider = this.getProvider(chainId);
    const txResponse = await provider.broadcastTransaction(signedTx);
    return txResponse;
  }

  async getTransactionStatus(txHash: string, chainId: number) {
    const provider = this.getProvider(chainId);
    const txReceipt = await provider.getTransactionReceipt(txHash);
    return txReceipt;
  }

  // Swap endpoints - Stubbed for now as 0x/1inch require backend proxies or direct API keys
  async getSwapQuote(_quoteData: any) {
    throw new Error('Swap not implemented in client-only mode yet');
  }

  async executeSwap(_swapData: any) {
    throw new Error('Swap not implemented in client-only mode yet');
  }
}

export const api = new ApiClient();
