"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, ShieldCheck, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";

export default function AdminLoginPage() {
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        try {
            const response = await fetch("/api/admin/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ password }),
            });

            const data = await response.json();

            if (data.success) {
                window.location.href = "/admin";
            } else {
                setError("Invalid master credentials.");
            }
        } catch (err) {
            setError("Connectivity issue. Try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center p-6 font-sans">
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-ruby/5 blur-[120px] rounded-full" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-ruby/5 blur-[120px] rounded-full" />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md relative z-10"
            >
                <div className="text-center mb-12 space-y-4">
                    <div className="w-16 h-16 bg-zinc-900 border border-ruby/20 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Lock className="text-ruby" size={24} />
                    </div>
                    <h1 className="text-3xl font-serif font-bold text-white tracking-widest uppercase">
                        Admin <span className="text-ruby">Portal.</span>
                    </h1>
                    <p className="text-zinc-500 text-[10px] uppercase tracking-[0.4em] font-bold">Secure Access Required</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <div className="relative">
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Master Password"
                                className="w-full bg-zinc-900/50 border border-zinc-800 px-6 py-5 rounded-sm text-white focus:outline-none focus:border-ruby transition-all font-serif placeholder:text-zinc-700 placeholder:italic"
                                required
                            />
                        </div>
                        {error && (
                            <motion.p
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="text-red-500 text-[10px] uppercase tracking-widest font-bold text-center mt-2"
                            >
                                {error}
                            </motion.p>
                        )}
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full py-5 bg-ruby text-black uppercase text-[10px] tracking-[0.2em] font-black hover:bg-white transition-all duration-500 rounded-sm shadow-xl flex items-center justify-center gap-3 group disabled:opacity-50"
                    >
                        {isLoading ? "Verifying..." : (
                            <>
                                Authenticate
                                <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                            </>
                        )}
                    </button>
                </form>

                <div className="mt-12 pt-8 border-t border-zinc-800/30 flex items-center justify-center gap-3">
                    <ShieldCheck size={14} className="text-zinc-600" />
                    <span className="text-[8px] uppercase tracking-widest text-zinc-600 font-bold">End-to-End Encrypted Session</span>
                </div>
            </motion.div>
        </div>
    );
}
