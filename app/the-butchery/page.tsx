"use client";

import { motion } from "framer-motion";
import { ShieldCheck, Snowflake, MapPin, Users } from "lucide-react";

export default function TheButcheryPage() {
    return (
        <div className="bg-white min-h-screen">
            {/* Immersive Hero Header */}
            <section className="relative h-[80vh] flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 z-0 bg-black">
                    <div
                        className="absolute inset-0 bg-cover bg-center opacity-60 scale-105"
                        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1558030006-450675393462?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80')" }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-white" />
                </div>

                <div className="relative z-10 text-center space-y-6 max-w-4xl px-6">
                    <motion.span
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-ruby text-[10px] uppercase tracking-[0.5em] font-bold block"
                    >
                        Established Tradition
                    </motion.span>
                    <motion.h1
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
                        className="text-5xl md:text-8xl font-serif font-bold text-white leading-tight"
                    >
                        Our Vision, <br />
                        <span className="italic font-light">The Master's Standard.</span>
                    </motion.h1>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                        className="w-px h-24 bg-ruby mx-auto mt-12"
                    />
                </div>
            </section>

            {/* Philosophy Section */}
            <section className="section-padding max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
                <div className="space-y-8">
                    <span className="text-ruby text-[10px] uppercase tracking-[0.4em] font-bold block">Our Philosophy</span>
                    <h2 className="text-4xl md:text-6xl font-serif font-bold text-black leading-tight">
                        Honoring the <br />
                        <span className="italic font-light text-zinc-400 font-serif">Original Standard.</span>
                    </h2>
                    <div className="w-20 h-0.5 bg-black/5" />
                    <p className="text-zinc-600 text-lg font-light leading-relaxed">
                        In an era of mass production, Butcher & Sauce stands as a fortress of tradition. We return to the fundamental truth of meat: that quality is a slow, deliberate process that cannot be rushed.
                    </p>
                    <p className="text-zinc-500 text-base font-light italic leading-relaxed border-l-2 border-ruby pl-6">
                        "We don't just sell meat; we preserve a craftsmanship that has been handed down through generations of Kenyan masters."
                    </p>
                </div>
                <div className="relative aspect-square md:aspect-[4/5] overflow-hidden rounded-sm shadow-2xl">
                    <div
                        className="absolute inset-0 bg-cover bg-center opacity-90"
                        style={{ backgroundImage: "url('/philosophy-standard.jpg')" }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-tr from-white/20 to-transparent" />
                </div>
            </section>

            {/* The Salt Room Spotlight */}
            <section className="bg-neutral-soft section-padding relative overflow-hidden">
                <div className="max-w-7xl mx-auto flex flex-col items-center text-center space-y-12">
                    <div className="w-20 h-20 bg-white rounded-full shadow-premium flex items-center justify-center mb-8">
                        <Snowflake className="text-ruby" size={32} />
                    </div>
                    <span className="text-ruby text-[10px] uppercase tracking-[0.4em] font-bold block">The Butcher's Spot</span>
                    <h2 className="text-4xl md:text-7xl font-serif font-bold text-black leading-tight max-w-4xl">
                        Inside Our <span className="italic font-light text-zinc-400">Salt-Maturity Room.</span>
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-16 pt-20">
                        <div className="space-y-6">
                            <h4 className="font-serif text-2xl italic">Himalayan Bricks</h4>
                            <p className="text-zinc-500 text-xs uppercase tracking-widest leading-loose">Walls lined with hand-carved pink salt to purify the microclimate.</p>
                        </div>
                        <div className="space-y-6 border-x border-black/5 px-8">
                            <h4 className="font-serif text-2xl italic">Humidity Control</h4>
                            <p className="text-zinc-500 text-xs uppercase tracking-widest leading-loose">Precision engineering at 82% hydration to ensure tender aging.</p>
                        </div>
                        <div className="space-y-6">
                            <h4 className="font-serif text-2xl italic">Time & Patience</h4>
                            <p className="text-zinc-500 text-xs uppercase tracking-widest leading-loose">Minimum 28-day cycle for every featured reserve selection.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Ethical Ranching Section */}
            <section className="section-padding">
                <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
                    <div className="relative aspect-video lg:aspect-square overflow-hidden rounded-sm shadow-2xl order-2 lg:order-1">
                        <div
                            className="absolute inset-0 bg-cover bg-center opacity-80"
                            style={{ backgroundImage: "url('https://images.unsplash.com/photo-1500382017468-9049fed747ef?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80')" }}
                        />
                        <div className="absolute inset-0 bg-black/10" />
                    </div>
                    <div className="space-y-8 order-1 lg:order-2">
                        <span className="text-ruby text-[10px] uppercase tracking-[0.4em] font-bold block">The Source</span>
                        <h2 className="text-4xl md:text-6xl font-serif font-bold text-black leading-tight">
                            Respect for <br />
                            <span className="italic font-light text-zinc-400 font-serif">the Land.</span>
                        </h2>
                        <p className="text-zinc-600 text-lg font-light leading-relaxed">
                            We only partner with ranches that share our commitment to regenerative agriculture. From the Rift Valley to the foothills of Mount Kenya, our livestock roam freely on natural grass, living as nature intended.
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 pt-6">
                            <div className="flex items-start gap-4">
                                <MapPin className="text-ruby shrink-0" size={20} />
                                <p className="text-xs uppercase tracking-widest text-zinc-500 font-bold">Traceable to the individual ranch</p>
                            </div>
                            <div className="flex items-start gap-4">
                                <ShieldCheck className="text-ruby shrink-0" size={20} />
                                <p className="text-xs uppercase tracking-widest text-zinc-500 font-bold">100% Hormone & antibiotic-free</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

        </div>
    );
}
