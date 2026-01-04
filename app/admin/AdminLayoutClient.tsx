"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard,
    ShoppingBag,
    Package,
    Settings,
    ExternalLink,
    Users
} from "lucide-react";

const sidebarLinks = [
    { name: "Overview", href: "/admin", icon: LayoutDashboard },
    { name: "Orders", href: "/admin/orders", icon: ShoppingBag },
    { name: "Products", href: "/admin/products", icon: Package },
    { name: "Inquiries", href: "/admin/inquiries", icon: Users },
];

export default function AdminLayoutClient({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();

    return (
        <div className="flex min-h-screen bg-[#0A0A0A] text-zinc-400 font-sans">
            {/* Sidebar */}
            <aside className="w-64 border-r border-zinc-800/50 flex flex-col bg-[#0A0A0A]">
                <div className="p-8 border-b border-zinc-800/50">
                    <Link href="/admin" className="flex flex-col gap-1 group">
                        <h2 className="text-xl font-serif font-bold tracking-widest uppercase text-white group-hover:text-gold transition-colors">
                            Butcher <span className="text-gold">&</span> Sauce
                        </h2>
                        <span className="text-[10px] tracking-[0.4em] uppercase text-zinc-500 font-bold">Admin Portal</span>
                    </Link>
                </div>

                <nav className="flex-1 p-6 space-y-2">
                    {sidebarLinks.map((link) => {
                        const isActive = pathname === link.href;
                        return (
                            <Link
                                key={link.name}
                                href={link.href}
                                className={`flex items-center gap-3 px-4 py-3 rounded-sm text-[10px] uppercase tracking-widest font-bold transition-all duration-300 ${isActive
                                    ? "bg-gold text-black shadow-lg shadow-gold/10"
                                    : "hover:bg-zinc-900 hover:text-white"
                                    }`}
                            >
                                <link.icon size={16} />
                                {link.name}
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-6 border-t border-zinc-800/50 space-y-4">
                    <Link
                        href="/"
                        className="flex items-center gap-3 px-4 py-3 text-[10px] uppercase tracking-widest font-bold hover:text-white transition-colors"
                    >
                        <ExternalLink size={16} />
                        Visit Store
                    </Link>
                    <button
                        onClick={async () => {
                            await fetch("/api/admin/logout", { method: "POST" });
                            window.location.href = "/admin/login";
                        }}
                        className="w-full flex items-center gap-3 px-4 py-3 text-[10px] uppercase tracking-widest font-bold text-rose-500 hover:bg-rose-500/10 transition-colors"
                    >
                        <ExternalLink size={16} className="rotate-180" />
                        Log Out
                    </button>
                    <div className="flex items-center gap-3 px-4 py-3 opacity-30 cursor-not-allowed">
                        <Settings size={16} />
                        <span className="text-[10px] uppercase tracking-widest font-bold">Settings</span>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto">
                {/* Header */}
                <header className="h-20 border-b border-zinc-800/50 flex items-center justify-between px-10 bg-[#0A0A0A]/80 backdrop-blur-md sticky top-0 z-50">
                    <h1 className="text-[10px] uppercase tracking-[0.4em] font-bold text-zinc-500">
                        {pathname === "/admin" ? "System Overview" : pathname.split("/").pop()}
                    </h1>
                    <div className="flex items-center gap-6">
                        <div className="flex flex-col items-end">
                            <div className="flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                <span className="text-[8px] uppercase tracking-widest font-bold text-zinc-500">DB Connected</span>
                            </div>
                            <span className="text-[7px] uppercase tracking-widest font-bold text-ruby mt-1">Authenticated Admin</span>
                        </div>
                        <div className="w-10 h-10 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center border-ruby/20">
                            <Users size={18} className="text-ruby" />
                        </div>
                    </div>
                </header>

                <div className="p-10">
                    {children}
                </div>
            </main>
        </div>
    );
}
