import { NextResponse } from 'next/server'
import { seedDatabase } from '@/utils/seed-products'

export async function POST() {
    try {
        const data = await seedDatabase();
        return NextResponse.json({ success: true, data });
    } catch (error: any) {
        console.error('Admin Seed Error:', error);
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        )
    }
}
