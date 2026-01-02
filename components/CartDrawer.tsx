"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { useCart } from "@/context/CartContext";
import Image from "next/image";
import Link from "next/link";

export default function CartDrawer() {
    const { cart, isCartOpen, setIsCartOpen, removeItem, updateQuantity, subtotal, totalItems } = useCart();

    return (
        <AnimatePresence>
            {isCartOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setIsCartOpen(false)}
                        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100]"
                    />

                    {/* Drawer */}
                    <motion.div
                        initial={{ x: "100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "100%" }}
                        transition={{ type: "spring", damping: 25, stiffness: 200 }}
                        className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-white z-[101] shadow-2xl flex flex-col"
                    >
                        {/* Header */}
                        <div className="p-8 border-b border-black/5 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <ShoppingBag size={20} className="text-gold" />
                                <h2 className="text-xl font-serif font-bold text-black uppercase tracking-widest">
                                    Butcher's Bag
                                </h2>
                                <span className="bg-neutral-soft text-black text-[10px] px-2 py-1 rounded-full font-bold">
                                    {totalItems}
                                </span>
                            </div>
                            <button
                                onClick={() => setIsCartOpen(false)}
                                className="p-2 hover:bg-neutral-soft rounded-full transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Items */}
                        <div className="flex-1 overflow-y-auto p-8 space-y-8">
                            {cart.length === 0 ? (
                                <div className="h-full flex flex-col items-center justify-center text-center space-y-6">
                                    <div className="w-20 h-20 bg-neutral-soft rounded-full flex items-center justify-center">
                                        <ShoppingBag size={32} className="text-zinc-300" />
                                    </div>
                                    <div className="space-y-2">
                                        <p className="font-serif italic text-lg text-black">Your bag is currently empty.</p>
                                        <p className="text-[10px] uppercase tracking-widest text-zinc-400 font-bold">Start your selection from our prime cuts.</p>
                                    </div>
                                    <button
                                        onClick={() => setIsCartOpen(false)}
                                        className="px-8 py-4 bg-black text-white uppercase text-[10px] tracking-widest font-bold hover:bg-gold hover:text-black transition-all duration-500 rounded-sm"
                                    >
                                        Explore Collection
                                    </button>
                                </div>
                            ) : (
                                cart.map((item, idx) => (
                                    <div key={`${item.slug}-${idx}`} className="flex gap-6 border-b border-black/5 pb-8 last:border-0">
                                        <div className="relative w-24 aspect-[4/5] bg-neutral-soft rounded-sm overflow-hidden shrink-0">
                                            <Image
                                                src={item.image}
                                                alt={item.name}
                                                fill
                                                className="object-cover grayscale hover:grayscale-0 transition-all duration-500"
                                            />
                                        </div>
                                        <div className="flex-1 space-y-3">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <span className="text-[9px] uppercase tracking-widest text-gold font-bold">{item.category}</span>
                                                    <h3 className="text-base font-serif font-bold text-black">{item.name}</h3>
                                                    {(item.preparation || item.doneness) && (
                                                        <p className="text-[9px] uppercase tracking-widest text-zinc-400 font-bold mt-1">
                                                            {item.preparation} {item.doneness && `• ${item.doneness}`}
                                                        </p>
                                                    )}
                                                </div>
                                                <button
                                                    onClick={() => removeItem(item.slug, item.preparation, item.doneness)}
                                                    className="text-zinc-300 hover:text-red-500 transition-colors"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>

                                            <div className="flex justify-between items-center">
                                                <div className="flex items-center border border-black/5 rounded-sm">
                                                    <button
                                                        onClick={() => updateQuantity(item.slug, item.quantity - 1, item.preparation, item.doneness)}
                                                        className="p-1.5 hover:bg-neutral-soft transition-colors"
                                                    >
                                                        <Minus size={12} />
                                                    </button>
                                                    <span className="w-8 text-center text-[10px] font-bold">{item.quantity}</span>
                                                    <button
                                                        onClick={() => updateQuantity(item.slug, item.quantity + 1, item.preparation, item.doneness)}
                                                        className="p-1.5 hover:bg-neutral-soft transition-colors"
                                                    >
                                                        <Plus size={12} />
                                                    </button>
                                                </div>
                                                <p className="font-serif italic text-black">{item.price}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        {/* Footer */}
                        {cart.length > 0 && (
                            <div className="p-8 bg-neutral-soft border-t border-black/5 space-y-6">
                                <div className="space-y-2">
                                    <div className="flex justify-between items-center">
                                        <span className="text-[10px] uppercase tracking-[0.2em] text-zinc-500 font-bold shrink-0">Subtotal</span>
                                        <span className="text-xl font-serif font-bold text-black whitespace-nowrap">Ksh {subtotal.toLocaleString()}</span>
                                    </div>
                                    <p className="text-[9px] uppercase tracking-widest text-zinc-400 font-bold">Shipping & taxes calculated at checkout.</p>
                                </div>

                                <Link
                                    href="/checkout"
                                    onClick={() => setIsCartOpen(false)}
                                    className="w-full py-6 bg-black text-white uppercase text-[10px] tracking-widest font-bold hover:bg-gold hover:text-black transition-all duration-500 rounded-sm shadow-xl flex items-center justify-center gap-3 group"
                                >
                                    Proceed to Payment
                                    <ShoppingBag size={14} className="group-hover:-translate-y-1 transition-transform" />
                                </Link>
                            </div>
                        )}
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
