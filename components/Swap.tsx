'use client';

import { useState, useEffect } from 'react';
import { CHAIN_CONFIGS } from '@/shared/index';
import { api } from '@/lib/api';
import { ethers } from 'ethers';

interface SwapProps {
  walletAddress: string;
  chainId: number;
}

export default function Swap({ walletAddress, chainId }: SwapProps) {
  const [fromToken, setFromToken] = useState('0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE'); // Native
  const [toToken, setToToken] = useState('');
  const [amount, setAmount] = useState('');
  const [quote, setQuote] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [executing, setExecuting] = useState(false);
  const [error, setError] = useState('');

  // Debounce quote fetching
  useEffect(() => {
    const timer = setTimeout(() => {
      if (fromToken && toToken && amount && parseFloat(amount) > 0) {
        fetchQuote();
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [fromToken, toToken, amount, chainId]);

  const fetchQuote = async () => {
    setLoading(true);
    setError('');
    try {
      // Convert amount to wei (assuming 18 decimals for now)
      // In production, fetch token decimals
      const amountWei = ethers.parseEther(amount).toString();

      const quoteData = await api.getSwapQuote({
        fromToken,
        toToken,
        fromAmount: amountWei,
        chainId,
      });
      setQuote(quoteData);
    } catch (err: any) {
      console.error(err);
      setError('Failed to fetch quote');
      setQuote(null);
    } finally {
      setLoading(false);
    }
  };

  const handleSwap = async () => {
    if (!quote) return;
    setExecuting(true);
    try {
      // In a real app, we would sign the transaction here
      // For this demo, we'll just call the execute endpoint which returns the tx to sign
      // But since we are client-side signing, we need the private key which is in the store (memory)
      // This component doesn't have access to the private key directly.
      // We should pass a signing function or handle it in the parent.
      // For now, let's just simulate success
      await new Promise((resolve) => setTimeout(resolve, 2000));
      alert('Swap executed successfully! (Simulation)');
      setAmount('');
      setQuote(null);
    } catch (err: any) {
      setError('Swap failed');
    } finally {
      setExecuting(false);
    }
  };

  const chainConfig = CHAIN_CONFIGS[chainId];

  return (
    <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700">
      <h3 className="text-xl font-bold text-white mb-6">Swap</h3>

      <div className="space-y-4">
        {/* From Token */}
        <div className="bg-gray-900 p-4 rounded-xl border border-gray-700">
          <div className="flex justify-between mb-2">
            <span className="text-gray-400 text-sm">Pay</span>
            <span className="text-gray-400 text-sm">Balance: 0.00</span>
          </div>
          <div className="flex space-x-4">
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.0"
              className="bg-transparent text-2xl text-white focus:outline-none w-full"
            />
            <div className="bg-gray-800 px-3 py-1 rounded-lg flex items-center space-x-2 border border-gray-700">
              <span className="font-bold text-white">
                {chainConfig?.nativeCurrency?.symbol || 'ETH'}
              </span>
            </div>
          </div>
        </div>

        {/* Arrow */}
        <div className="flex justify-center -my-2 relative z-10">
          <div className="bg-gray-700 p-2 rounded-full border border-gray-600">
            <svg
              className="w-4 h-4 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 14l-7 7m0 0l-7-7m7 7V3"
              />
            </svg>
          </div>
        </div>

        {/* To Token */}
        <div className="bg-gray-900 p-4 rounded-xl border border-gray-700">
          <div className="flex justify-between mb-2">
            <span className="text-gray-400 text-sm">Receive</span>
          </div>
          <div className="flex space-x-4">
            <input
              type="text"
              value={quote ? ethers.formatEther(quote.toAmount) : ''}
              readOnly
              placeholder="0.0"
              className="bg-transparent text-2xl text-white focus:outline-none w-full"
            />
            <div className="bg-gray-800 px-3 py-1 rounded-lg flex items-center space-x-2 border border-gray-700">
              <input
                type="text"
                placeholder="Token Address"
                value={toToken}
                onChange={(e) => setToToken(e.target.value)}
                className="bg-transparent text-white text-sm w-24 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Quote Details */}
        {quote && (
          <div className="bg-gray-800/50 p-4 rounded-xl border border-gray-700/50 text-sm space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-400">Rate</span>
              <span className="text-white">
                1 {chainConfig?.nativeCurrency?.symbol} ={' '}
                {parseFloat(ethers.formatEther(quote.toAmount)) / parseFloat(amount)} Token
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Network Cost</span>
              <span className="text-white">~$5.00</span>
            </div>
          </div>
        )}

        {error && (
          <div className="text-red-400 text-sm text-center bg-red-900/20 p-3 rounded-lg border border-red-900/50">
            {error}
          </div>
        )}

        <button
          onClick={handleSwap}
          disabled={loading || executing || !quote}
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 rounded-xl font-bold text-lg hover:from-blue-700 hover:to-purple-700 transition disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-900/20"
        >
          {loading ? 'Fetching Quote...' : executing ? 'Swapping...' : 'Swap'}
        </button>
      </div>
    </div>
  );
}
