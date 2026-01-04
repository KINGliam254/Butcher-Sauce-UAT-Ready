import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'
import { cookies } from 'next/headers'

export async function POST(request: Request) {
    try {
        const cookieStore = await cookies()
        const supabase = createClient(cookieStore)
        const body = await request.json()
        const { customer, items, payment, total } = body

        // 1. Initiate Payment if M-Pesa
        let mpesaData = null;
        if (payment.method === 'mpesa') {
            const { initiateSTKPush } = await import('@/utils/mpesa');
            mpesaData = await initiateSTKPush(customer.phone, total);
        }

        // 2. Insert Order
        const { data: order, error: orderError } = await supabase
            .from('orders')
            .insert({
                customer_name: customer.name,
                email: customer.email,
                phone: customer.phone,
                address: customer.fulfillment === 'pickup'
                    ? `PICKUP: ${customer.pickup_location}`
                    : customer.address,
                total_amount: total,
                payment_method: payment.method,
                payment_status: payment.method === 'mpesa' ? 'awaiting_stk' : 'pending',
                transaction_id: mpesaData?.CheckoutRequestID || payment.details?.transactionId || null,
                checkout_request_id: mpesaData?.CheckoutRequestID || null,
                status: 'pending'
            })
            .select()
            .single()

        if (orderError) throw orderError

        // 2. Insert Order Items
        const orderItems = items.map((item: any) => ({
            order_id: order.id,
            product_slug: item.slug,
            product_name: item.name,
            price: item.numericPrice || 0,
            quantity: item.quantity,
            preparation: item.preparation || null,
            doneness: item.doneness || null
        }))

        const { error: itemsError } = await supabase
            .from('order_items')
            .insert(orderItems)

        if (itemsError) throw itemsError

        return NextResponse.json({ success: true, orderId: order.id })
    } catch (error: any) {
        console.error('Order Submission Error:', error)
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        )
    }
}
