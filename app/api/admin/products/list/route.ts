import { NextResponse } from 'next/server'
import { createAdminClient } from '@/utils/supabase/admin'

export async function GET() {
    try {
        const supabase = createAdminClient()

        const { data, error } = await supabase
            .from('products')
            .select('*')
            .order('category', { ascending: true })

        if (error) {
            console.error('>>> [API/PRODUCTS/LIST] Supabase Error:', error);
            throw error;
        }

        console.log(`>>> [API/PRODUCTS/LIST] Found ${data?.length || 0} products`);
        return NextResponse.json({ data })
    } catch (error: any) {
        console.error('>>> [API/PRODUCTS/LIST] Catch Error:', error);
        return NextResponse.json(
            { error: error.message },
            { status: 500 }
        )
    }
}
