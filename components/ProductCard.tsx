"use client";

import { motion } from "framer-motion";
import { Plus } from "lucide-react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";

interface ProductCardProps {
    slug: string;
    name: string;
    price: string;
    numericPrice?: number;
    category: string;
    image: string;
}

export default function ProductCard({
    product,
    // Keep backward compatibility for props if needed, but prefer passing the whole product
    slug: propSlug,
    name: propName,
    price: propPrice,
    numericPrice: propNumericPrice,
    category: propCategory,
    image: propImage
}: any) {
    const { addItem } = useCart();

    // Use product object if available, otherwise fallback to props
    const slug = product?.slug || propSlug;
    const name = product?.name || propName;
    const priceDisplay = product?.price_display || propPrice;
    const image = product?.image_url || propImage;
    const category = product?.category || propCategory;
    const isOnSale = product?.is_on_sale;
    const salePrice = product?.sale_price;

    const handleQuickAdd = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        // Defensive: Extract digits from display string as a safety fallback
        const parsedFromDisplay = parseInt(priceDisplay?.replace(/[^\d]/g, '') || '0');
        const dbNumericPrice = product?.numeric_price ? Number(product.numeric_price) : 0;
        const dbSalePrice = salePrice ? Number(salePrice) : 0;

        let finalNumericPrice = 0;
        if (isOnSale && dbSalePrice > 0) {
            finalNumericPrice = dbSalePrice;
        } else {
            // Defensive: If DB price is suspiciously low compared to display (e.g. 5 vs 399), trust the display string
            finalNumericPrice = (dbNumericPrice > 0 && dbNumericPrice >= parsedFromDisplay * 0.1)
                ? dbNumericPrice
                : (parsedFromDisplay || dbNumericPrice);
        }

        addItem({
            slug,
            name,
            price: isOnSale ? `Ksh ${Number(salePrice).toLocaleString()}` : priceDisplay,
            numericPrice: finalNumericPrice,
            category,
            image,
            quantity: 1
        });
    };

    return (
        <Link href={`/prime-cuts/${slug}`}>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="group cursor-pointer"
            >
                <div className="relative aspect-[4/5] overflow-hidden bg-neutral-soft rounded-sm mb-6 shadow-sm group-hover:shadow-xl transition-shadow duration-500">
                    <div
                        className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                        style={{ backgroundImage: `url(${image})` }}
                    />
                    <div className="absolute inset-0 bg-black/5 group-hover:bg-black/10 transition-colors duration-500" />

                    {/* Sale Badge */}
                    {isOnSale && (
                        <div className="absolute top-4 left-4 z-10">
                            <span className="bg-ruby text-black text-[9px] font-bold px-3 py-1.5 uppercase tracking-widest shadow-xl">Sale</span>
                        </div>
                    )}

                    {/* Quick Add Button Decorative */}
                    <button
                        onClick={handleQuickAdd}
                        className="absolute bottom-3 right-3 sm:bottom-4 sm:right-4 w-10 h-10 sm:w-12 sm:h-12 bg-black text-white flex items-center justify-center opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 shadow-xl z-20 hover:bg-ruby hover:text-black"
                    >
                        <Plus size={18} className="sm:hidden" />
                        <Plus size={20} className="hidden sm:block" />
                    </button>
                </div>

                <div className="space-y-1 sm:space-y-1.5 px-1">
                    <span className="text-[9px] sm:text-[10px] uppercase tracking-widest text-ruby font-bold">{category}</span>
                    <h3 className="text-base sm:text-lg font-serif font-bold text-black group-hover:text-ruby transition-colors line-clamp-1">{name}</h3>
                    <div className="flex items-center gap-3">
                        {isOnSale ? (
                            <>
                                <p className="text-ruby text-xs sm:text-sm font-bold">Ksh {salePrice?.toLocaleString()}</p>
                                <p className="text-zinc-400 text-[10px] sm:text-xs line-through opacity-70">{priceDisplay}</p>
                            </>
                        ) : (
                            <p className="text-zinc-500 text-xs sm:text-sm font-medium">{priceDisplay}</p>
                        )}
                    </div>
                </div>
            </motion.div>
        </Link>
    );
}
