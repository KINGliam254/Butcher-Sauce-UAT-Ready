import { createAdminClient } from "@/utils/supabase/admin";
import InquiriesList from "./InquiriesList";

export default async function InquiriesPage() {
    const supabase = createAdminClient();

    const { data: inquiries } = await supabase
        .from('corporate_inquiries')
        .select('*')
        .order('created_at', { ascending: false });

    return <InquiriesList inquiries={inquiries || []} />;
}
