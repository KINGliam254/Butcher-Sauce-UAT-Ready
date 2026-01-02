"use client";

import { motion } from "framer-motion";
import { CheckCircle, ShoppingBag, ArrowRight, MapPin, Smartphone, Truck } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function SuccessContent() {
    const searchParams = useSearchParams();
    const orderId = searchParams.get("id");

    return (
        <div className="max-w-3xl mx-auto px-6 text-center space-y-12">
            <motion.div
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", damping: 15 }}
                className="w-24 h-24 bg-gold/10 rounded-full mx-auto flex items-center justify-center border border-gold/20"
            >
                <CheckCircle className="text-gold" size={48} strokeWidth={1.5} />
            </motion.div>

            <div className="space-y-4">
                <motion.span
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-gold text-[10px] uppercase tracking-[0.5em] font-bold block"
                >
                    Order Confirmed
                </motion.span>
                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="text-5xl md:text-7xl font-serif font-bold text-black leading-tight"
                >
                    The Best <br />
                    <span className="italic font-light text-zinc-400">is on Its Way.</span>
                </motion.h1>
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="text-zinc-500 font-light max-w-lg mx-auto leading-relaxed"
                >
                    Your artisanal selection has been reserved and our master butchers are preparing your cuts. Order <span className="text-black font-medium">#{orderId?.slice(-6).toUpperCase() || "SUCCESS"}</span> is being processed.
                </motion.p>
            </div>

            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-12"
            >
                <div className="p-8 bg-neutral-soft rounded-sm space-y-4 text-left">
                    <Truck className="text-gold" size={20} />
                    <p className="text-[10px] uppercase tracking-widest text-zinc-400 font-bold">Logistics</p>
                    <p className="text-sm font-serif italic text-black leading-relaxed">Delivery initiated within 2-4 business hours.</p>
                </div>
                <div className="p-8 bg-neutral-soft rounded-sm space-y-4 text-left border border-gold/20">
                    <Smartphone className="text-gold" size={20} />
                    <p className="text-[10px] uppercase tracking-widest text-zinc-400 font-bold">Confirm Now</p>
                    <p className="text-sm font-serif italic text-black leading-relaxed mb-4">Click below to send your order receipt to our master butcher.</p>
                    <a
                        href={`https://wa.me/254795999555?text=${encodeURIComponent(`Hi Butcher & Sauce! I've just placed an order (Ref: #${orderId?.slice(-6).toUpperCase()}). Please confirm receipt and let me know the delivery ETA. Thank you!`)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-[10px] uppercase tracking-widest font-bold text-gold hover:text-black transition-colors"
                    >
                        Confirm via WhatsApp <ArrowRight size={12} />
                    </a>
                </div>
                <div className="p-8 bg-neutral-soft rounded-sm space-y-4 text-left">
                    <MapPin className="text-gold" size={20} />
                    <p className="text-[10px] uppercase tracking-widest text-zinc-400 font-bold">Location</p>
                    <p className="text-sm font-serif italic text-black leading-relaxed">Evergreen Square, Kiambu Road.</p>
                </div>
            </motion.div>

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="pt-12 flex flex-col md:flex-row gap-6 justify-center"
            >
                <Link
                    href="/prime-cuts"
                    className="px-12 py-5 bg-black text-white text-[10px] uppercase tracking-widest font-bold hover:bg-gold hover:text-black transition-all duration-500 rounded-sm shadow-xl flex items-center justify-center gap-3"
                >
                    Return to Selection <ArrowRight size={14} />
                </Link>
            </motion.div>
        </div>
    );
}

export default function SuccessPage() {
    return (
        <div className="bg-white min-h-screen pt-40 pb-24">
            <Suspense fallback={<div className="text-center p-12">Loading...</div>}>
                <SuccessContent />
            </Suspense>
        </div>
    );
}
