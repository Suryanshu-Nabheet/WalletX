'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { decryptMnemonic, deriveWalletFromMnemonic } from '@/lib/crypto';
import { useWalletStore } from '@/store/walletStore';

export default function LoginPage() {
  const router = useRouter();
  const { wallets, setCurrentWallet, setUnlocked } = useWalletStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passphrase, setPassphrase] = useState('');
  const [step, setStep] = useState<'login' | 'unlock'>('login');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await api.login(email, password);
      setStep('unlock');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleUnlock = async () => {
    if (!passphrase) {
      setError('Passphrase is required');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Get user's wallets
      const userWallets = await api.getWallets();
      
      if (userWallets.length === 0) {
        router.push('/onboarding');
        return;
      }

      // Get encrypted blob for first wallet
      const wallet = await api.getWallet(userWallets[0].id);
      
      if (!wallet.encryptedBlob) {
        setError('Wallet not found or already unlocked');
        return;
      }

      // Decrypt mnemonic
      const mnemonic = await decryptMnemonic(wallet.encryptedBlob, passphrase);
      
      // Derive wallet
      const derivedWallet = await deriveWalletFromMnemonic(mnemonic);

      setCurrentWallet({
        id: wallet.id,
        address: wallet.address,
        chain: wallet.chain,
        privateKey: derivedWallet.privateKey,
      });

      setUnlocked(true);
      router.push('/dashboard');
    } catch (err: any) {
      setError('Invalid passphrase or wallet error');
    } finally {
      setLoading(false);
    }
  };

  if (step === 'login') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-primary-100 p-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-xl p-8">
          <h1 className="text-3xl font-bold text-center mb-8 text-primary-900">
            Login to WalletX
          </h1>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary-600 text-white py-3 rounded-lg font-semibold hover:bg-primary-700 transition disabled:opacity-50"
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-primary-100 p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-xl p-8">
        <h1 className="text-3xl font-bold text-center mb-8 text-primary-900">
          Unlock Wallet
        </h1>

        <div className="space-y-6">
          <p className="text-gray-600">
            Enter your passphrase to unlock your wallet.
          </p>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Passphrase
            </label>
            <input
              type="password"
              value={passphrase}
              onChange={(e) => setPassphrase(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="Enter your passphrase"
              autoFocus
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          <button
            onClick={handleUnlock}
            disabled={loading || !passphrase}
            className="w-full bg-primary-600 text-white py-3 rounded-lg font-semibold hover:bg-primary-700 transition disabled:opacity-50"
          >
            {loading ? 'Unlocking...' : 'Unlock Wallet'}
          </button>
        </div>
      </div>
    </div>
  );
}

