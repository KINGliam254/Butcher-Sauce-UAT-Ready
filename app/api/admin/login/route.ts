import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(request: Request) {
    try {
        const { password } = await request.json();

        // Use environment variable for production, fallback for dev
        const adminPassword = process.env.ADMIN_PASSWORD || "butcher2026";

        if (password === adminPassword) {
            const cookieStore = await cookies();

            // Set a secure, httpOnly cookie for the session
            cookieStore.set("admin-session", "authenticated", {
                httpOnly: true,
                secure: process.env.NODE_VERSION === "production",
                sameSite: "lax",
                maxAge: 60 * 60 * 24, // 24 hours
                path: "/",
            });

            return NextResponse.json({ success: true });
        }

        return NextResponse.json({ success: false, error: "Invalid password" }, { status: 401 });
    } catch (error) {
        return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
    }
}
