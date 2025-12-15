"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function HeroSection() {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    return (
        <div className="relative mx-auto flex min-h-screen flex-col items-center justify-center bg-black overflow-hidden">
            <Navbar />

            {/* Grid Lines */}
            <div className="absolute inset-y-0 left-0 h-full w-px bg-neutral-800/50">
                <div className="absolute top-0 h-40 w-px bg-gradient-to-b from-transparent via-blue-500 to-transparent" />
            </div>
            <div className="absolute inset-y-0 right-0 h-full w-px bg-neutral-800/50">
                <div className="absolute h-40 w-px bg-gradient-to-b from-transparent via-blue-500 to-transparent" />
            </div>
            <div className="absolute inset-x-0 bottom-0 h-px w-full bg-neutral-800/50">
                <div className="absolute mx-auto h-px w-40 bg-gradient-to-r from-transparent via-blue-500 to-transparent" />
            </div>

            <div className="px-4 py-20 md:py-32 relative z-10">
                <h1 className="relative z-10 mx-auto max-w-5xl text-center text-4xl font-bold text-white md:text-6xl lg:text-8xl tracking-tight">
                    {"Secure Web3 Wallet for the Future"
                        .split(" ")
                        .map((word, index) => (
                            <motion.span
                                key={index}
                                initial={{ opacity: 0, filter: "blur(10px)", y: 20 }}
                                animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
                                transition={{
                                    duration: 0.5,
                                    delay: index * 0.1,
                                    ease: "easeOut",
                                }}
                                className="mr-3 inline-block text-transparent bg-clip-text bg-gradient-to-b from-white to-white/60"
                            >
                                {word}
                            </motion.span>
                        ))}
                </h1>

                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.8 }}
                    className="relative z-10 mx-auto max-w-2xl py-8 text-center text-lg md:text-xl font-normal text-neutral-400"
                >
                    Manage your crypto assets with enterprise-grade security.
                    Pair your existing <strong>Phantom</strong> or <strong>Backpack</strong> wallet,
                    or unlock your secure vault. No database, just you and the blockchain.
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 1 }}
                    className="relative z-10 mt-8 flex flex-wrap items-center justify-center gap-6"
                >
                    <Link href="/login">
                        <button className="w-64 transform rounded-xl bg-white px-8 py-4 font-bold text-black transition-all duration-300 hover:-translate-y-1 hover:bg-gray-100 hover:shadow-2xl hover:shadow-white/20">
                            Unlock Wallet
                        </button>
                    </Link>

                    <Link href="/onboarding/import">
                        <button className="w-64 transform rounded-xl border border-neutral-700 bg-neutral-900/50 px-8 py-4 font-bold text-white transition-all duration-300 hover:-translate-y-1 hover:bg-neutral-800 hover:border-neutral-600 backdrop-blur-md">
                            Pair Wallet
                        </button>
                    </Link>
                </motion.div>


                {/* Feature Highlights */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 1.2, ease: "easeOut" }}
                    className="relative z-10 mt-24 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto"
                >
                    {/* Feature 1 */}
                    <div className="rounded-2xl border border-neutral-800 bg-neutral-900/50 p-6 backdrop-blur-xl hover:border-neutral-700 transition-all">
                        <div className="w-12 h-12 bg-blue-600/20 rounded-xl flex items-center justify-center mb-4">
                            <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            </svg>
                        </div>
                        <h3 className="text-lg font-bold text-white mb-2">Secure & Private</h3>
                        <p className="text-sm text-neutral-400">Client-side encryption. Your keys never leave your device.</p>
                    </div>

                    {/* Feature 2 */}
                    <div className="rounded-2xl border border-neutral-800 bg-neutral-900/50 p-6 backdrop-blur-xl hover:border-neutral-700 transition-all">
                        <div className="w-12 h-12 bg-purple-600/20 rounded-xl flex items-center justify-center mb-4">
                            <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                        </div>
                        <h3 className="text-lg font-bold text-white mb-2">Multi-Network</h3>
                        <p className="text-sm text-neutral-400">Support for Ethereum, Polygon, and Sepolia testnet.</p>
                    </div>

                    {/* Feature 3 */}
                    <div className="rounded-2xl border border-neutral-800 bg-neutral-900/50 p-6 backdrop-blur-xl hover:border-neutral-700 transition-all">
                        <div className="w-12 h-12 bg-green-600/20 rounded-xl flex items-center justify-center mb-4">
                            <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                            </svg>
                        </div>
                        <h3 className="text-lg font-bold text-white mb-2">Easy Import</h3>
                        <p className="text-sm text-neutral-400">Import from Phantom, Backpack, or any wallet with seed phrase.</p>
                    </div>
                </motion.div>
            </div>

            {/* Background Gradients */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/10 rounded-full blur-[100px]"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/10 rounded-full blur-[100px]"></div>
            </div>
        </div>
    );
}

const Navbar = () => {
    return (
        <nav className="absolute top-0 left-0 right-0 z-50 flex w-full items-center justify-between border-b border-neutral-800 bg-black/50 backdrop-blur-md px-6 py-4">
            <div className="flex items-center gap-3">
                <div className="size-8 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                </div>
                <h1 className="text-xl font-bold text-white tracking-tight">WalletX</h1>
            </div>
            <div className="flex gap-4">
                <Link href="/login">
                    <button className="rounded-lg bg-white px-6 py-2 font-bold text-black transition-all hover:bg-gray-200">
                        Unlock
                    </button>
                </Link>
            </div>
        </nav>
    );
};
