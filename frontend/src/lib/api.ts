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
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Add request interceptor to include auth token
    this.client.interceptors.request.use((config) => {
      const token = this.getToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });

    // Add response interceptor to handle token refresh
    this.client.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;

          try {
            const { data } = await axios.post(
              `${API_URL}/api/auth/refresh`,
              {},
              { withCredentials: true },
            );
            this.setToken(data.accessToken);
            originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
            return this.client(originalRequest);
          } catch (refreshError) {
            this.clearToken();
            window.location.href = '/login';
            return Promise.reject(refreshError);
          }
        }

        return Promise.reject(error);
      },
    );
  }

  private getToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('accessToken');
  }

  private setToken(token: string): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem('accessToken', token);
    }
  }

  private clearToken(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('accessToken');
    }
  }

  // Auth endpoints
  async signUp(email: string, password: string) {
    const { data } = await this.client.post('/auth/signup', {
      email,
      password,
      acceptTerms: true,
    });
    this.setToken(data.accessToken);
    return data;
  }

  async login(email: string, password: string) {
    const { data } = await this.client.post('/auth/login', {
      email,
      password,
    });
    this.setToken(data.accessToken);
    return data;
  }

  async logout() {
    await this.client.post('/auth/logout');
    this.clearToken();
  }

  // Wallet endpoints
  async createWallet(walletData: any) {
    const { data } = await this.client.post('/wallet/create', walletData);
    return data;
  }

  async getWallets() {
    const { data } = await this.client.get('/wallet');
    return data;
  }

  async getWallet(walletId: string) {
    const { data } = await this.client.get(`/wallet/${walletId}`);
    return data;
  }

  async exportWallet(walletId: string) {
    const { data } = await this.client.get(`/wallet/${walletId}/export`);
    return data;
  }

  // Transaction endpoints
  async getBalance(address: string, chainId: number) {
    const { data } = await this.client.get('/tx/balances', {
      params: { address, chainId },
    });
    return data;
  }

  async getTokenBalances(address: string, chainId: number) {
    const { data } = await this.client.get('/tx/token-balances', {
      params: { address, chainId },
    });
    return data;
  }

  async sendTransaction(transactionData: any) {
    const { data } = await this.client.post('/tx/send', transactionData);
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

