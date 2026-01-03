"use client";

import { motion } from "framer-motion";
import { ShieldCheck, Briefcase, Users, Phone, Award, Sparkles, Globe, TrendingUp } from "lucide-react";

export default function CorporateSales() {
    return (
        <div className="bg-white min-h-screen pt-32 pb-24">
            <div className="max-w-7xl mx-auto px-6 md:px-12">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="space-y-10"
                    >
                        <div className="space-y-4">
                            <span className="text-ruby text-[10px] uppercase tracking-[0.4em] font-bold block">B2B & Partnerships</span>
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
                                    <item.icon size={20} className="text-ruby" />
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
                                    <input className="w-full bg-white border border-black/5 px-4 py-4 rounded-sm focus:outline-none focus:border-ruby transition-all" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold">Contact Person</label>
                                    <input className="w-full bg-white border border-black/5 px-4 py-4 rounded-sm focus:outline-none focus:border-ruby transition-all" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold">Email Address</label>
                                <input type="email" className="w-full bg-white border border-black/5 px-4 py-4 rounded-sm focus:outline-none focus:border-ruby transition-all" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold">Service Required</label>
                                <select className="w-full bg-white border border-black/5 px-4 py-4 rounded-sm focus:outline-none focus:border-ruby transition-all appearance-none cursor-pointer">
                                    <option>Wholesale Meat Supply</option>
                                    <option>Event Catering</option>
                                    <option>Partner Pickup Station Inquiry</option>
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold">Message</label>
                                <textarea rows={4} className="w-full bg-white border border-black/5 px-4 py-4 rounded-sm focus:outline-none focus:border-ruby transition-all resize-none" />
                            </div>
                            <button className="w-full py-5 bg-black text-white text-[10px] uppercase tracking-widest font-bold hover:bg-ruby hover:text-black transition-all duration-500 rounded-sm shadow-xl">
                                Submit Inquiry
                            </button>
                        </form>
                    </motion.div>
                </div>

                {/* --- New Solution Section --- */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mt-32 pt-24 border-t border-black/5 space-y-20"
                >
                    <div className="text-center space-y-4">
                        <span className="text-ruby text-[10px] uppercase tracking-[0.4em] font-bold">The Blueprint</span>
                        <h2 className="text-3xl md:text-5xl font-serif font-bold text-black">
                            Our <span className="italic font-light text-zinc-400">Solution.</span>
                        </h2>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 lg:px-12">
                        {[
                            { label: "Quality", icon: Award, desc: "Prime Standards" },
                            { label: "Compliment", icon: Sparkles, desc: "Culinary Synergy" },
                            { label: "Online", icon: Globe, desc: "Digital Ease" },
                            { label: "Traffic", icon: TrendingUp, desc: "Growth Velocity" }
                        ].map((item, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, scale: 0.8 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.1 }}
                                className="flex flex-col items-center group cursor-default"
                            >
                                <div className="w-24 h-24 md:w-32 md:h-32 rounded-full border border-black/5 flex items-center justify-center bg-neutral-soft group-hover:bg-black group-hover:border-black transition-all duration-700 relative overflow-hidden">
                                    <div className="absolute inset-0 bg-ruby/0 group-hover:bg-ruby/10 transition-colors duration-700" />
                                    <item.icon size={32} className="text-ruby group-hover:scale-110 transition-transform duration-500" />
                                </div>
                                <div className="text-center mt-6 space-y-1">
                                    <h3 className="text-[10px] md:text-[11px] uppercase tracking-[0.3em] font-bold text-black">{item.label}</h3>
                                    <p className="text-[9px] text-zinc-400 font-light italic uppercase tracking-widest">{item.desc}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
