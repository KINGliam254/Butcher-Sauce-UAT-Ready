import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import InquiriesList from "./InquiriesList";

export default async function InquiriesPage() {
    const cookieStore = cookies();
    const supabase = createClient(cookieStore);

    const { data: inquiries } = await supabase
        .from('corporate_inquiries')
        .select('*')
        .order('created_at', { ascending: false });

    return <InquiriesList inquiries={inquiries || []} />;
}
