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

                {/* Dashboard Preview */}
                <motion.div
                    initial={{ opacity: 0, y: 40, rotateX: 20 }}
                    animate={{ opacity: 1, y: 0, rotateX: 0 }}
                    transition={{ duration: 0.8, delay: 1.2, ease: "easeOut" }}
                    className="relative z-10 mt-24 rounded-3xl border border-neutral-800 bg-neutral-900/50 p-4 shadow-2xl shadow-blue-900/20 backdrop-blur-xl"
                    style={{ perspective: "1000px" }}
                >
                    <div className="w-full overflow-hidden rounded-2xl border border-neutral-800 bg-black">
                        <div className="aspect-[16/9] w-full bg-gradient-to-br from-gray-900 via-black to-blue-900/20 flex items-center justify-center relative overflow-hidden">
                            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
                            <div className="text-center">
                                <div className="w-20 h-20 bg-blue-600 rounded-2xl mx-auto flex items-center justify-center shadow-lg shadow-blue-500/20 mb-6">
                                    <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                    </svg>
                                </div>
                                <h3 className="text-2xl font-bold text-white">WalletX Dashboard</h3>
                            </div>
                        </div>
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
