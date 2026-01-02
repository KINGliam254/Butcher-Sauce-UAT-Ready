import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import {
    TrendingUp,
    ShoppingBag,
    DollarSign,
    ArrowUpRight,
    ArrowDownRight,
    Clock
} from "lucide-react";

export default async function AdminDashboard() {
    const cookieStore = cookies();
    const supabase = createClient(cookieStore);

    // Fetch key metrics
    const { data: orders } = await supabase.from('orders').select('id, total_amount, status, created_at').order('created_at', { ascending: false });

    const totalOrders = orders?.length || 0;
    const totalRevenue = orders?.reduce((acc, order) => acc + (Number(order.total_amount) || 0), 0) || 0;
    const pendingOrders = orders?.filter(o => o.status === 'pending').length || 0;

    const stats = [
        { label: "Total Revenue", value: `Ksh ${totalRevenue.toLocaleString()}`, icon: DollarSign, trend: "+12.5%", positive: true },
        { label: "Total Orders", value: totalOrders.toString(), icon: ShoppingBag, trend: "+4.3%", positive: true },
        { label: "Pending Orders", value: pendingOrders.toString(), icon: Clock, trend: "-2.1%", positive: false },
        { label: "Average Order", value: totalOrders ? `Ksh ${(totalRevenue / totalOrders).toLocaleString()}` : "0", icon: TrendingUp, trend: "+8.1%", positive: true },
    ];

    return (
        <div className="space-y-12">
            <div className="flex items-end justify-between">
                <div className="space-y-2">
                    <h2 className="text-4xl font-serif font-bold text-white tracking-tight">Overview <span className="text-zinc-700 italic">Metrics.</span></h2>
                    <p className="text-zinc-500 text-sm font-light">Real-time performance of your artisanal butchery.</p>
                </div>
                <div className="bg-zinc-900 border border-zinc-800 px-4 py-2 rounded-sm text-[10px] uppercase tracking-widest font-bold text-zinc-400">
                    Last 30 Days
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, idx) => (
                    <div key={idx} className="bg-zinc-900/50 border border-zinc-800/50 p-6 rounded-sm space-y-4 hover:border-gold/30 transition-colors group">
                        <div className="flex items-center justify-between">
                            <div className="w-10 h-10 bg-zinc-900 rounded-sm flex items-center justify-center text-gold group-hover:bg-gold group-hover:text-black transition-all">
                                <stat.icon size={20} />
                            </div>
                            <div className={`flex items-center gap-1 text-[10px] font-bold ${stat.positive ? "text-emerald-500" : "text-rose-500"}`}>
                                {stat.trend}
                                {stat.positive ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                            </div>
                        </div>
                        <div>
                            <p className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold mb-1">{stat.label}</p>
                            <h3 className="text-2xl font-serif font-bold text-white tracking-tight">{stat.value}</h3>
                        </div>
                    </div>
                ))}
            </div>

            {/* Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 bg-zinc-900/50 border border-zinc-800/50 p-8 rounded-sm space-y-6">
                    <h3 className="text-[10px] uppercase tracking-widest text-white font-bold">Revenue Flow</h3>
                    <div className="h-[300px] flex items-end justify-between px-4 pb-4">
                        {/* Simple Bar Chart Visualization using Divs */}
                        {Array.from({ length: 12 }).map((_, i) => (
                            <div key={i} className="w-8 bg-zinc-800/50 hover:bg-gold/50 transition-colors rounded-t-sm relative group">
                                <div
                                    className="absolute bottom-0 w-full bg-gold/20 group-hover:bg-gold/40 transition-all rounded-t-sm"
                                    style={{ height: `${Math.floor(Math.random() * 80) + 20}%` }}
                                />
                                <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap text-[8px] bg-white text-black px-2 py-1 rounded-sm font-bold">
                                    Ksh {Math.floor(Math.random() * 50000).toLocaleString()}
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="flex justify-between px-2 text-[8px] uppercase tracking-widest text-zinc-600 font-bold">
                        <span>Jan</span>
                        <span>Dec</span>
                    </div>
                </div>
                <div className="bg-zinc-900/50 border border-zinc-800/50 p-8 rounded-sm space-y-6">
                    <h3 className="text-[10px] uppercase tracking-widest text-white font-bold">Recent Statuses</h3>
                    <div className="space-y-6">
                        {orders?.slice(0, 5).map((order: any, i: number) => {
                            const date = new Date(order.created_at);
                            const hoursAgo = Math.floor((new Date().getTime() - date.getTime()) / (1000 * 60 * 60));

                            return (
                                <div key={order.id} className="flex items-center gap-4 group">
                                    <div className={`w-2 h-2 rounded-full ${order.status === 'pending' ? 'bg-amber-500' :
                                        order.status === 'processing' ? 'bg-blue-500' :
                                            'bg-emerald-500'
                                        } group-hover:scale-125 transition-transform`} />
                                    <div className="flex-1 min-w-0">
                                        <p className="text-xs text-white font-medium truncate">#{order.id.slice(0, 8).toUpperCase()} {order.status}</p>
                                        <p className="text-[10px] text-zinc-500 uppercase tracking-widest">
                                            {hoursAgo === 0 ? 'Just now' : `${hoursAgo} hour${hoursAgo > 1 ? 's' : ''} ago`}
                                        </p>
                                    </div>
                                </div>
                            );
                        })}
                        {(!orders || orders.length === 0) && (
                            <p className="text-[10px] text-zinc-600 uppercase tracking-widest italic text-center py-10">No recent activity.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
