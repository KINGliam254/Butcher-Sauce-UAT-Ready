"use client";

import { motion } from "framer-motion";

import Link from "next/link";

export default function Hero() {
    return (
        <section className="relative h-screen w-full flex flex-col items-center justify-center pt-24 md:pt-32 overflow-hidden">
            {/* Background with pseudo-image effect since gen failed */}
            <div className="absolute inset-0 z-0 bg-white">
                <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{
                        backgroundImage: "url('https://images.unsplash.com/photo-1544025162-d76694265947?ixlib=rb-4.0.3&auto=format&fit=crop&w=2069&q=80')"
                    }}
                />
                <div className="absolute inset-0 bg-black/40" />
            </div>

            <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
                >
                    <span className="text-ruby text-xs md:text-sm uppercase tracking-[0.4em] font-medium mb-6 block">
                        The Ruby Standard of Meats
                    </span>
                    <h1 className="text-5xl md:text-8xl font-serif font-bold text-white mb-8 leading-[1.1]">
                        We define the art of <br />
                        <span className="italic font-light text-zinc-300 font-serif">preparing meat in Kenya.</span>
                    </h1>
                    <p className="text-zinc-200 text-base md:text-lg max-w-2xl mx-auto mb-12 font-light leading-relaxed">
                        Giving Kenyans access to premium aged beef and tender goat at the standard they deserve. Experience the artisanal mission of Butcher & Sauce.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                        <Link href="/prime-cuts" className="px-10 py-5 bg-white text-black uppercase text-[10px] tracking-widest font-bold hover:bg-ruby hover:text-white transition-all duration-500 rounded-sm shadow-xl">
                            Explore The Cuts
                        </Link>
                        <Link href="/the-butchery" className="px-10 py-5 border border-white/20 text-white uppercase text-[10px] tracking-widest font-bold hover:bg-white hover:text-black transition-all duration-500 rounded-sm">
                            Our Vision
                        </Link>
                    </div>
                </motion.div>
            </div>

            {/* Decorative elements */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1, duration: 2 }}
                className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4"
            >
                <span className="text-[8px] uppercase tracking-[0.3em] text-zinc-400">Scroll to Explore</span>
                <div className="w-px h-12 bg-gradient-to-b from-ruby to-transparent" />
            </motion.div>
        </section>
    );
}
