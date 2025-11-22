/**
 * API client for WalletX backend
 */

import axios, { AxiosInstance } from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: `${API_URL}/api`,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  // Transaction endpoints
  async getBalance(address: string, chainId: number) {
    const { data } = await this.client.get('/wallet/balance/' + chainId + '/' + address);
    return data;
  }

  async getHistory(address: string, chainId: number) {
    const { data } = await this.client.get('/wallet/history/' + chainId + '/' + address);
    return data;
  }

  async getTokenBalances(address: string, chainId: number) {
    const { data } = await this.client.get('/tx/token-balances', {
      params: { address, chainId },
    });
    return data;
  }

  async sendTransaction(signedTx: string, chainId: number) {
    const { data } = await this.client.post('/tx/send', { signedTx, chainId });
    return data;
  }

  async getTransactionStatus(txHash: string, chainId: number) {
    const { data } = await this.client.get(`/tx/status/${txHash}`, {
      params: { chainId },
    });
    return data;
  }

  // Swap endpoints
  async getSwapQuote(quoteData: any) {
    const { data } = await this.client.post('/swap/quote', quoteData);
    return data;
  }

  async executeSwap(swapData: any) {
    const { data } = await this.client.post('/swap/execute', swapData);
    return data;
  }
}

export const api = new ApiClient();

