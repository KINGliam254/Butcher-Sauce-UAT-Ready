"use client";

import { X, ShoppingBag, User, MapPin, CreditCard, Phone, Calendar } from "lucide-react";
import { formatCurrency } from "@/utils/format";

interface OrderDetailsModalProps {
    order: any;
    onClose: () => void;
}

export default function OrderDetailsModal({ order, onClose }: OrderDetailsModalProps) {
    if (!order) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

            <div className="relative w-full max-w-2xl bg-[#0A0A0A] border border-zinc-800 rounded-sm shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-300">
                {/* Header */}
                <div className="p-8 border-b border-zinc-800 flex items-center justify-between bg-zinc-900/50">
                    <div className="space-y-1">
                        <h2 className="text-xl font-serif font-bold text-white tracking-tight">
                            Order <span className="text-gold italic">#{order.id.slice(0, 8).toUpperCase()}</span>
                        </h2>
                        <p className="text-[10px] uppercase tracking-widest font-bold text-zinc-500">Manifest Entry Details</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-zinc-800 rounded-sm text-zinc-500 hover:text-white transition-colors">
                        <X size={20} />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-8 space-y-10 focus:outline-none">
                    {/* Customer Info Grid */}
                    <div className="grid grid-cols-2 gap-8">
                        <div className="space-y-4">
                            <h3 className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold flex items-center gap-2">
                                <User size={12} className="text-gold" /> Customer Informant
                            </h3>
                            <div className="space-y-1">
                                <p className="text-lg font-serif font-bold text-white">{order.customer_name}</p>
                                <p className="text-sm text-zinc-400">{order.email}</p>
                            </div>
                        </div>
                        <div className="space-y-4">
                            <h3 className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold flex items-center gap-2">
                                <Phone size={12} className="text-gold" /> Contact Manifest
                            </h3>
                            <div className="space-y-1">
                                <p className="text-sm text-white">{order.phone || "N/A"}</p>
                                <div className="flex items-center gap-2 text-[10px] text-zinc-500 font-bold uppercase tracking-widest">
                                    <Calendar size={10} /> {new Date(order.created_at).toLocaleDateString()}
                                </div>
                            </div>
                        </div>
                        <div className="col-span-2 space-y-4 pt-4 border-t border-zinc-800/50">
                            <h3 className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold flex items-center gap-2">
                                <MapPin size={12} className="text-gold" /> Delivery Coordinate
                            </h3>
                            <p className="text-sm text-zinc-400 leading-relaxed italic">
                                "{order.address || "Collection from Butcher Shop"}"
                            </p>
                        </div>
                    </div>

                    {/* Order Items */}
                    <div className="space-y-6 pt-6 border-t border-zinc-800/50">
                        <h3 className="text-[10px] uppercase tracking-widest text-white font-bold">Artisanal Selection</h3>
                        <div className="space-y-4">
                            {order.items?.map((item: any, idx: number) => (
                                <div key={idx} className="flex items-center justify-between p-4 bg-zinc-900/30 border border-zinc-800/50 rounded-sm group hover:border-gold/30 transition-colors">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 bg-zinc-900 rounded-sm flex items-center justify-center text-gold font-bold text-xs">
                                            {item.quantity}x
                                        </div>
                                        <div className="space-y-0.5">
                                            <p className="text-sm font-serif font-bold text-white group-hover:text-gold transition-colors">{item.product_name}</p>
                                            <p className="text-[9px] text-zinc-500 uppercase tracking-widest font-bold">Entry ID: {item.product_slug}</p>
                                        </div>
                                    </div>
                                    <p className="font-serif font-bold text-white italic">{formatCurrency(item.price)}</p>
                                </div>
                            ))}
                            {!order.items?.length && (
                                <p className="text-xs text-zinc-600 italic">Historical items list unavailable.</p>
                            )}
                        </div>
                    </div>

                    {/* Financial Summary */}
                    <div className="pt-6 border-t border-zinc-800 space-y-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <CreditCard size={14} className="text-zinc-600" />
                                <span className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold">Payment Strategy</span>
                            </div>
                            <span className="text-[10px] uppercase tracking-widest text-white font-bold bg-zinc-900 px-3 py-1 rounded-full border border-zinc-800">
                                {order.payment_method}
                            </span>
                        </div>
                        <div className="flex items-center justify-between pt-4 border-t border-zinc-800/50">
                            <span className="text-[10px] uppercase tracking-[0.4em] text-gold font-bold">Total Valuation</span>
                            <span className="text-3xl font-serif font-bold text-white italic tracking-tight">
                                {formatCurrency(order.total_amount)}
                            </span>
                        </div>

                        {order.payment_method === 'mpesa' && (
                            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-zinc-800/50">
                                <div className="space-y-1">
                                    <p className="text-[9px] uppercase tracking-widest text-zinc-500 font-bold">M-Pesa Receipt</p>
                                    <p className="text-sm font-mono text-emerald-500 font-bold">{order.mpesa_receipt_number || "Awaiting Verification"}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[9px] uppercase tracking-widest text-zinc-500 font-bold">Checkout ID</p>
                                    <p className="text-[10px] font-mono text-zinc-500 truncate">{order.checkout_request_id || "N/A"}</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Footer/Actions */}
                <div className="p-8 border-t border-zinc-800 bg-zinc-900/20 flex justify-end gap-4">
                    <button
                        onClick={onClose}
                        className="px-8 py-3 bg-zinc-900 border border-zinc-800 rounded-sm text-[10px] uppercase tracking-widest font-bold text-white hover:bg-zinc-800 transition-colors"
                    >
                        Close Dossier
                    </button>
                    <button className="px-8 py-3 bg-gold text-black rounded-sm text-[10px] uppercase tracking-widest font-bold hover:bg-white transition-all shadow-lg shadow-gold/10">
                        Print Manifest
                    </button>
                </div>
            </div>
        </div>
    );
}
