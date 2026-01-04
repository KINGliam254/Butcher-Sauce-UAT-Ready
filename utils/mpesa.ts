export interface MpesaResponse {
    MerchantRequestID: string;
    CheckoutRequestID: string;
    ResponseCode: string;
    ResponseDescription: string;
    CustomerMessage: string;
}

export async function initiateSTKPush(phoneNumber: string, amount: number): Promise<MpesaResponse> {
    const environment = process.env.MPESA_ENVIRONMENT || 'mock';

    // Config check logs (non-sensitive)
    console.log(`>>> [MPESA] Environment: ${environment}`);
    console.log(`>>> [MPESA] Shortcode: ${process.env.MPESA_SHORTCODE ? 'SET' : 'MISSING'}`);

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

    // Placeholder for real Safaricom logic
    // You will need: MPESA_CONSUMER_KEY, MPESA_CONSUMER_SECRET, MPESA_SHORTCODE, MPESA_PASSKEY
    console.log(`>>> [MPESA-LIVE] Real integration logic would core here using shortcode ${process.env.MPESA_SHORTCODE}`);

    throw new Error('Real M-Pesa integration pending credentials configuration in .env');
}
