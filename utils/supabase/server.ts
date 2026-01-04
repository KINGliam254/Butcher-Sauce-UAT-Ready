import 'server-only';
import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";
import { cache } from "react";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY;

export const createClient = cache((cookieStore: any) => {
    return createServerClient(
        supabaseUrl!,
        supabaseKey!,
        {
            cookies: {
                async getAll() {
                    return (await cookieStore).getAll()
                },
                async setAll(cookiesToSet) {
                    try {
                        const resolvedCookies = await cookieStore
                        cookiesToSet.forEach(({ name, value, options }) =>
                            resolvedCookies.set(name, value, options)
                        )
                    } catch {
                        // The `setAll` method was called from a Server Component.
                    }
                },
            },
        },
    );
});
