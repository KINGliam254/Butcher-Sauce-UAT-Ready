import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST() {
    const cookieStore = await cookies();

    // Clear the butcher-admin-session cookie by setting its expiry to the past
    cookieStore.set("butcher-admin-session", "", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 0,
        path: "/",
    });

    return NextResponse.json({ success: true });
}
