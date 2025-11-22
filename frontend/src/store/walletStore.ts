import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { encrypt, decrypt, hashPassword } from '@/lib/crypto';
import { ethers } from 'ethers';

interface Wallet {
  id: string;
  address: string;
  chain: string;
  name: string;
}

interface VaultData {
  mnemonic?: string;
  privateKeys: Record<string, string>; // walletId -> privateKey
}

interface WalletState {
  isUnlocked: boolean;
  isInitialized: boolean;
  encryptedVault: string | null;
  passwordHash: string | null;
  wallets: Wallet[]; // Public info
  privateKeys: Record<string, string>; // Memory only

  sessionPassword: string | null; // Memory only

  // Actions
  createVault: (password: string, mnemonic?: string) => Promise<void>;
  unlockVault: (password: string) => Promise<boolean>;
  lockVault: () => void;
  importWallet: (privateKey: string, chain: string, name?: string) => Promise<void>;
  getPrivateKey: (walletId: string) => string | undefined;
  resetWallet: () => void;
}

export const useWalletStore = create<WalletState>()(
  persist(
    (set, get) => ({
      isUnlocked: false,
      isInitialized: false,
      encryptedVault: null,
      passwordHash: null,
      wallets: [],
      privateKeys: {},
      sessionPassword: null,

      createVault: async (password: string, mnemonic?: string) => {
        const vaultData: VaultData = {
          mnemonic,
          privateKeys: {},
        };

        // If mnemonic provided, generate first wallet
        if (mnemonic) {
          const wallet = ethers.Wallet.fromPhrase(mnemonic);
          const id = crypto.randomUUID();
          vaultData.privateKeys[id] = wallet.privateKey;

          set((state) => ({
            wallets: [
              ...state.wallets,
              { id, address: wallet.address, chain: 'ethereum', name: 'Account 1' },
            ],
          }));
        }

        const encryptedVault = await encrypt(JSON.stringify(vaultData), password);
        const passwordHash = await hashPassword(password);

        set({
          encryptedVault,
          passwordHash,
          isInitialized: true,
          isUnlocked: true,
          privateKeys: vaultData.privateKeys,
          sessionPassword: password,
        });
      },

      unlockVault: async (password: string) => {
        const { encryptedVault, passwordHash } = get();
        if (!encryptedVault || !passwordHash) return false;

        const hash = await hashPassword(password);
        if (hash !== passwordHash) return false;

        try {
          const decrypted = await decrypt(encryptedVault, password);
          const vaultData: VaultData = JSON.parse(decrypted);

          set({
            isUnlocked: true,
            privateKeys: vaultData.privateKeys,
            sessionPassword: password,
          });
          return true;
        } catch (e) {
          console.error('Failed to unlock vault', e);
          return false;
        }
      },

      lockVault: () => {
        set({
          isUnlocked: false,
          privateKeys: {},
          sessionPassword: null,
        });
      },

      importWallet: async (privateKey: string, chain: string, name = 'Imported Wallet') => {
        const { isUnlocked, sessionPassword, wallets } = get();
        if (!isUnlocked || !sessionPassword) throw new Error('Vault locked');

        // Verify private key
        let address = '';
        try {
          const wallet = new ethers.Wallet(privateKey);
          address = wallet.address;
        } catch (e) {
          throw new Error('Invalid private key');
        }

        const id = crypto.randomUUID();
        const newWallets = [...wallets, { id, address, chain, name }];

        // Update private keys in memory
        const newPrivateKeys = { ...get().privateKeys, [id]: privateKey };

        const vaultData: VaultData = {
          mnemonic: undefined, // We don't know the mnemonic for imported keys
          privateKeys: newPrivateKeys,
        };

        // Re-encrypt vault
        const encryptedVault = await encrypt(JSON.stringify(vaultData), sessionPassword);

        set({
          wallets: newWallets,
          privateKeys: newPrivateKeys,
          encryptedVault,
        });
      },

      getPrivateKey: (walletId: string) => {
        return get().privateKeys[walletId];
      },

      resetWallet: () => {
        set({
          isUnlocked: false,
          isInitialized: false,
          encryptedVault: null,
          passwordHash: null,
          wallets: [],
          privateKeys: {},
          sessionPassword: null,
        });
      },
    }),
    {
      name: 'walletx-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        encryptedVault: state.encryptedVault,
        passwordHash: state.passwordHash,
        wallets: state.wallets,
        isInitialized: state.isInitialized,
      }),
    },
  ),
);
