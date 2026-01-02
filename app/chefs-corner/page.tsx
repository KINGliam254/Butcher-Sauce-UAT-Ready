"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Header from "@/components/Header";

const recipes = [
    {
        title: "Grilled Ribeye with South African Chimichurri",
        chef: "Chef Liam",
        prep: "15 min",
        cook: "10 min",
        description: "A classic ribeye enhanced with a vibrant, spicy South African twist on traditional green sauce.",
        image: "https://images.unsplash.com/photo-1544025162-d76694265947?ixlib=rb-4.0.3&auto=format&fit=crop&w=2069&q=80"
    },
    {
        title: "Tender Goat Stew with Seasonal Roots",
        chef: "Chef Sarah",
        prep: "20 min",
        cook: "1.5 hrs",
        description: "Slow-cooked to perfection, bringing out the natural tenderness of our mountain-range goat.",
        image: "https://images.unsplash.com/photo-1547050605-2f37a245529a?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
    },
    {
        title: "Master's Peri-Peri Roasted Chicken",
        chef: "Chef Liam",
        prep: "10 min",
        cook: "45 min",
        description: "Using our artisanal marinades to create a smoky, fiery poultry feast.",
        image: "https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
    }
];

export default function ChefsCorner() {
    return (
        <div className="bg-white min-h-screen pt-32 pb-24">
            <Header />
            <div className="max-w-7xl mx-auto px-6 md:px-12">
                <div className="text-center mb-20">
                    <motion.span
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-gold text-[10px] uppercase tracking-[0.4em] font-bold mb-4 block"
                    >
                        Butcher & Sauce Culinary
                    </motion.span>
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-4xl md:text-6xl font-serif font-bold text-black mb-8"
                    >
                        Chef's <span className="italic font-light text-zinc-400">Corner.</span>
                    </motion.h1>
                    <p className="text-zinc-500 max-w-2xl mx-auto text-sm md:text-base font-light leading-relaxed">
                        Master the art of meat preparation with exclusive recipes from our world-class chefs, featuring a unique South African twist on Kenyan classics.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
                    {recipes.map((recipe, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className="group cursor-pointer"
                        >
                            <div className="relative aspect-[16/10] overflow-hidden rounded-sm mb-6 shadow-xl grayscale hover:grayscale-0 transition-all duration-700">
                                <Image
                                    src={recipe.image}
                                    alt={recipe.title}
                                    fill
                                    className="object-cover group-hover:scale-110 transition-transform duration-700 font-serif font-bold tracking-widest text-[10px] uppercase text-gold"
                                />
                                <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-500" />
                            </div>
                            <div className="space-y-4">
                                <div className="flex items-center gap-4 text-[9px] uppercase tracking-widest text-zinc-400 font-bold">
                                    <span>{recipe.chef}</span>
                                    <span className="w-1 h-1 bg-gold rounded-full" />
                                    <span>{recipe.prep} Prep</span>
                                </div>
                                <h2 className="text-2xl font-serif font-bold text-black group-hover:text-gold transition-colors">{recipe.title}</h2>
                                <p className="text-zinc-500 text-sm font-light leading-relaxed">{recipe.description}</p>
                                <button className="text-[10px] uppercase tracking-widest font-bold text-black border-b border-gold pb-1 hover:text-gold transition-colors">
                                    View Recipe
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
}
