'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useWalletStore } from '@/store/walletStore';

export default function Home() {
  const router = useRouter();
  const { isUnlocked, wallets } = useWalletStore();

  useEffect(() => {
    if (!isUnlocked && wallets.length === 0) {
      router.push('/onboarding');
    } else if (!isUnlocked) {
      router.push('/login');
    } else {
      router.push('/dashboard');
    }
  }, [isUnlocked, wallets, router]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
    </div>
  );
}

