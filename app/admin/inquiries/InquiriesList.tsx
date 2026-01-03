"use client";

import { motion } from "framer-motion";
import { Mail, Building, User, Info, MessageSquare, Calendar } from "lucide-react";

interface Inquiry {
    id: string;
    created_at: string;
    company_name: string;
    contact_person: string;
    email: string;
    service_required: string;
    message: string;
}

export default function InquiriesList({ inquiries }: { inquiries: Inquiry[] }) {
    return (
        <div className="space-y-8">
            <div className="flex items-end justify-between">
                <div className="space-y-2">
                    <h2 className="text-4xl font-serif font-bold text-white tracking-tight">Corporate <span className="text-zinc-700 italic">Inquiries.</span></h2>
                    <p className="text-zinc-500 text-sm font-light">Manage and respond to B2B partnership requests.</p>
                </div>
                <div className="bg-zinc-900 border border-zinc-800 px-4 py-2 rounded-sm text-[10px] uppercase tracking-widest font-bold text-zinc-400">
                    {inquiries.length} Total Requests
                </div>
            </div>

            <div className="bg-zinc-900/50 border border-zinc-800/50 rounded-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-zinc-800/50 bg-black/20">
                                <th className="px-6 py-4 text-[10px] uppercase tracking-widest font-bold text-zinc-500">Date</th>
                                <th className="px-6 py-4 text-[10px] uppercase tracking-widest font-bold text-zinc-500">Company / Contact</th>
                                <th className="px-6 py-4 text-[10px] uppercase tracking-widest font-bold text-zinc-500">Service</th>
                                <th className="px-6 py-4 text-[10px] uppercase tracking-widest font-bold text-zinc-500">Message</th>
                                <th className="px-6 py-4 text-[10px] uppercase tracking-widest font-bold text-zinc-500 text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-800/30">
                            {inquiries.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-20 text-center text-zinc-600 italic text-sm">
                                        No corporate inquiries found.
                                    </td>
                                </tr>
                            ) : (
                                inquiries.map((inquiry, idx) => (
                                    <motion.tr
                                        key={inquiry.id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: idx * 0.05 }}
                                        className="group hover:bg-zinc-800/20 transition-colors"
                                    >
                                        <td className="px-6 py-6 align-top">
                                            <div className="flex flex-col gap-1">
                                                <span className="text-xs text-white font-medium">
                                                    {new Date(inquiry.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                                </span>
                                                <span className="text-[10px] text-zinc-500 uppercase tracking-widest">
                                                    {new Date(inquiry.created_at).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-6 align-top">
                                            <div className="space-y-1">
                                                <div className="flex items-center gap-2 text-sm text-white font-medium">
                                                    <Building size={14} className="text-gold/50" />
                                                    {inquiry.company_name}
                                                </div>
                                                <div className="flex items-center gap-2 text-xs text-zinc-400">
                                                    <User size={14} className="text-zinc-600" />
                                                    {inquiry.contact_person}
                                                </div>
                                                <div className="flex items-center gap-2 text-xs text-zinc-500 underline decoration-zinc-800 hover:text-gold transition-colors">
                                                    <Mail size={14} className="text-zinc-600" />
                                                    <a href={`mailto:${inquiry.email}`}>{inquiry.email}</a>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-6 align-top">
                                            <span className="inline-block px-2 py-1 bg-zinc-800 border border-zinc-700 text-[9px] uppercase tracking-widest font-bold text-zinc-400 rounded-sm">
                                                {inquiry.service_required}
                                            </span>
                                        </td>
                                        <td className="px-6 py-6 align-top max-w-md">
                                            <p className="text-xs text-zinc-400 leading-relaxed line-clamp-3 group-hover:line-clamp-none transition-all duration-500 cursor-help">
                                                {inquiry.message}
                                            </p>
                                        </td>
                                        <td className="px-6 py-6 align-top text-right">
                                            <button
                                                onClick={() => window.open(`mailto:${inquiry.email}?subject=Inquiry Response - Butcher & Sauce`)}
                                                className="px-4 py-2 bg-zinc-800 hover:bg-gold text-zinc-400 hover:text-black text-[9px] uppercase tracking-widest font-bold rounded-sm transition-all"
                                            >
                                                Reply
                                            </button>
                                        </td>
                                    </motion.tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
