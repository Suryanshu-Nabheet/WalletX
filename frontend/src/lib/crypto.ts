/**
 * Client-side encryption utilities for WalletX
 * Uses WebCrypto API for AES-256-GCM and Argon2id for key derivation
 */

import { EncryptedBlob } from '@walletx/shared';

// Helper functions for array buffer conversions
function arrayBufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

function base64ToArrayBuffer(base64: string): ArrayBuffer {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes.buffer;
}

// Argon2id implementation using WebCrypto (simplified version)
// Note: For production, consider using a library like argon2-browser
async function deriveKeyArgon2id(
  password: string,
  salt: Uint8Array,
): Promise<CryptoKey> {
  // Simplified Argon2id using PBKDF2 as fallback
  // In production, use a proper Argon2id library
  const encoder = new TextEncoder();
  const passwordKey = await crypto.subtle.importKey(
    'raw',
    encoder.encode(password),
    'PBKDF2',
    false,
    ['deriveBits', 'deriveKey'],
  );

  const key = await crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: salt,
      iterations: 600000, // High iteration count for security
      hash: 'SHA-256',
    },
    passwordKey,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt'],
  );

  return key;
}

/**
 * Encrypt a mnemonic with a passphrase
 * Uses AES-256-GCM with key derived from passphrase using PBKDF2
 */
export async function encryptMnemonic(
  mnemonic: string,
  passphrase: string,
): Promise<EncryptedBlob> {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const iv = crypto.getRandomValues(new Uint8Array(12)); // 96-bit IV for GCM

  // Derive encryption key from passphrase
  const key = await deriveKeyArgon2id(passphrase, salt);

  // Encrypt mnemonic
  const encoder = new TextEncoder();
  const data = encoder.encode(mnemonic);
  const encrypted = await crypto.subtle.encrypt(
    {
      name: 'AES-GCM',
      iv: iv,
      tagLength: 128, // 128-bit authentication tag
    },
    key,
    data,
  );

  return {
    ciphertext: arrayBufferToBase64(encrypted),
    iv: arrayBufferToBase64(iv),
    salt: arrayBufferToBase64(salt),
    kdf: 'pbkdf2', // Using PBKDF2 as fallback (Argon2id requires library)
    kdf_params: {
      iterations: 600000,
    },
    version: '1.0.0',
  };
}

/**
 * Decrypt an encrypted blob to recover the mnemonic
 */
export async function decryptMnemonic(
  blob: EncryptedBlob,
  passphrase: string,
): Promise<string> {
  const salt = base64ToArrayBuffer(blob.salt);
  const iv = base64ToArrayBuffer(blob.iv);
  const ciphertext = base64ToArrayBuffer(blob.ciphertext);

  // Derive decryption key from passphrase
  const key = await deriveKeyArgon2id(passphrase, new Uint8Array(salt));

  // Decrypt
  const decrypted = await crypto.subtle.decrypt(
    {
      name: 'AES-GCM',
      iv: new Uint8Array(iv),
      tagLength: 128,
    },
    key,
    ciphertext,
  );

  const decoder = new TextDecoder();
  return decoder.decode(decrypted);
}

/**
 * Generate a secure random mnemonic (12 or 24 words)
 */
export async function generateMnemonic(wordCount: 12 | 24 = 12): Promise<string> {
  const { entropyToMnemonic } = await import('bip39');
  const entropyLength = wordCount === 12 ? 128 : 256;
  const entropy = crypto.getRandomValues(new Uint8Array(entropyLength / 8));
  // Convert Uint8Array to hex string for bip39
  const hexEntropy = Array.from(entropy)
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
  return entropyToMnemonic(hexEntropy);
}

/**
 * Validate a mnemonic phrase
 */
export async function validateMnemonic(mnemonic: string): Promise<boolean> {
  try {
    const { validateMnemonic: validate } = await import('bip39');
    return validate(mnemonic);
  } catch {
    return false;
  }
}

/**
 * Derive wallet from mnemonic
 * Uses BIP44 standard path for Ethereum: m/44'/60'/0'/0/accountIndex
 */
export async function deriveWalletFromMnemonic(
  mnemonic: string,
  accountIndex: number = 0,
): Promise<{ address: string; privateKey: string }> {
  const { ethers } = await import('ethers');
  
  // Create HDNode from mnemonic (this is the master node)
  const masterNode = ethers.HDNodeWallet.fromPhrase(mnemonic);
  
  // Derive using BIP44 path: m/44'/60'/0'/0/accountIndex
  // Note: derivePath expects a relative path, not starting with "m/"
  const derivationPath = `44'/60'/0'/0/${accountIndex}`;
  const wallet = masterNode.derivePath(derivationPath);
  
  return {
    address: wallet.address,
    privateKey: wallet.privateKey,
  };
}

