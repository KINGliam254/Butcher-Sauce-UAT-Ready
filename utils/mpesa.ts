export interface MpesaResponse {
    MerchantRequestID: string;
    CheckoutRequestID: string;
    ResponseCode: string;
    ResponseDescription: string;
    CustomerMessage: string;
}

async function getAccessToken(): Promise<string> {
    const consumerKey = process.env.MPESA_CONSUMER_KEY;
    const consumerSecret = process.env.MPESA_CONSUMER_SECRET;
    const environment = process.env.MPESA_ENVIRONMENT || 'sandbox';

    if (!consumerKey || !consumerSecret) {
        throw new Error(`Missing M-Pesa credentials: ${!consumerKey ? 'MPESA_CONSUMER_KEY ' : ''}${!consumerSecret ? 'MPESA_CONSUMER_SECRET' : ''}. Please check your .env.local or Vercel settings.`);
    }

    const url = environment === 'live'
        ? 'https://api.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials'
        : 'https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials';

    const auth = Buffer.from(`${consumerKey}:${consumerSecret}`).toString('base64');

    console.log(`>>> [MPESA-TOKEN] Requesting from: ${url}`);

    try {
        const response = await fetch(url, {
            headers: {
                Authorization: `Basic ${auth}`,
            },
        });

        console.log(`>>> [MPESA-TOKEN] Status: ${response.status} ${response.statusText}`);

        const text = await response.text();
        let data;
        try {
            data = JSON.parse(text);
        } catch (e) {
            throw new Error(`Invalid M-Pesa Token response (Status ${response.status}). Body: ${text.substring(0, 100) || 'Empty'}`);
        }

        if (!response.ok) {
            throw new Error(data.errorMessage || `M-Pesa Token Error: ${response.statusText}`);
        }

        return data.access_token;
    } catch (error: any) {
        console.error('M-Pesa Token Fetch Exception:', error);
        throw error;
    }
}

export async function initiateSTKPush(phoneNumber: string, amount: number): Promise<MpesaResponse> {
    const environment = process.env.MPESA_ENVIRONMENT || 'sandbox';
    const shortcode = process.env.MPESA_SHORTCODE;
    const passkey = process.env.MPESA_PASSKEY;

    // Use the provided Vercel domain as fallback for the callback
    const callbackBaseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://butcher-sauce-uat.vercel.app';
    const callbackUrl = `${callbackBaseUrl}/api/mpesa/callback`;

    // Format phone: 2547XXXXXXXX
    let formattedPhone = phoneNumber.replace(/[^0-9]/g, '');
    if (formattedPhone.startsWith('0')) {
        formattedPhone = '254' + formattedPhone.substring(1);
    } else if (formattedPhone.startsWith('+')) {
        formattedPhone = formattedPhone.substring(1);
    }

    console.log(`>>> [MPESA] Initiating STK Push for ${formattedPhone} in ${environment} mode`);

    if (environment === 'mock') {
        await new Promise(resolve => setTimeout(resolve, 1000));
        return {
            MerchantRequestID: `MOCK-${Math.random().toString(36).substring(7)}`,
            CheckoutRequestID: `ws_CO_${Date.now()}`,
            ResponseCode: "0",
            ResponseDescription: "Success. Request accepted for processing",
            CustomerMessage: "Success. Request accepted for processing"
        };
    }

    try {
        const accessToken = await getAccessToken();
        const timestamp = new Date().toISOString().replace(/[^0-9]/g, '').slice(0, 14);
        const password = Buffer.from(`${shortcode}${passkey}${timestamp}`).toString('base64');

        const processUrl = environment === 'live'
            ? 'https://api.safaricom.co.ke/mpesa/stkpush/v1/process'
            : 'https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/process';

        const payload = {
            BusinessShortCode: shortcode,
            Password: password,
            Timestamp: timestamp,
            TransactionType: "CustomerPayBillOnline",
            Amount: Math.round(amount),
            PartyA: formattedPhone,
            PartyB: shortcode,
            PhoneNumber: formattedPhone,
            CallBackURL: callbackUrl,
            AccountReference: "ButcherSauce",
            TransactionDesc: "Payment for Order"
        };

        const response = await fetch(processUrl, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        });

        const text = await response.text();
        let data;
        try {
            data = JSON.parse(text);
        } catch (e) {
            throw new Error(`Invalid M-Pesa STK Push response: ${text || 'Empty'}`);
        }

        if (!response.ok) {
            throw new Error(data.errorMessage || 'M-Pesa STK Push failed');
        }

        return data;
    } catch (error: any) {
        console.error('M-Pesa API Error:', error);
        throw error;
    }
}
