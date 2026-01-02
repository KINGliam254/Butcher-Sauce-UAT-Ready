"use client";

import { useState } from "react";
import {
    Calendar,
    Search,
    ShoppingBag,
    MoreHorizontal,
    Eye,
    Bell
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import StatusSelect from "@/components/admin/StatusSelect";
import OrderDetailsModal from "@/components/admin/OrderDetailsModal";
import { createClient } from "@/utils/supabase/client";
import { useEffect } from "react";

interface OrdersClientWrapperProps {
    orders: any[];
}

export default function OrdersClientWrapper({ orders: initialOrders }: OrdersClientWrapperProps) {
    const [orders, setOrders] = useState(initialOrders);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedOrder, setSelectedOrder] = useState<any>(null);
    const [newOrderAlert, setNewOrderAlert] = useState<any>(null);

    const supabase = createClient();

    useEffect(() => {
        const channel = supabase
            .channel('schema-db-changes')
            .on(
                'postgres_changes',
                {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'orders'
                },
                (payload) => {
                    console.log('New order received!', payload);
                    const newOrder = payload.new;
                    setOrders(prev => [newOrder, ...prev]);
                    setNewOrderAlert(newOrder);

                    // Simple browser beep simulation or visual focus
                    if (window.Notification && Notification.permission === "granted") {
                        new Notification("New Order Received!", {
                            body: `Order from ${newOrder.customer_name} for Ksh ${newOrder.total_amount}`,
                        });
                    }
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [supabase]);

    const filteredOrders = orders.filter(o =>
        o.customer_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        o.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        o.id?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="space-y-10">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-2">
                    <h2 className="text-4xl font-serif font-bold text-white tracking-tight">Order <span className="text-zinc-700 italic">Manifest.</span></h2>
                    <p className="text-zinc-500 text-sm font-light">Manage and track your artisanal deliveries.</p>
                </div>

                <AnimatePresence>
                    {newOrderAlert && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 10 }}
                            className="fixed top-10 right-10 z-[1000] bg-gold text-black p-6 rounded-sm shadow-2xl flex items-center gap-6 min-w-[320px]"
                        >
                            <div className="bg-black text-gold p-3 rounded-full">
                                <Bell size={24} className="animate-bounce" />
                            </div>
                            <div className="flex-1">
                                <p className="text-[10px] uppercase tracking-widest font-black mb-1">Incoming Selection</p>
                                <p className="text-sm font-serif font-bold">{newOrderAlert.customer_name}</p>
                                <p className="text-[10px] font-bold mt-1">Ref: #{newOrderAlert.id.slice(0, 8).toUpperCase()}</p>
                            </div>
                            <button
                                onClick={() => setNewOrderAlert(null)}
                                className="text-[10px] uppercase tracking-widest font-black border-b border-black hover:border-transparent transition-all"
                            >
                                Dismiss
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>

                <div className="flex items-center gap-4">
                    <div className="relative">
                        <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600" />
                        <input
                            type="text"
                            placeholder="Search orders..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="bg-zinc-900 border border-zinc-800 pl-12 pr-6 py-3 rounded-sm focus:outline-none focus:border-gold/50 text-xs text-white min-w-[300px] transition-all"
                        />
                    </div>
                </div>
            </div>

            <div className="bg-zinc-900/30 border border-zinc-800/50 rounded-sm overflow-hidden backdrop-blur-sm">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b border-zinc-800/50 text-[10px] uppercase tracking-[0.2em] font-bold text-zinc-500 bg-zinc-900/50">
                            <th className="px-8 py-6">ID</th>
                            <th className="px-8 py-6">Customer</th>
                            <th className="px-8 py-6">Status</th>
                            <th className="px-8 py-6">Total</th>
                            <th className="px-8 py-6">Date</th>
                            <th className="px-8 py-6 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-800/30">
                        {filteredOrders.map((order) => (
                            <tr key={order.id} className="hover:bg-zinc-800/20 transition-colors group">
                                <td className="px-8 py-6 font-mono text-[10px] text-zinc-500">
                                    #{order.id.slice(0, 8).toUpperCase()}
                                </td>
                                <td className="px-8 py-6">
                                    <div className="flex flex-col gap-0.5">
                                        <span className="text-sm font-serif font-bold text-white tracking-wide group-hover:text-gold transition-colors">{order.customer_name}</span>
                                        <span className="text-[10px] text-zinc-500 uppercase tracking-widest">{order.email}</span>
                                    </div>
                                </td>
                                <td className="px-8 py-6">
                                    <StatusSelect orderId={order.id} initialStatus={order.status} />
                                </td>
                                <td className="px-8 py-6 font-serif font-bold text-white italic">
                                    Ksh {Number(order.total_amount).toLocaleString()}
                                </td>
                                <td className="px-8 py-6">
                                    <div className="flex items-center gap-2 text-[10px] text-zinc-500 uppercase tracking-widest font-bold">
                                        <Calendar size={12} className="text-zinc-600" />
                                        {new Date(order.created_at).toLocaleDateString()}
                                    </div>
                                </td>
                                <td className="px-8 py-6 text-right">
                                    <button
                                        onClick={() => setSelectedOrder(order)}
                                        className="p-2 hover:bg-zinc-900 rounded-sm transition-colors text-zinc-600 hover:text-gold flex items-center justify-center gap-2"
                                    >
                                        <Eye size={18} />
                                        <span className="text-[10px] uppercase tracking-widest font-bold hidden group-hover:block">Dossier</span>
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {!filteredOrders.length && (
                    <div className="py-20 text-center space-y-4">
                        <ShoppingBag size={48} className="mx-auto text-zinc-800" />
                        <p className="text-zinc-500 text-sm font-light italic">The manifest reflects no entries matching your search.</p>
                    </div>
                )}
            </div>

            {selectedOrder && (
                <OrderDetailsModal
                    order={selectedOrder}
                    onClose={() => setSelectedOrder(null)}
                />
            )}
        </div>
    );
}
