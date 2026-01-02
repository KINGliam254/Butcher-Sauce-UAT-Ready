import {
    ShoppingBag,
} from "lucide-react";

import StatusSelect from "@/components/admin/StatusSelect";
import OrdersClientWrapper from "./OrdersClientWrapper";
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";

export default async function OrdersPage() {
    const cookieStore = cookies();
    const supabase = createClient(cookieStore);

    const { data: orders } = await supabase
        .from('orders')
        .select(`
            *,
            items:order_items(*)
        `)
        .order('created_at', { ascending: false });

    return <OrdersClientWrapper orders={orders || []} />;
}
