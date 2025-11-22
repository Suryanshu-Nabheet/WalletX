/**
 * Crypto utilities for client-side encryption using Web Crypto API
 */

// Generate a key from a password using PBKDF2
async function getKey(password: string, salt: Uint8Array): Promise<CryptoKey> {
  const enc = new TextEncoder();
  const keyMaterial = await window.crypto.subtle.importKey(
    'raw',
    enc.encode(password),
    { name: 'PBKDF2' },
    false,
    ['deriveBits', 'deriveKey'],
  );

  return window.crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: salt,
      iterations: 100000,
      hash: 'SHA-256',
    },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    true,
    ['encrypt', 'decrypt'],
  );
}

export async function encrypt(data: string, password: string): Promise<string> {
  const enc = new TextEncoder();
  const salt = window.crypto.getRandomValues(new Uint8Array(16));
  const iv = window.crypto.getRandomValues(new Uint8Array(12));
  const key = await getKey(password, salt);

  const encrypted = await window.crypto.subtle.encrypt(
    {
      name: 'AES-GCM',
      iv: iv,
    },
    key,
    enc.encode(data),
  );

  // Combine salt + iv + encrypted data
  const buffer = new Uint8Array(salt.length + iv.length + encrypted.byteLength);
  buffer.set(salt, 0);
  buffer.set(iv, salt.length);
  buffer.set(new Uint8Array(encrypted), salt.length + iv.length);

  // Convert to base64
  return btoa(String.fromCharCode(...buffer));
}

export async function decrypt(encryptedData: string, password: string): Promise<string> {
  try {
    const binaryString = atob(encryptedData);
    const buffer = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      buffer[i] = binaryString.charCodeAt(i);
    }

    const salt = buffer.slice(0, 16);
    const iv = buffer.slice(16, 28);
    const data = buffer.slice(28);

    const key = await getKey(password, salt);

    const decrypted = await window.crypto.subtle.decrypt(
      {
        name: 'AES-GCM',
        iv: iv,
      },
      key,
      data,
    );

    const dec = new TextDecoder();
    return dec.decode(decrypted);
  } catch (error) {
    throw new Error('Invalid password or corrupted data');
  }
}

export async function hashPassword(password: string): Promise<string> {
  const enc = new TextEncoder();
  const hash = await window.crypto.subtle.digest('SHA-256', enc.encode(password));
  return btoa(String.fromCharCode(...new Uint8Array(hash)));
}
