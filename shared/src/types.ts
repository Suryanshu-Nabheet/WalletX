export enum WalletMode {
  NON_CUSTODIAL = 'noncustodial',
  CUSTODIAL = 'custodial',
}

export enum ChainId {
  ETHEREUM = 1,
  POLYGON = 137,
  ARBITRUM = 42161,
  OPTIMISM = 10,
  BASE = 8453,
  SEPOLIA = 11155111,
  MUMBAI = 80001,
}

export interface EncryptedBlob {
  ciphertext: string;
  iv: string;
  salt: string;
  kdf: 'argon2id' | 'pbkdf2';
  kdf_params?: {
    time?: number;
    mem?: number;
    iterations?: number;
  };
  version: string;
}

export interface Wallet {
  id: string;
  userId: string;
  chain: string;
  address: string;
  encryptedBlob?: EncryptedBlob;
  mode: WalletMode;
  createdAt: Date;
  updatedAt: Date;
}

export interface User {
  id: string;
  email: string;
  createdAt: Date;
  lastLogin?: Date;
  twoFaEnabled: boolean;
  oauthProvider?: string;
  userSettings: Record<string, any>;
}

export interface Session {
  id: string;
  userId: string;
  refreshTokenHash: string;
  expiresAt: Date;
  ip?: string;
  userAgent?: string;
}

export interface AuditLog {
  id: string;
  userId: string;
  action: string;
  meta: Record<string, any>;
  createdAt: Date;
}

export interface TokenBalance {
  contractAddress: string;
  symbol: string;
  name: string;
  decimals: number;
  balance: string;
  price?: number;
  value?: number;
}

export interface NFTBalance {
  contractAddress: string;
  tokenId: string;
  name: string;
  image?: string;
  collection?: string;
}

export interface SwapQuote {
  fromToken: string;
  toToken: string;
  fromAmount: string;
  toAmount: string;
  priceImpact: number;
  gasEstimate: string;
  route: any;
  tx: {
    to: string;
    data: string;
    value: string;
    gasLimit: string;
  };
}

export interface Transaction {
  hash: string;
  from: string;
  to: string;
  value: string;
  data?: string;
  gasLimit: string;
  gasPrice: string;
  nonce: number;
  chainId: number;
  status: 'pending' | 'confirmed' | 'failed';
  blockNumber?: number;
  timestamp?: Date;
}

