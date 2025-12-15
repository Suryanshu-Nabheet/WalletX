'use client';

import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { CHAIN_CONFIGS } from '@/shared/index';
import { ethers } from 'ethers';

interface HistoryProps {
  walletAddress: string;
  chainId: number;
}

export default function History({ walletAddress, chainId }: HistoryProps) {
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadHistory();
  }, [walletAddress, chainId]);

  const loadHistory = async () => {
    setLoading(true);
    try {
      const data = await api.getHistory(walletAddress, chainId);
      setHistory(data);
    } catch (error) {
      console.error('Failed to load history:', error);
    } finally {
      setLoading(false);
    }
  };

  const chainConfig = CHAIN_CONFIGS[chainId];

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (history.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg
            className="w-8 h-8 text-gray-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <p>No transaction history found</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {history.map((tx, index) => (
        <div
          key={index}
          className="bg-gray-800 p-4 rounded-xl border border-gray-700 flex items-center justify-between hover:bg-gray-750 transition"
        >
          <div className="flex items-center space-x-4">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center ${
                tx.from.toLowerCase() === walletAddress.toLowerCase()
                  ? 'bg-red-500/20 text-red-400'
                  : 'bg-green-500/20 text-green-400'
              }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {tx.from.toLowerCase() === walletAddress.toLowerCase() ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 10l7-7m0 0l7 7m-7-7v18"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 14l-7 7m0 0l-7-7m7 7V3"
                  />
                )}
              </svg>
            </div>
            <div>
              <p className="font-bold text-white">
                {tx.from.toLowerCase() === walletAddress.toLowerCase() ? 'Sent' : 'Received'}
              </p>
              <p className="text-xs text-gray-500">{new Date(tx.timestamp).toLocaleDateString()}</p>
            </div>
          </div>
          <div className="text-right">
            <p
              className={`font-bold ${
                tx.from.toLowerCase() === walletAddress.toLowerCase()
                  ? 'text-white'
                  : 'text-green-400'
              }`}
            >
              {tx.from.toLowerCase() === walletAddress.toLowerCase() ? '-' : '+'}
              {tx.value} {chainConfig?.nativeCurrency?.symbol}
            </p>
            <p className="text-xs text-gray-500">{tx.status || 'Confirmed'}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
