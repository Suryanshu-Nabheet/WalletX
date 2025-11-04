import { z } from 'zod';

export const SignUpSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8).max(100),
  acceptTerms: z.boolean().refine((val) => val === true, {
    message: 'You must accept the terms and conditions',
  }),
});

export const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
  rememberMe: z.boolean().optional(),
});

export const CreateWalletSchema = z.object({
  mode: z.enum(['noncustodial', 'custodial']),
  chain: z.string(),
  encryptedBlob: z.object({
    ciphertext: z.string(),
    iv: z.string(),
    salt: z.string(),
    kdf: z.enum(['argon2id', 'pbkdf2']),
    kdf_params: z.record(z.any()).optional(),
    version: z.string(),
  }).optional(),
});

export const SendTransactionSchema = z.object({
  to: z.string().regex(/^0x[a-fA-F0-9]{40}$/),
  value: z.string().optional(),
  data: z.string().optional(),
  chainId: z.number(),
  gasLimit: z.string().optional(),
  gasPrice: z.string().optional(),
});

export const SwapQuoteSchema = z.object({
  fromToken: z.string(),
  toToken: z.string(),
  fromAmount: z.string(),
  chainId: z.number(),
  slippage: z.number().min(0).max(50).optional(),
});

export const SwapExecuteSchema = z.object({
  quoteId: z.string().optional(),
  fromToken: z.string(),
  toToken: z.string(),
  fromAmount: z.string(),
  chainId: z.number(),
  slippage: z.number().min(0).max(50).optional(),
});

