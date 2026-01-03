"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Minus, Plus, ShoppingBag, ArrowLeft, ShieldCheck, Truck, Star } from "lucide-react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { formatCurrency } from "@/utils/format";

export default function ProductDetailClient({ product }: { product: any }) {
    const [quantity, setQuantity] = useState(1);
    const [preparation, setPreparation] = useState("Raw");
    const [doneness, setDoneness] = useState("Medium");
    const { addItem } = useCart();

    const prepOptions = ["Raw", "Nyama Choma"];
    const donenessLevels = ["Rare", "Medium Rare", "Medium", "Medium Well", "Well Done"];

    const handleAddToBag = () => {
        // Defensive price extraction
        const parsedFromDisplay = parseInt(product.price_display?.replace(/[^\d]/g, '') || '0');
        const dbNumericPrice = Number(product.numeric_price) || 0;
        const dbSalePrice = Number(product.sale_price) || 0;

        const finalNumericPrice = product.is_on_sale
            ? (dbSalePrice || parsedFromDisplay)
            : (dbNumericPrice >= (parsedFromDisplay * 0.1) ? dbNumericPrice : parsedFromDisplay);

        const currentPriceLabel = product.is_on_sale
            ? formatCurrency(product.sale_price)
            : formatCurrency(product.price_display);

        addItem({
            slug: product.slug,
            name: product.name,
            price: currentPriceLabel,
            numericPrice: finalNumericPrice,
            category: product.category,
            image: product.image_url,
            quantity: quantity,
            preparation: product.has_prep_options ? preparation : undefined,
            doneness: (preparation === "Nyama Choma") ? doneness : undefined
        });
    };

    return (
        <div className="bg-white min-h-screen pt-32 pb-24">
            <div className="max-w-7xl mx-auto px-6 md:px-12">
                {/* Breadcrumbs / Back */}
                <Link
                    href="/prime-cuts"
                    className="inline-flex items-center gap-2 text-[10px] uppercase tracking-widest text-zinc-400 hover:text-black transition-colors mb-12 group"
                >
                    <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
                    Back to Collection
                </Link>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
                    {/* Image Section */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="relative aspect-square md:aspect-[4/5] overflow-hidden bg-neutral-soft rounded-sm shadow-2xl"
                    >
                        <div
                            className="absolute inset-0 bg-cover bg-center"
                            style={{ backgroundImage: `url(${product.image_url})` }}
                        />
                    </motion.div>

                    {/* Info Section */}
                    <div className="flex flex-col justify-center space-y-10">
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="space-y-4"
                        >
                            <span className="text-ruby text-[10px] uppercase tracking-[0.4em] font-bold">{product.category}</span>
                            <h1 className="text-4xl md:text-6xl font-serif font-bold text-black leading-tight">{product.name}</h1>

                            <div className="flex items-center gap-6">
                                {product.is_on_sale ? (
                                    <>
                                        <p className="text-3xl md:text-4xl font-serif text-black font-bold">{formatCurrency(product.sale_price)}</p>
                                        <p className="text-lg md:text-xl font-serif text-zinc-300 italic line-through decoration-ruby/30">{formatCurrency(product.price_display)}</p>
                                        <span className="bg-ruby text-black text-[9px] font-bold px-3 py-1 uppercase tracking-widest">Limited Offer</span>
                                    </>
                                ) : (
                                    <p className="text-2xl font-serif text-zinc-400 italic">{formatCurrency(product.price_display)}</p>
                                )}
                            </div>
                        </motion.div>

                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.2 }}
                            className="text-zinc-600 font-light leading-relaxed text-lg"
                        >
                            {product.description || "No description provided for this artisanal selection."}
                        </motion.p>

                        {/* Artisanal Selections */}
                        {product.has_prep_options && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.3 }}
                                className="space-y-10 py-10 border-y border-black/5"
                            >
                                {/* Preparation Toggle */}
                                <div className="space-y-4">
                                    <p className="text-[10px] uppercase tracking-widest text-zinc-400 font-bold">Artisanal Preparation</p>
                                    <div className="flex gap-4">
                                        {prepOptions.map((option) => (
                                            <button
                                                key={option}
                                                onClick={() => setPreparation(option)}
                                                className={`px-6 py-3 text-[10px] uppercase tracking-widest font-bold transition-all duration-300 rounded-sm border ${preparation === option
                                                    ? "bg-black text-white border-black"
                                                    : "bg-transparent text-zinc-400 border-black/10 hover:border-black/30"
                                                    }`}
                                            >
                                                {option}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Doneness Selection - Only for Nyama Choma */}
                                <AnimatePresence mode="wait">
                                    {preparation === "Nyama Choma" && (
                                        <motion.div
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: "auto" }}
                                            exit={{ opacity: 0, height: 0 }}
                                            className="space-y-4 overflow-hidden"
                                        >
                                            <p className="text-[10px] uppercase tracking-widest text-zinc-400 font-bold">Select Doneness</p>
                                            <div className="flex flex-wrap gap-3">
                                                {donenessLevels.map((level) => (
                                                    <button
                                                        key={level}
                                                        onClick={() => setDoneness(level)}
                                                        className={`px-4 py-2 text-[10px] uppercase tracking-widest font-bold transition-all duration-300 rounded-sm border ${doneness === level
                                                            ? "bg-ruby text-black border-ruby"
                                                            : "bg-transparent text-zinc-400 border-black/10 hover:border-black/30"
                                                            }`}
                                                    >
                                                        {level}
                                                    </button>
                                                ))}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                {/* Spec Grid */}
                                <div className="grid grid-cols-2 gap-x-12 gap-y-8 pt-4">
                                    {Object.entries(product.specs).map(([key, value]) => (
                                        <div key={key}>
                                            <p className="text-[10px] uppercase tracking-widest text-zinc-400 font-bold mb-1">{key}</p>
                                            <p className="text-black font-serif italic text-lg">{value as string}</p>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        )}

                        {!product.has_prep_options && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.3 }}
                                className="grid grid-cols-2 gap-x-12 gap-y-8 py-10 border-y border-black/5"
                            >
                                {Object.entries(product.specs || {}).map(([key, value]) => (
                                    <div key={key}>
                                        <p className="text-[10px] uppercase tracking-widest text-zinc-400 font-bold mb-1">{key}</p>
                                        <p className="text-black font-serif italic text-lg">{value as string}</p>
                                    </div>
                                ))}
                            </motion.div>
                        )}

                        {/* Controls */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                            className="flex flex-col sm:flex-row items-center gap-8"
                        >
                            <div className="flex items-center border border-black/10 rounded-sm">
                                <button
                                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                    className="p-4 hover:bg-neutral-soft transition-colors"
                                >
                                    <Minus size={16} />
                                </button>
                                <span className="w-12 text-center font-bold text-sm">{quantity}</span>
                                <button
                                    onClick={() => setQuantity(quantity + 1)}
                                    className="p-4 hover:bg-neutral-soft transition-colors"
                                >
                                    <Plus size={16} />
                                </button>
                            </div>

                            <button
                                onClick={handleAddToBag}
                                className="flex-1 w-full sm:w-auto px-10 py-5 bg-black text-white uppercase text-[10px] tracking-widest font-bold hover:bg-ruby hover:text-black transition-all duration-500 rounded-sm shadow-xl flex items-center justify-center gap-3 group"
                            >
                                <ShoppingBag size={14} className="group-hover:-translate-y-1 transition-transform" />
                                Add to Butcher's Bag
                            </button>
                        </motion.div>

                        {/* Guarantees */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.5 }}
                            className="flex flex-wrap gap-8 pt-4"
                        >
                            <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-zinc-400 font-bold">
                                <Truck size={14} className="text-ruby" />
                                Same day delivery
                            </div>
                            <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-zinc-400 font-bold">
                                <ShieldCheck size={14} className="text-ruby" />
                                Ethical Sourcing
                            </div>
                            <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-zinc-400 font-bold">
                                <Star size={14} className="text-ruby" />
                                Premium Grade
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    );
}
