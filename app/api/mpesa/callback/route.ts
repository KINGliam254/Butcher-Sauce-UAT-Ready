import { NextResponse } from 'next/server';
import { createAdminClient } from '@/utils/supabase/admin';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { Body } = body;

        console.log('>>> [MPESA-CALLBACK] Received:', JSON.stringify(Body, null, 2));

        if (!Body?.stkCallback) {
            return NextResponse.json({ success: false, message: 'Invalid callback data' });
        }

        const { MerchantRequestID, CheckoutRequestID, ResultCode, ResultDesc, CallbackMetadata } = Body.stkCallback;

        const supabase = createAdminClient();

        if (ResultCode === 0) {
            // Success
            const metadataItems = CallbackMetadata?.Item || [];
            const amount = metadataItems.find((i: any) => i.Name === 'Amount')?.Value;
            const receipt = metadataItems.find((i: any) => i.Name === 'MpesaReceiptNumber')?.Value;
            const phone = metadataItems.find((i: any) => i.Name === 'PhoneNumber')?.Value;

            console.log(`>>> [MPESA-SUCCESS] CheckoutID: ${CheckoutRequestID}, Receipt: ${receipt}`);

            // Update order status
            const { error } = await supabase
                .from('orders')
                .update({
                    payment_status: 'paid',
                    transaction_id: receipt, // Use M-Pesa receipt as transaction id
                    metadata: {
                        mpesa_checkout_id: CheckoutRequestID,
                        mpesa_merchant_id: MerchantRequestID,
                        mpesa_phone: phone,
                        mpesa_amount: amount
                    }
                })
                .eq('checkout_request_id', CheckoutRequestID);

            if (error) {
                console.error('Error updating order on success:', error);
            }
        } else {
            // Failure
            console.log(`>>> [MPESA-FAILED] CheckoutID: ${CheckoutRequestID}, Code: ${ResultCode}, Desc: ${ResultDesc}`);

            const { error } = await supabase
                .from('orders')
                .update({
                    payment_status: 'failed',
                    metadata: {
                        mpesa_error_code: ResultCode,
                        mpesa_error_desc: ResultDesc
                    }
                })
                .eq('checkout_request_id', CheckoutRequestID);

            if (error) {
                console.error('Error updating order on failure:', error);
            }
        }

        return NextResponse.json({ ResultCode: 0, ResultDesc: 'Success' });
    } catch (error: any) {
        console.error('M-Pesa Callback Error:', error);
        return NextResponse.json({ ResultCode: 1, ResultDesc: 'Internal Server Error' });
    }
}
