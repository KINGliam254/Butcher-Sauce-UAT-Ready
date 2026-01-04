export interface MpesaResponse {
    MerchantRequestID: string;
    CheckoutRequestID: string;
    ResponseCode: string;
    ResponseDescription: string;
    CustomerMessage: string;
}

export async function initiateSTKPush(phoneNumber: string, amount: number): Promise<MpesaResponse> {
    const environment = process.env.MPESA_ENVIRONMENT || 'mock';

    if (environment === 'mock') {
        console.log(`>>> [MPESA-MOCK] Initiating STK Push for ${phoneNumber} - Amount: ${amount}`);

        // Simulate a 1-second delay for the request
        await new Promise(resolve => setTimeout(resolve, 1000));

        return {
            MerchantRequestID: `MOCK-${Math.random().toString(36).substring(7)}`,
            CheckoutRequestID: `ws_CO_${Date.now()}`,
            ResponseCode: "0",
            ResponseDescription: "Success. Request accepted for processing",
            CustomerMessage: "Success. Request accepted for processing"
        };
    }

    // Placeholder for real Safaricom logic on Monday
    throw new Error('Real M-Pesa integration pending credentials.');
}
