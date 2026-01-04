import { cookies, headers } from "next/headers";
import { notFound } from "next/navigation";
import AdminLayoutClient from "./AdminLayoutClient";

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const cookieStore = await cookies();
    const adminSession = cookieStore.get("butcher-admin-session");
    const headerList = await headers();
    const pathname = headerList.get('x-pathname') || "";

    console.log(`>>> [LAYOUT] Path: ${pathname} | Session: ${adminSession?.value ? 'PRESENT' : 'MISSING'}`);

    // EXEMPT the login page from the security shield!
    if (pathname === "/admin/login") {
        return <>{children}</>;
    }

    // Strict check for admin-session cookie
    if (!adminSession || adminSession.value !== "authenticated") {
        console.log(`>>> [LAYOUT] DENIED. Rendering Security Shield.`);
        return (
            <div className="min-h-screen bg-black flex items-center justify-center p-10 font-sans">
                <div className="max-w-md w-full border border-red-900/20 bg-zinc-900/50 p-12 text-center space-y-8">
                    <div className="w-16 h-16 bg-red-900/10 rounded-full flex items-center justify-center mx-auto">
                        <span className="text-red-500 text-2xl">!</span>
                    </div>
                    <div className="space-y-4">
                        <h1 className="text-white text-xl font-serif font-bold tracking-widest uppercase">Secured Area</h1>
                        <p className="text-zinc-500 text-[10px] tracking-[0.2em] uppercase leading-relaxed">
                            Access Denied. Unauthorized entry is restricted.
                        </p>
                    </div>
                    <a
                        href="/admin/login"
                        target="_self"
                        className="inline-block bg-white text-black px-8 py-3 text-[10px] font-bold uppercase tracking-widest hover:bg-zinc-200 transition-all cursor-pointer"
                    >
                        Authenticate
                    </a>
                </div>
            </div>
        );
    }

    console.log(`>>> [LAYOUT] GRANTED.`);
    return <AdminLayoutClient>{children}</AdminLayoutClient>;
}
