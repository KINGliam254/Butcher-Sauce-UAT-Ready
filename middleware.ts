import { NextResponse, type NextRequest } from 'next/server'
import { updateSession } from '@/utils/supabase/middleware'

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Admin protection logic
    if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
        const adminSession = request.cookies.get('admin-session');

        if (!adminSession) {
            const url = request.nextUrl.clone();
            url.pathname = '/admin/login';
            return NextResponse.redirect(url);
        }
    }

    // Optimization: Only update session if on an admin route or if a supabase auth cookie exists.
    // This avoids blocking public page renders with unnecessary network requests to Supabase.
    // Optimization: Only update session if strictly on an admin route.
    // Public pages do NOT need server-side auth validation for this project.
    if (pathname.startsWith('/admin')) {
        return await updateSession(request);
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * - Public folder assets (images, logos, etc.)
         */
        '/((?!_next/static|_next/image|favicon.ico|logo\\.png|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js|woff2?|map)$).*)',
    ],
}
