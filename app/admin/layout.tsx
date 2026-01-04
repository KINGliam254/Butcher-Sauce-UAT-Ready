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

    // Simplified check: since middleware already verified the JWT,
    // we just ensure the cookie exists here as a fallback.
    if (!adminSession) {
        console.log(`>>> [LAYOUT] MISSING SESSION. Redirecting.`);
        return (
            <div className="min-h-screen bg-black flex items-center justify-center p-10 font-sans">
                ...
            </div>
        );
    }

    console.log(`>>> [LAYOUT] GRANTED.`);
    return <AdminLayoutClient>{children}</AdminLayoutClient>;
}
