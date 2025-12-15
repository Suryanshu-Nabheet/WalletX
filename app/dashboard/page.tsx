'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useWalletStore } from '@/store/walletStore';
import { api } from '@/lib/api';
import { CHAIN_CONFIGS, ChainId } from '@/shared/index';
import { ethers } from 'ethers';
import Swap from '@/components/Swap';
import History from '@/components/History';
import { Sidebar, SidebarBody, SidebarLink } from '@/components/ui/sidebar';
import {
  IconArrowLeft,
  IconBrandTabler,
  IconSettings,
  IconUserBolt,
  IconCurrencyEthereum,
  IconHistory,
  IconArrowsExchange,
  IconLock,
  IconSend,
} from '@tabler/icons-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

// Define Logo components outside to avoid re-renders/hoisting issues
function Logo() {
  return (
    <a
      href="#"
      className="relative z-20 flex items-center space-x-2 py-1 text-sm font-normal text-black"
    >
      <div className="h-6 w-6 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex-shrink-0" />
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="font-bold text-xl text-white whitespace-pre"
      >
        WalletX
      </motion.span>
    </a>
  );
}

function LogoIcon() {
  return (
    <a
      href="#"
      className="relative z-20 flex items-center space-x-2 py-1 text-sm font-normal text-black"
    >
      <div className="h-6 w-6 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex-shrink-0" />
    </a>
  );
}

export default function DashboardPage() {
  const router = useRouter();
  const { wallets, isUnlocked, lockVault, getPrivateKey } = useWalletStore();
  const [selectedWalletId, setSelectedWalletId] = useState<string>('');
  const [balance, setBalance] = useState<string>('0');
  const [loading, setLoading] = useState(true);
  const [chainId, setChainId] = useState<number>(ChainId.ETHEREUM);
  const [activeView, setActiveView] = useState<
    'dashboard' | 'swap' | 'history' | 'settings' | 'send'
  >('dashboard');
  const [open, setOpen] = useState(false);

  // Send state
  const [sendAddress, setSendAddress] = useState('');
  const [sendAmount, setSendAmount] = useState('');
  const [sending, setSending] = useState(false);
  const [sendError, setSendError] = useState('');
  const [sendSuccess, setSendSuccess] = useState('');

  // Initial auth check
  useEffect(() => {
    if (!isUnlocked) {
      router.push('/login');
      return;
    }
    if (wallets.length > 0 && !selectedWalletId) {
      setSelectedWalletId(wallets[0].id);
    }
  }, [isUnlocked, wallets, router, selectedWalletId]);

  // Balance polling
  useEffect(() => {
    if (selectedWalletId) {
      loadBalance();
      const interval = setInterval(loadBalance, 5000); // 5s poll
      return () => clearInterval(interval);
    }
  }, [selectedWalletId, chainId]);

  const loadBalance = async () => {
    const wallet = wallets.find((w) => w.id === selectedWalletId);
    if (!wallet) return;

    if (balance === '0') setLoading(true);

    try {
      const balanceData = await api.getBalance(wallet.address, chainId);
      setBalance(balanceData.balance);
    } catch (error) {
      console.error('Failed to load balance:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    setSendError('');
    setSendSuccess('');

    try {
      const privateKey = getPrivateKey(selectedWalletId);
      if (!privateKey) throw new Error('Wallet locked or invalid');

      // Use provider from API
      const provider = api.getProvider(chainId);
      const wallet = new ethers.Wallet(privateKey, provider);

      // Parse amount
      const val = ethers.parseEther(sendAmount);

      const tx = await wallet.sendTransaction({
        to: sendAddress,
        value: val,
      });

      setSendSuccess(`Transaction sent! Hash: ${tx.hash}`);
      setSendAmount('');
      setSendAddress('');
      setTimeout(() => loadBalance(), 2000); // Refresh balance shortly after
    } catch (err: any) {
      console.error(err);
      setSendError(err.message || 'Transaction failed');
    } finally {
      setSending(false);
    }
  };

  const handleLogout = () => {
    lockVault();
    router.push('/login');
  };

  const currentWallet = wallets.find((w) => w.id === selectedWalletId);
  const chainConfig = CHAIN_CONFIGS[chainId];

  if (!isUnlocked || !currentWallet) return null;

  const links = [
    {
      label: 'Dashboard',
      href: '#',
      icon: <IconBrandTabler className="h-5 w-5 shrink-0 text-neutral-200" />,
      onClick: () => setActiveView('dashboard'),
    },
    {
      label: 'Send',
      href: '#',
      icon: <IconSend className="h-5 w-5 shrink-0 text-neutral-200" />,
      onClick: () => setActiveView('send'),
    },
    {
      label: 'Swap',
      href: '#',
      icon: <IconArrowsExchange className="h-5 w-5 shrink-0 text-neutral-200" />,
      onClick: () => setActiveView('swap'),
    },
    {
      label: 'History',
      href: '#',
      icon: <IconHistory className="h-5 w-5 shrink-0 text-neutral-200" />,
      onClick: () => setActiveView('history'),
    },
    {
      label: 'Lock Wallet',
      href: '#',
      icon: <IconLock className="h-5 w-5 shrink-0 text-neutral-200" />,
      onClick: handleLogout,
    },
  ];

  return (
    <div
      className={cn(
        'flex flex-col md:flex-row bg-black w-full flex-1 mx-auto border border-neutral-700 overflow-hidden',
        'h-screen'
      )}
    >
      <Sidebar open={open} setOpen={setOpen}>
        <SidebarBody className="justify-between gap-10 bg-neutral-900 border-r border-neutral-800">
          <div className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
            {open ? <Logo /> : <LogoIcon />}
            <div className="mt-8 flex flex-col gap-2">
              {links.map((link, idx) => (
                <div key={idx} onClick={link.onClick}>
                  <SidebarLink link={link} />
                </div>
              ))}
            </div>
          </div>
          <div>
            <SidebarLink
              link={{
                label: currentWallet.name || 'Wallet',
                href: '#',
                icon: (
                  <div className="h-7 w-7 shrink-0 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-xs font-bold text-white">
                    {currentWallet.name?.[0] || 'W'}
                  </div>
                ),
              }}
            />
          </div>
        </SidebarBody>
      </Sidebar>

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col overflow-y-auto bg-black p-4 md:p-10">
        {/* Header / Wallet Selector */}
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold text-white">
            {activeView.charAt(0).toUpperCase() + activeView.slice(1)}
          </h2>
          <div className="flex items-center space-x-4">
            <select
              value={chainId}
              onChange={(e) => setChainId(Number(e.target.value))}
              className="bg-neutral-900 border border-neutral-700 text-white text-sm py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {Object.entries(CHAIN_CONFIGS).map(([id, config]) => (
                <option key={id} value={id}>
                  {config.name}
                </option>
              ))}
            </select>

            <select
              value={selectedWalletId}
              onChange={(e) => setSelectedWalletId(e.target.value)}
              className="bg-neutral-900 border border-neutral-700 text-white text-sm py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {wallets.map((w) => (
                <option key={w.id} value={w.id}>
                  {w.name} ({w.address.slice(0, 6)}...{w.address.slice(-4)})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Views */}
        <div className="flex-1 max-w-4xl mx-auto w-full">
          {activeView === 'dashboard' && (
            <div className="space-y-6">
              {/* Balance Card */}
              <div className="w-full rounded-2xl bg-gradient-to-br from-neutral-900 to-neutral-800 border border-neutral-700 p-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 -mt-4 -mr-4 w-32 h-32 bg-blue-500/20 rounded-full blur-3xl"></div>
                <div className="relative z-10">
                  <p className="text-neutral-400 text-sm font-medium">Total Balance</p>
                  <h2 className="text-5xl font-bold text-white mt-2 tracking-tight">
                    {loading && balance === '0' ? (
                      <span className="animate-pulse">...</span>
                    ) : (
                      `${parseFloat(balance).toFixed(4)} ${chainConfig?.nativeCurrency?.symbol || 'ETH'}`
                    )}
                  </h2>
                  <div className="flex space-x-4 mt-8">
                    <button
                      onClick={() => setActiveView('send')}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition shadow-lg shadow-blue-900/20"
                    >
                      Send
                    </button>
                    <button
                      onClick={() => setActiveView('swap')}
                      className="bg-neutral-700 hover:bg-neutral-600 text-white px-6 py-2 rounded-lg font-medium transition"
                    >
                      Trade / Swap
                    </button>
                    <button className="bg-neutral-700 hover:bg-neutral-600 text-white px-6 py-2 rounded-lg font-medium transition">
                      Receive
                    </button>
                  </div>
                </div>
              </div>

              {/* Assets List */}
              <div className="rounded-2xl bg-neutral-900 border border-neutral-800 p-6">
                <h3 className="text-lg font-bold text-white mb-4">Assets</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 rounded-xl bg-neutral-800/50 border border-neutral-700/50 hover:bg-neutral-800 transition cursor-pointer">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-blue-500/20 rounded-full flex items-center justify-center text-blue-400 font-bold">
                        {chainConfig?.nativeCurrency?.symbol?.[0] || 'E'}
                      </div>
                      <div>
                        <p className="font-semibold text-white">
                          {chainConfig?.nativeCurrency?.symbol || 'ETH'}
                        </p>
                        <p className="text-sm text-neutral-400">
                          {chainConfig?.name || 'Ethereum'}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-white">{parseFloat(balance).toFixed(4)}</p>
                      <p className="text-sm text-neutral-400">$0.00</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeView === 'send' && (
            <div className="max-w-md mx-auto">
              <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 shadow-xl">
                <h2 className="text-xl font-bold text-white mb-6">
                  Send {chainConfig?.nativeCurrency?.symbol}
                </h2>

                <form onSubmit={handleSend} className="space-y-4">
                  <div>
                    <label className="block text-sm text-neutral-400 mb-1">Recipient Address</label>
                    <input
                      value={sendAddress}
                      onChange={(e) => setSendAddress(e.target.value)}
                      placeholder="0x..."
                      className="w-full bg-black/50 border border-neutral-700 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-blue-600 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-neutral-400 mb-1">Amount</label>
                    <input
                      value={sendAmount}
                      onChange={(e) => setSendAmount(e.target.value)}
                      placeholder="0.0"
                      type="number"
                      step="0.000001"
                      className="w-full bg-black/50 border border-neutral-700 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-blue-600 outline-none"
                    />
                  </div>

                  {sendError && (
                    <div className="p-3 bg-red-900/30 border border-red-500/30 rounded-lg text-red-200 text-sm">
                      {sendError}
                    </div>
                  )}
                  {sendSuccess && (
                    <div className="p-3 bg-green-900/30 border border-green-500/30 rounded-lg text-green-200 text-sm break-all">
                      {sendSuccess}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={sending || !sendAddress || !sendAmount}
                    className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3 rounded-xl transition"
                  >
                    {sending ? 'Sending...' : 'Confirm Send'}
                  </button>
                </form>
              </div>
            </div>
          )}

          {activeView === 'swap' && (
            <div className="max-w-2xl mx-auto">
              <Swap walletAddress={currentWallet.address} chainId={chainId} />
            </div>
          )}

          {activeView === 'history' && (
            <div className="rounded-2xl bg-neutral-900 border border-neutral-800 p-6">
              <History walletAddress={currentWallet.address} chainId={chainId} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
