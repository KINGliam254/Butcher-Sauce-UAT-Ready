import { NextResponse } from 'next/server';
import { createAdminClient } from '@/utils/supabase/admin';

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const orderId = (await params).id;
        const supabase = createAdminClient();

        const { data: order, error } = await supabase
            .from('orders')
            .select('payment_status, status')
            .eq('id', orderId)
            .single();

        if (error) throw error;

        return NextResponse.json({
            status: order.status,
            payment_status: order.payment_status,
            isPaid: order.payment_status === 'paid'
        });
    } catch (error: any) {
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
}
