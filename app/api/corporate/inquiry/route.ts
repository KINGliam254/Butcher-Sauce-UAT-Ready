import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'
import { cookies } from 'next/headers'

export async function POST(request: Request) {
    try {
        const cookieStore = cookies()
        const supabase = createClient(cookieStore)
        const body = await request.json()
        const { companyName, contactPerson, email, serviceRequired, message } = body

        if (!email || !message) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
        }

        const { error } = await supabase
            .from('corporate_inquiries')
            .insert({
                company_name: companyName,
                contact_person: contactPerson,
                email,
                service_required: serviceRequired,
                message
            })

        if (error) throw error

        return NextResponse.json({ success: true })
    } catch (error: any) {
        console.error('Corporate Inquiry Error:', error)
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        )
    }
}
