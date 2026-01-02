"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search as SearchIcon, X, ArrowRight, ShoppingBag, Loader2 } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

interface Product {
    id: string;
    slug: string;
    name: string;
    price_display: string;
    category: string;
    image_url: string;
}

interface SearchModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function SearchModal({ isOpen, onClose }: SearchModalProps) {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const fetchResults = async () => {
            if (query.trim().length > 1) {
                setIsLoading(true);
                try {
                    const { createClient } = await import("@/utils/supabase/client");
                    const supabase = createClient();

                    const { data } = await supabase
                        .from('products')
                        .select('*')
                        .or(`name.ilike.%${query}%,category.ilike.%${query}%`)
                        .limit(6);

                    setResults(data || []);
                } catch (error) {
                    console.error("Search error:", error);
                } finally {
                    setIsLoading(false);
                }
            } else {
                setResults([]);
            }
        };

        const timer = setTimeout(fetchResults, 300);
        return () => clearTimeout(timer);
    }, [query]);

    // Prevent body scroll when open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "auto";
        }
        return () => { document.body.style.overflow = "auto"; };
    }, [isOpen]);

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[200] flex items-center justify-center p-6 md:p-24"
                >
                    {/* Backdrop */}
                    <div className="absolute inset-0 bg-white/95 backdrop-blur-md" onClick={onClose} />

                    {/* Close Button */}
                    <button
                        onClick={onClose}
                        className="absolute top-12 right-12 p-3 hover:bg-neutral-soft rounded-full transition-colors z-[201]"
                    >
                        <X size={24} className="text-black" />
                    </button>

                    {/* Modal Content */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 30 }}
                        className="w-full max-w-4xl z-[201] space-y-16"
                    >
                        {/* Search Input */}
                        <div className="relative border-b-2 border-black/5 pb-6">
                            <SearchIcon size={32} className="absolute left-0 top-1 text-zinc-300" />
                            <input
                                autoFocus
                                type="text"
                                placeholder="Search our premium collection..."
                                className="w-full pl-12 bg-transparent text-3xl md:text-5xl font-serif font-bold text-black focus:outline-none placeholder:text-zinc-200"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                            />
                            {isLoading && (
                                <div className="absolute right-0 bottom-6">
                                    <Loader2 size={24} className="text-gold animate-spin" />
                                </div>
                            )}
                        </div>

                        {/* Results */}
                        <div className="min-h-[400px] max-h-[60vh] overflow-y-auto custom-scrollbar pr-4">
                            {query.trim().length > 1 ? (
                                results.length > 0 ? (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                                        {results.map((product) => (
                                            <Link
                                                key={product.slug}
                                                href={`/prime-cuts/${product.slug}`}
                                                onClick={onClose}
                                                className="group flex gap-6 items-center border-b border-black/5 pb-8"
                                            >
                                                <div className="relative w-24 aspect-[4/5] overflow-hidden bg-neutral-soft rounded-sm shrink-0 shadow-sm group-hover:shadow-xl transition-shadow duration-500">
                                                    <Image
                                                        src={product.image_url}
                                                        alt={product.name}
                                                        fill
                                                        className="object-cover grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-110"
                                                    />
                                                </div>
                                                <div className="flex-1 space-y-1">
                                                    <span className="text-[9px] uppercase tracking-widest text-gold font-bold">{product.category}</span>
                                                    <h3 className="text-xl font-serif font-bold text-black group-hover:text-gold transition-colors">{product.name}</h3>
                                                    <div className="flex items-center gap-2 text-zinc-400">
                                                        <span className="text-sm font-medium">{product.price_display}</span>
                                                        <ArrowRight size={14} className="opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                                                    </div>
                                                </div>
                                            </Link>
                                        ))}
                                    </div>
                                ) : !isLoading && (
                                    <div className="h-full flex flex-col items-center justify-center text-center space-y-4 pt-12">
                                        <p className="text-xl font-serif italic text-zinc-400">No matches found for "{query}"</p>
                                        <p className="text-[10px] uppercase tracking-widest text-zinc-300 font-bold">Try searching for Wagyu, Ribeye, or Sauce</p>
                                    </div>
                                )
                            ) : (
                                <div className="space-y-12 pt-8">
                                    <div>
                                        <h4 className="text-[10px] uppercase tracking-[0.3em] text-zinc-400 font-bold mb-8">Popular Categories</h4>
                                        <div className="flex flex-wrap gap-4">
                                            {["Signature Reserve", "Mountain Range", "Artisanal Sauces", "Master Tools", "Drinks"].map((cat) => (
                                                <button
                                                    key={cat}
                                                    onClick={() => setQuery(cat)}
                                                    className="px-6 py-3 bg-neutral-soft hover:bg-black hover:text-white text-[10px] uppercase tracking-widest font-bold rounded-full transition-all"
                                                >
                                                    {cat}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 opaciy-50 pt-8 grayscale">
                                        <div className="space-y-4 border-l-2 border-black/5 pl-8">
                                            <h4 className="text-[10px] uppercase tracking-[0.3em] font-bold text-zinc-300">Quick Tips</h4>
                                            <p className="text-zinc-400 font-light text-sm italic leading-relaxed">
                                                Search for specific cuts like "Wagyu" or "Ribeye" for immediate results. Our master butchers recommend the Reserve collection for the ultimate experience.
                                            </p>
                                        </div>
                                        <div className="space-y-4 border-l-2 border-black/5 pl-8">
                                            <h4 className="text-[10px] uppercase tracking-[0.3em] font-bold text-zinc-300">Artisanal Pairings</h4>
                                            <p className="text-zinc-400 font-light text-sm italic leading-relaxed">
                                                Don't forget to search for "Hand-Forged Cleaver", "Chimichurri", or our new "Drinks" collection to perfectly complement your prime cuts.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
