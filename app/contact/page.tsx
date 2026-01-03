"use client";

import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Clock, Send, Instagram } from "lucide-react";

export default function ContactPage() {
    return (
        <div className="bg-white min-h-screen pt-56 pb-24">
            <div className="max-w-7xl mx-auto px-6 md:px-12">
                <div className="text-center mb-20">
                    <motion.span
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-ruby text-[10px] uppercase tracking-[0.4em] font-bold mb-4 block"
                    >
                        Connect With Us
                    </motion.span>
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-4xl md:text-6xl font-serif font-bold text-black mb-8"
                    >
                        Orders <span className="italic font-light text-zinc-400">&</span> Consultations
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="text-zinc-500 max-w-2xl mx-auto text-sm md:text-base font-light leading-relaxed"
                    >
                        Whether you're looking for a specific cut for a special occasion or interested in our wholesale selections, our master butchers are here to assist.
                    </motion.p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-24">
                    {/* Contact Details */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="space-y-16"
                    >
                        <div className="space-y-8">
                            <h2 className="text-3xl font-serif font-bold text-black">The Butchery HQ</h2>
                            <div className="space-y-6">
                                <div className="flex items-start gap-6 group">
                                    <div className="w-12 h-12 rounded-sm bg-neutral-soft flex items-center justify-center transition-colors group-hover:bg-ruby/10">
                                        <MapPin className="text-ruby" size={20} />
                                    </div>
                                    <div>
                                        <p className="text-[10px] uppercase tracking-widest text-zinc-400 font-bold mb-1">Visit Us</p>
                                        <p className="text-black font-serif italic text-lg">Evergreen Square, Kiambu Road</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-6 group">
                                    <div className="w-12 h-12 rounded-sm bg-neutral-soft flex items-center justify-center transition-colors group-hover:bg-ruby/10">
                                        <Phone className="text-ruby" size={20} />
                                    </div>
                                    <div>
                                        <p className="text-[10px] uppercase tracking-widest text-zinc-400 font-bold mb-1">Direct Line</p>
                                        <p className="text-black font-serif italic text-lg">+254 795 999 555</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-6 group">
                                    <div className="w-12 h-12 rounded-sm bg-neutral-soft flex items-center justify-center transition-colors group-hover:bg-ruby/10">
                                        <Mail className="text-ruby" size={20} />
                                    </div>
                                    <div>
                                        <p className="text-[10px] uppercase tracking-widest text-zinc-400 font-bold mb-1">Reservations</p>
                                        <p className="text-black font-serif italic text-lg">concierge@butcherandsauce.co.ke</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-8 pt-12 border-t border-black/5">
                            <h3 className="text-2xl font-serif font-bold text-black">Operational Hours</h3>
                            <div>
                                <p className="text-[10px] uppercase tracking-widest text-zinc-400 font-bold mb-1">Everyday</p>
                                <p className="text-black font-serif italic text-lg">08:00 — 20:00</p>
                            </div>
                        </div>

                        <div className="flex gap-8 pt-8">
                            <a href="https://www.instagram.com/butcherandsauce?igsh=NTc4MTIwNjQ2YQ==" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full border border-black/5 flex items-center justify-center text-zinc-400 hover:text-ruby hover:border-ruby transition-all duration-300">
                                <Instagram size={18} />
                            </a>
                        </div>
                    </motion.div>

                    {/* Contact Form */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="bg-neutral-soft p-12 lg:p-16 rounded-sm shadow-premium"
                    >
                        <form className="space-y-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-2">
                                    <label className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold">Full Name</label>
                                    <input
                                        type="text"
                                        className="w-full bg-white border border-black/5 px-4 py-4 rounded-sm focus:outline-none focus:border-ruby transition-colors font-serif"
                                        placeholder="E.g. Adrian Saitoti"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold">Email Address</label>
                                    <input
                                        type="email"
                                        className="w-full bg-white border border-black/5 px-4 py-4 rounded-sm focus:outline-none focus:border-ruby transition-colors font-serif"
                                        placeholder="concierge@example.com"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold">Subject of Inquiry</label>
                                <select className="w-full bg-white border border-black/5 px-4 py-4 rounded-sm focus:outline-none focus:border-ruby transition-colors font-serif appearance-none">
                                    <option>Personal Order</option>
                                    <option>Special Occasion / Catering</option>
                                    <option>Wholesale Inquiry</option>
                                    <option>Butcher Consultation</option>
                                </select>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold">Message</label>
                                <textarea
                                    rows={6}
                                    className="w-full bg-white border border-black/5 px-4 py-4 rounded-sm focus:outline-none focus:border-ruby transition-colors font-serif resize-none"
                                    placeholder="Tell us about your requirements..."
                                />
                            </div>

                            <button className="w-full py-6 bg-black text-white uppercase text-[10px] tracking-widest font-bold hover:bg-ruby hover:text-black transition-all duration-500 rounded-sm shadow-xl flex items-center justify-center gap-3">
                                <Send size={14} />
                                Send Inquiry
                            </button>
                        </form>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
