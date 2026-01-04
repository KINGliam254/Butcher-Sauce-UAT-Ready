import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { signToken } from "@/utils/auth";

export async function POST(request: Request) {
    try {
        const { password } = await request.json();
        const adminPassword = process.env.ADMIN_PASSWORD || "butcher2026";

        console.log(`>>> [LOGIN-API] Received attempt. Password Match: ${password === adminPassword}`);

        if (password === adminPassword) {
            const token = await signToken({ role: "admin", authenticated: true });
            const cookieStore = await cookies();

            console.log(`>>> [LOGIN-API] Setting signed JWT cookie: butcher-admin-session`);
            cookieStore.set("butcher-admin-session", token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "lax",
                maxAge: 60 * 60 * 24, // 24 hours
                path: "/",
            });

            return NextResponse.json({ success: true });
        }

        console.log(`>>> [LOGIN-API] Invalid password.`);
        return NextResponse.json({ success: false, error: "Invalid password" }, { status: 401 });
    } catch (error) {
        console.error(`>>> [LOGIN-API] ERROR:`, error);
        return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
    }
}
