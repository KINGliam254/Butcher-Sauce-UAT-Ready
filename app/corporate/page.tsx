"use client";

import { motion } from "framer-motion";
import Header from "@/components/Header";
import { ShieldCheck, Briefcase, Users, Phone } from "lucide-react";

export default function CorporateSales() {
    return (
        <div className="bg-white min-h-screen pt-32 pb-24">
            <Header />
            <div className="max-w-7xl mx-auto px-6 md:px-12">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="space-y-10"
                    >
                        <div className="space-y-4">
                            <span className="text-gold text-[10px] uppercase tracking-[0.4em] font-bold block">B2B & Partnerships</span>
                            <h1 className="text-4xl md:text-7xl font-serif font-bold text-black leading-tight">
                                Corporate <br />
                                <span className="italic font-light text-zinc-400">Solutions.</span>
                            </h1>
                            <p className="text-zinc-500 max-w-xl text-sm md:text-base font-light leading-relaxed">
                                Elevate your restaurant, hotel, or corporate event with the same artisanal standard we provide to our private clients. Custom aging, precision butchery, and bulk sourcing.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                            {[
                                { title: "Restaurant Supply", desc: "Wholesale cuts for high-end dining.", icon: Briefcase },
                                { title: "Corporate Events", desc: "Premium catering and raw supplies.", icon: Users },
                                { title: "Custom Aging", desc: "Exclusive maturation for your brand.", icon: ShieldCheck },
                                { title: "Logistics", desc: "Seamless chilled delivery across Kenya.", icon: Phone }
                            ].map((item, idx) => (
                                <div key={idx} className="space-y-3">
                                    <item.icon size={20} className="text-gold" />
                                    <h3 className="text-[10px] uppercase tracking-widest font-bold text-black">{item.title}</h3>
                                    <p className="text-xs text-zinc-500 font-light leading-relaxed">{item.desc}</p>
                                </div>
                            ))}
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="bg-neutral-soft p-10 md:p-16 rounded-sm shadow-2xl space-y-8 border border-black/5"
                    >
                        <div className="space-y-2">
                            <h2 className="text-3xl font-serif font-bold text-black">Inquire <span className="italic font-light text-zinc-400">Now.</span></h2>
                            <p className="text-zinc-500 text-xs uppercase tracking-widest font-bold">Direct B2B Relationship</p>
                        </div>

                        <form className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold">Company Name</label>
                                    <input className="w-full bg-white border border-black/5 px-4 py-4 rounded-sm focus:outline-none focus:border-gold transition-all" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold">Contact Person</label>
                                    <input className="w-full bg-white border border-black/5 px-4 py-4 rounded-sm focus:outline-none focus:border-gold transition-all" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold">Email Address</label>
                                <input type="email" className="w-full bg-white border border-black/5 px-4 py-4 rounded-sm focus:outline-none focus:border-gold transition-all" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold">Service Required</label>
                                <select className="w-full bg-white border border-black/5 px-4 py-4 rounded-sm focus:outline-none focus:border-gold transition-all appearance-none cursor-pointer">
                                    <option>Wholesale Meat Supply</option>
                                    <option>Event Catering</option>
                                    <option>Partner Pickup Station Inquiry</option>
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold">Message</label>
                                <textarea rows={4} className="w-full bg-white border border-black/5 px-4 py-4 rounded-sm focus:outline-none focus:border-gold transition-all resize-none" />
                            </div>
                            <button className="w-full py-5 bg-black text-white text-[10px] uppercase tracking-widest font-bold hover:bg-gold hover:text-black transition-all duration-500 rounded-sm shadow-xl">
                                Submit Inquiry
                            </button>
                        </form>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
