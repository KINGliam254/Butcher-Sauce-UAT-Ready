import {
    ShoppingBag,
} from "lucide-react";

import StatusSelect from "@/components/admin/StatusSelect";
import OrdersClientWrapper from "./OrdersClientWrapper";
import { createAdminClient } from "@/utils/supabase/admin";

export default async function OrdersPage() {
    const supabase = createAdminClient();

    const { data: orders } = await supabase
        .from('orders')
        .select(`
            *,
            items:order_items(*)
        `)
        .order('created_at', { ascending: false });

    return <OrdersClientWrapper orders={orders || []} />;
}
