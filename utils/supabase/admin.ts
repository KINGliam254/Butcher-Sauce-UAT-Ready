import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

export const createAdminClient = () => {
    if (!supabaseUrl || !supabaseServiceKey) {
        console.warn(">>> [Supabase Admin] Missing environment variables. Falling back to public client (RLS may block operations).");
        return createClient(
            supabaseUrl!,
            process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY!
        );
    }

    return createClient(
        supabaseUrl,
        supabaseServiceKey,
        {
            auth: {
                autoRefreshToken: false,
                persistSession: false
            }
        }
    );
};
