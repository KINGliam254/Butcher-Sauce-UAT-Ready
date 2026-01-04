import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'
import { cookies } from 'next/headers'
import { sendTelegramMessage } from '@/utils/telegram'

export async function POST(request: Request) {
    try {
        const cookieStore = await cookies()
        const supabase = createClient(cookieStore)
        const body = await request.json()
        const { customer, items, payment, total } = body
        console.log(`>>> [ORDER-API] Received order request: ${customer.email} - Total: ${total}`);

        // 1. Initiate Payment if M-Pesa
        let mpesaData = null;
        if (payment.method === 'mpesa') {
            console.log(`>>> [ORDER-API] Initiating M-Pesa STK Push...`);
            const { initiateSTKPush } = await import('@/utils/mpesa');
            mpesaData = await initiateSTKPush(customer.phone, total);
            console.log(`>>> [ORDER-API] M-Pesa Response: ${JSON.stringify(mpesaData)}`);
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

        if (orderError) {
            console.error('>>> [ORDER-API] Supabase Order Error:', orderError);
            throw orderError;
        }
        console.log(`>>> [ORDER-API] Order record created: ${order.id}`);

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

        if (itemsError) {
            console.error('>>> [ORDER-API] Supabase Order Items Error:', itemsError);
            throw itemsError;
        }
        console.log(`>>> [ORDER-API] Order items created successfully`);

        // 3. Send Telegram Notification
        const orderUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'https://butcher-sauce-uat.vercel.app'}/admin/orders/${order.id}`;
        const message = `
🌟 <b>New Order Placed!</b> 🌟

<b>Order ID:</b> #${order.id.slice(-6).toUpperCase()}
<b>Customer:</b> ${customer.name}
<b>Phone:</b> ${customer.phone}
<b>Total:</b> Ksh ${total.toLocaleString()}
<b>Method:</b> ${payment.method.toUpperCase()}

<a href="${orderUrl}">View Order in Admin Portal</a>
        `.trim();

        console.log(`>>> [ORDER-API] Sending Telegram notification...`);
        await sendTelegramMessage(message);
        console.log(`>>> [ORDER-API] Telegram notification sent`);

        return NextResponse.json({ success: true, orderId: order.id })
    } catch (error: any) {
        console.error('>>> [ORDER-API] CRITICAL ERROR:', error)
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        )
    }
}
