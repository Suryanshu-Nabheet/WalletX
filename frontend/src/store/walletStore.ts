/**
 * Zustand store for wallet state management
 */

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface WalletState {
  isUnlocked: boolean;
  currentWallet: {
    id: string;
    address: string;
    chain: string;
    privateKey?: string; // Only stored in memory, never persisted
  } | null;
  wallets: Array<{
    id: string;
    address: string;
    chain: string;
    mode: string;
  }>;
  setUnlocked: (unlocked: boolean) => void;
  setCurrentWallet: (wallet: WalletState['currentWallet']) => void;
  setWallets: (wallets: WalletState['wallets']) => void;
  clearWallet: () => void;
}

export const useWalletStore = create<WalletState>()(
  persist(
    (set) => ({
      isUnlocked: false,
      currentWallet: null,
      wallets: [],
      setUnlocked: (unlocked) => set({ isUnlocked: unlocked }),
      setCurrentWallet: (wallet) => set({ currentWallet: wallet }),
      setWallets: (wallets) => set({ wallets }),
      clearWallet: () =>
        set({
          isUnlocked: false,
          currentWallet: null,
          privateKey: undefined,
        }),
    }),
    {
      name: 'walletx-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        wallets: state.wallets,
        // Never persist private keys or unlocked state
      }),
    },
  ),
);

