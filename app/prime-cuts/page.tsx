import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import PrimeCutsClientWrapper from "./PrimeCutsClientWrapper";

export default async function PrimeCutsPage() {
    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);

    // Fetch all products that are NOT sauces or tools (The 'Prime Cuts' collection)
    const { data: products } = await supabase
        .from('products')
        .select('*')
        .not('category', 'in', '("Sauces & Marinades","Master Tools")')
        .order('created_at', { ascending: false });

    return <PrimeCutsClientWrapper initialProducts={products || []} />;
}

