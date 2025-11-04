'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { encryptMnemonic, deriveWalletFromMnemonic, generateMnemonic } from '@/lib/crypto';
import { api } from '@/lib/api';
import { useWalletStore } from '@/store/walletStore';

export default function OnboardingPage() {
  const router = useRouter();
  const { setWallets, setCurrentWallet, setUnlocked } = useWalletStore();
  const [step, setStep] = useState(1);
  const [mnemonic, setMnemonic] = useState<string>('');
  const [passphrase, setPassphrase] = useState('');
  const [confirmPassphrase, setConfirmPassphrase] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Step 1: Generate mnemonic
  const handleGenerateMnemonic = async () => {
    const newMnemonic = await generateMnemonic(12);
    setMnemonic(newMnemonic);
    setStep(2);
  };

  // Step 2: Confirm mnemonic backup
  const handleBackupConfirmed = () => {
    setStep(3);
  };

  // Step 3: Create passphrase and encrypt
  const handleCreateWallet = async () => {
    if (passphrase.length < 8) {
      setError('Passphrase must be at least 8 characters');
      return;
    }

    if (passphrase !== confirmPassphrase) {
      setError('Passphrases do not match');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Derive wallet from mnemonic
      const wallet = await deriveWalletFromMnemonic(mnemonic);
      
      // Encrypt mnemonic
      const encryptedBlob = await encryptMnemonic(mnemonic, passphrase);

      // Create wallet on server
      const walletData = await api.createWallet({
        mode: 'noncustodial',
        chain: 'ethereum',
        address: wallet.address,
        encryptedBlob,
      });

      // Store in local state
      setWallets([{
        id: walletData.id,
        address: wallet.address,
        chain: 'ethereum',
        mode: 'noncustodial',
      }]);

      setCurrentWallet({
        id: walletData.id,
        address: wallet.address,
        chain: 'ethereum',
        privateKey: wallet.privateKey,
      });

      setUnlocked(true);

      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Failed to create wallet');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-primary-100 p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-xl p-8">
        <h1 className="text-3xl font-bold text-center mb-8 text-primary-900">
          Welcome to WalletX
        </h1>

        {step === 1 && (
          <div className="space-y-6">
            <p className="text-gray-600 text-center">
              Let's create your secure wallet. We'll generate a recovery phrase that you must keep safe.
            </p>
            <button
              onClick={handleGenerateMnemonic}
              className="w-full bg-primary-600 text-white py-3 rounded-lg font-semibold hover:bg-primary-700 transition"
            >
              Generate Recovery Phrase
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <p className="text-yellow-800 text-sm font-semibold mb-2">
                ⚠️ Important: Backup Your Recovery Phrase
              </p>
              <p className="text-yellow-700 text-xs">
                Write down these 12 words in order and keep them safe. If you lose this phrase, you will lose access to your wallet forever.
              </p>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="grid grid-cols-3 gap-2 font-mono text-sm">
                {mnemonic.split(' ').map((word, i) => (
                  <div key={i} className="p-2 bg-white rounded border">
                    <span className="text-gray-500 text-xs">{i + 1}.</span> {word}
                  </div>
                ))}
              </div>
            </div>

            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                onChange={(e) => {
                  if (e.target.checked) handleBackupConfirmed();
                }}
                className="rounded"
              />
              <span className="text-sm text-gray-700">
                I have securely backed up my recovery phrase
              </span>
            </label>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6">
            <p className="text-gray-600">
              Create a strong passphrase to encrypt your recovery phrase. This passphrase will be required to unlock your wallet.
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
                placeholder="Enter a strong passphrase"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Confirm Passphrase
              </label>
              <input
                type="password"
                value={confirmPassphrase}
                onChange={(e) => setConfirmPassphrase(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Confirm your passphrase"
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                {error}
              </div>
            )}

            <button
              onClick={handleCreateWallet}
              disabled={loading || !passphrase || !confirmPassphrase}
              className="w-full bg-primary-600 text-white py-3 rounded-lg font-semibold hover:bg-primary-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating Wallet...' : 'Create Wallet'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

