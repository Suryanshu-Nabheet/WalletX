'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useWalletStore } from '@/store/walletStore';
import { api } from '@/lib/api';
import { CHAIN_CONFIGS, ChainId } from '@walletx/shared';
import { ethers } from 'ethers';

export default function DashboardPage() {
  const router = useRouter();
  const { currentWallet, isUnlocked, clearWallet } = useWalletStore();
  const [balance, setBalance] = useState<string>('0');
  const [loading, setLoading] = useState(true);
  const [chainId, setChainId] = useState<number>(ChainId.ETHEREUM);

  useEffect(() => {
    if (!isUnlocked || !currentWallet) {
      router.push('/login');
      return;
    }

    loadBalance();
  }, [currentWallet, chainId]);

  const loadBalance = async () => {
    if (!currentWallet) return;

    try {
      const balanceData = await api.getBalance(currentWallet.address, chainId);
      setBalance(ethers.formatEther(balanceData.balance));
    } catch (error) {
      console.error('Failed to load balance:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await api.logout();
    clearWallet();
    router.push('/login');
  };

  if (!currentWallet) {
    return null;
  }

  const chainConfig = CHAIN_CONFIGS[chainId];

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-primary-600">WalletX</h1>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={handleLogout}
                className="text-gray-600 hover:text-gray-900"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-2xl font-bold mb-4">Wallet Overview</h2>
          
          <div className="space-y-4">
            <div>
              <label className="text-sm text-gray-600">Address</label>
              <p className="font-mono text-sm break-all">{currentWallet.address}</p>
            </div>

            <div>
              <label className="text-sm text-gray-600">Network</label>
              <select
                value={chainId}
                onChange={(e) => setChainId(Number(e.target.value))}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
              >
                {Object.entries(CHAIN_CONFIGS).map(([id, config]) => (
                  <option key={id} value={id}>
                    {config.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-sm text-gray-600">Balance</label>
              <p className="text-2xl font-bold">
                {loading ? '...' : `${balance} ${chainConfig.nativeCurrency.symbol}`}
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-4">Send</h3>
            <p className="text-gray-600">Send tokens to another address</p>
            <button className="mt-4 bg-primary-600 text-white px-4 py-2 rounded hover:bg-primary-700">
              Send
            </button>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-4">Swap</h3>
            <p className="text-gray-600">Swap tokens using DEX aggregator</p>
            <button className="mt-4 bg-primary-600 text-white px-4 py-2 rounded hover:bg-primary-700">
              Swap
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

