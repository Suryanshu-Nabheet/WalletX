'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useWalletStore } from '@/store/walletStore';

export default function LoginPage() {
  const router = useRouter();
  const { unlockVault, isInitialized } = useWalletStore();
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Redirect to onboarding if no vault exists
  if (!isInitialized) {
    if (typeof window !== 'undefined') {
      router.push('/onboarding');
    }
    return null;
  }

  const handleUnlock = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const success = await unlockVault(password);
      if (success) {
        router.push('/dashboard');
      } else {
        setError('Incorrect password');
      }
    } catch (err: any) {
      setError('Failed to unlock wallet');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-md w-full glass-card rounded-2xl p-8">
        <h1 className="text-3xl font-bold text-center mb-8 text-white">
          Welcome Back
        </h1>

        <form onSubmit={handleUnlock} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-black/50 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white"
              placeholder="Enter your password"
              autoFocus
            />
          </div>

          {error && (
            <div className="bg-red-900/50 border border-red-500/50 text-red-200 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading || !password}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-bold transition disabled:opacity-50 shadow-lg shadow-blue-900/20"
          >
            {loading ? 'Unlocking...' : 'Unlock Wallet'}
          </button>

          <div className="text-center mt-4">
            <button
              type="button"
              onClick={() => {
                if (confirm('Are you sure? This will wipe your wallet from this device.')) {
                  useWalletStore.getState().resetWallet();
                  router.push('/onboarding');
                }
              }}
              className="text-sm text-red-400 hover:text-red-300"
            >
              Reset Wallet
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
