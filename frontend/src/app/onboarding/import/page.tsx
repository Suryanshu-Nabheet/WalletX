'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useWalletStore } from '@/store/walletStore';
import { ethers } from 'ethers';

export default function ImportWalletPage() {
    const router = useRouter();
    const { createVault, importWallet } = useWalletStore();
    const [importType, setImportType] = useState<'seed' | 'privateKey'>('seed');
    const [inputValue, setInputValue] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleImport = async () => {
        if (password.length < 8) {
            setError('Password must be at least 8 characters');
            return;
        }

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        setLoading(true);
        setError('');

        try {
            if (importType === 'seed') {
                // Validate mnemonic
                if (!ethers.Wallet.fromPhrase(inputValue)) {
                    throw new Error('Invalid seed phrase');
                }
                await createVault(password, inputValue);
            } else {
                // Validate private key
                try {
                    new ethers.Wallet(inputValue);
                } catch (e) {
                    throw new Error('Invalid private key');
                }

                // Create empty vault then import
                await createVault(password);
                await importWallet(inputValue, 'ethereum', 'Imported Account');
            }

            router.push('/dashboard');
        } catch (err: any) {
            console.error(err);
            setError(err.message || 'Failed to import wallet');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <div className="max-w-md w-full glass-card rounded-2xl p-8">
                <h1 className="text-3xl font-bold text-center mb-8 text-white">
                    Import Wallet
                </h1>

                <div className="space-y-6">
                    {/* Import Type Selection */}
                    <div className="flex space-x-4 p-1 bg-black/50 rounded-lg border border-gray-700">
                        <button
                            onClick={() => setImportType('seed')}
                            className={`flex-1 py-2 rounded-md text-sm font-medium transition ${importType === 'seed'
                                ? 'bg-blue-600 text-white shadow'
                                : 'text-gray-400 hover:text-white'
                                }`}
                        >
                            Seed Phrase
                        </button>
                        <button
                            onClick={() => setImportType('privateKey')}
                            className={`flex-1 py-2 rounded-md text-sm font-medium transition ${importType === 'privateKey'
                                ? 'bg-blue-600 text-white shadow'
                                : 'text-gray-400 hover:text-white'
                                }`}
                        >
                            Private Key
                        </button>
                    </div>

                    {/* Input Field */}
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            {importType === 'seed' ? 'Recovery Phrase' : 'Private Key'}
                        </label>
                        <textarea
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            className="w-full px-4 py-3 bg-black/50 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-500"
                            rows={importType === 'seed' ? 3 : 2}
                            placeholder={
                                importType === 'seed'
                                    ? 'Enter your 12 or 24 word recovery phrase...'
                                    : 'Enter your private key (starts with 0x...)'
                            }
                        />
                    </div>

                    {/* Password Fields */}
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            New Password
                        </label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-3 bg-black/50 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white"
                            placeholder="Min. 8 characters"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Confirm Password
                        </label>
                        <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="w-full px-4 py-3 bg-black/50 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white"
                            placeholder="Repeat password"
                        />
                    </div>

                    {error && (
                        <div className="bg-red-900/50 border border-red-500/50 text-red-200 px-4 py-3 rounded-lg text-sm">
                            {error}
                        </div>
                    )}

                    <button
                        onClick={handleImport}
                        disabled={loading || !inputValue || !password || !confirmPassword}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-bold transition disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-900/20"
                    >
                        {loading ? 'Importing...' : 'Import Wallet'}
                    </button>
                </div>
            </div>
        </div>
    );
}
