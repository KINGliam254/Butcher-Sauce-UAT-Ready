"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ProductCard from "@/components/ProductCard";

const categories = ["All", "Beef", "Lamb", "Poultry", "Pork", "Signature Reserve", "Mountain Range"];

interface PrimeCutsClientWrapperProps {
    initialProducts: any[];
}

export default function PrimeCutsClientWrapper({ initialProducts }: PrimeCutsClientWrapperProps) {
    const [activeCategory, setActiveCategory] = useState("All");

    const filteredProducts = activeCategory === "All"
        ? initialProducts
        : initialProducts.filter(p => p.category === activeCategory);

    return (
        <div className="bg-white min-h-screen pt-32">
            <section className="section-padding max-w-7xl mx-auto">
                <div className="text-center mb-20">
                    <motion.span
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-gold text-[10px] uppercase tracking-[0.4em] font-bold mb-4 block"
                    >
                        The Collection
                    </motion.span>
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-4xl md:text-6xl font-serif font-bold text-black mb-8"
                    >
                        Prime Cuts <span className="italic font-light text-zinc-400">&</span> Selections
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="text-zinc-500 max-w-2xl mx-auto text-sm md:text-base font-light leading-relaxed"
                    >
                        Sourced from the finest ranches in Kenya and dry-aged to perfection in our custom maturing rooms. Discover the artisanal standard of meat.
                    </motion.p>
                </div>

                {/* Filters */}
                <div className="flex flex-wrap justify-center gap-8 md:gap-12 mb-20 border-b border-black/5 pb-8 overflow-x-auto no-scrollbar">
                    {categories.map((cat, index) => (
                        <button
                            key={cat}
                            onClick={() => setActiveCategory(cat)}
                            className={`text-[10px] uppercase tracking-[0.2em] font-bold transition-all duration-300 relative pb-2 whitespace-nowrap ${activeCategory === cat ? "text-gold" : "text-zinc-400 hover:text-black"
                                }`}
                        >
                            {cat}
                            {activeCategory === cat && (
                                <motion.div
                                    layoutId="activeFilter"
                                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-gold"
                                />
                            )}
                        </button>
                    ))}
                </div>

                {/* Product Grid */}
                <motion.div
                    layout
                    className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-12 md:gap-16"
                >
                    <AnimatePresence mode="popLayout">
                        {filteredProducts.map((product) => (
                            <motion.div
                                key={product.id}
                                layout
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                            >
                                <ProductCard
                                    product={product}
                                />
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </motion.div>
                {!filteredProducts.length && (
                    <p className="text-zinc-400 text-sm font-light text-center py-20">No cuts found in this selection.</p>
                )}
            </section>

            {/* Trust Section */}
            <section className="bg-neutral-soft section-padding border-t border-black/5">
                <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-16 text-center">
                    <div className="space-y-4">
                        <h4 className="font-serif italic text-2xl text-black">Master Butcher Care</h4>
                        <p className="text-zinc-500 text-xs uppercase tracking-widest leading-loose">Hand-cut selections tailored to your exact culinary needs.</p>
                    </div>
                    <div className="space-y-4">
                        <h4 className="font-serif italic text-2xl text-black">Ethical Sourcing</h4>
                        <p className="text-zinc-500 text-xs uppercase tracking-widest leading-loose">Supporting local farmers and sustainable Kenyan ranching.</p>
                    </div>
                    <div className="space-y-4">
                        <h4 className="font-serif italic text-2xl text-black">Chilled Delivery</h4>
                        <p className="text-zinc-500 text-xs uppercase tracking-widest leading-loose">Precision temperature control from our butchery to your door.</p>
                    </div>
                </div>
            </section>
        </div>
    );
}
