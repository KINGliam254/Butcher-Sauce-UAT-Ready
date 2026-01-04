import { NextResponse } from 'next/server'
import { createAdminClient } from '@/utils/supabase/admin'

export async function PATCH(request: Request) {
    try {
        const supabase = createAdminClient()
        const { orderId, status, payment_status } = await request.json()

        if (!orderId) {
            return NextResponse.json({ error: 'Missing orderId' }, { status: 400 })
        }

        const updateData: any = {};
        if (status) updateData.status = status;
        if (payment_status) {
            updateData.payment_status = payment_status;
            if (payment_status === 'paid') {
                updateData.mpesa_receipt_number = `MOCK${Math.random().toString(36).substring(2, 10).toUpperCase()}`;
            }
        }

        const { error } = await supabase
            .from('orders')
            .update(updateData)
            .eq('id', orderId)

        if (error) throw error

        return NextResponse.json({ success: true })
    } catch (error: any) {
        console.error('Admin Order Update Error:', error)
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        )
    }
}
