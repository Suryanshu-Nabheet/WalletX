import { Injectable } from '@nestjs/common';
import { ethers } from 'ethers';

@Injectable()
export class WalletsService {
  private providers: Record<string, ethers.JsonRpcProvider> = {};

  constructor() {
    // Initialize providers (using public RPCs for demo)
    this.providers['ethereum'] = new ethers.JsonRpcProvider('https://eth.llamarpc.com');
    this.providers['polygon'] = new ethers.JsonRpcProvider('https://polygon-rpc.com');
    // Add more as needed
  }

  async getBalance(chain: string, address: string) {
    if (chain === 'solana') {
      // Mock Solana for now or use fetch if @solana/web3.js is not installed
      // In a real app, use Connection from @solana/web3.js
      return {
        balance: '0.0',
        symbol: 'SOL',
        chain: 'solana'
      };
    }

    const provider = this.providers[chain];
    if (!provider) {
      // Default to 0 if chain not supported in this demo
      return {
        balance: '0.0',
        symbol: 'ETH',
        chain
      };
    }

    try {
      const balance = await provider.getBalance(address);
      return {
        balance: ethers.formatEther(balance),
        symbol: chain === 'polygon' ? 'MATIC' : 'ETH',
        chain
      };
    } catch (error) {
      console.error(`Error fetching balance for ${chain}:`, error);
      return {
        balance: '0.0',
        symbol: 'ETH',
        chain
      };
    }
  }

  async getHistory(chain: string, address: string) {
    // Mock history for demo
    return [
      {
        hash: '0x123...',
        from: address,
        to: '0x456...',
        value: '0.1',
        timestamp: Date.now()
      }
    ];
  }
}
