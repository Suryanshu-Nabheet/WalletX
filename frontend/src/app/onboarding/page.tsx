'use client';

import Link from 'next/link';

export default function OnboardingPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-md w-full glass-card rounded-2xl p-8 text-center">
        <div className="mb-8">
          <div className="w-20 h-20 bg-blue-600 rounded-2xl mx-auto flex items-center justify-center shadow-lg shadow-blue-500/20 mb-6">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <h1 className="text-4xl font-bold mb-4 text-white tracking-tight">
            WalletX
          </h1>
          <p className="text-gray-400 text-lg">
            Enterprise-grade Web3 Wallet. <br /> Secure. Fast. Professional.
          </p>
        </div>

        <div className="space-y-4">
          <Link
            href="/onboarding/import"
            className="block w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-xl font-bold text-lg transition-all transform hover:scale-[1.02] shadow-xl shadow-blue-900/20"
          >
            Connect Existing Wallet
          </Link>

          <p className="text-xs text-gray-500 mt-6">
            By connecting, you agree to our Terms of Service and Privacy Policy.
          </p>
        </div>
      </div>
    </div>
  );
}
