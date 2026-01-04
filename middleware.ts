import { NextResponse, type NextRequest } from 'next/server'
import { updateSession } from '@/utils/supabase/middleware'
import { verifyToken } from '@/utils/auth'

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;
    const adminSession = request.cookies.get('butcher-admin-session');

    // Create new headers object to pass pathname to server components
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set('x-pathname', pathname);

    // SECURITY HEADERS
    const responseHeaders = new Headers();
    responseHeaders.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
    responseHeaders.set('X-Frame-Options', 'DENY');
    responseHeaders.set('X-Content-Type-Options', 'nosniff');
    responseHeaders.set('Referrer-Policy', 'strict-origin-when-cross-origin');
    responseHeaders.set('Content-Security-Policy', "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://*.supabase.co; style-src 'self' 'unsafe-inline'; img-src 'self' data: https://*.supabase.co https://images.unsplash.com; font-src 'self' data:; connect-src 'self' https://*.supabase.co https://api.deepseek.com;");

    console.log(`>>> [MIDDLEWARE] Path: ${pathname} | Token: ${adminSession?.value ? 'PRESENT' : 'MISSING'}`);

    // Admin protection logic
    const isAdminRoute = pathname.startsWith('/admin') || pathname.startsWith('/api/admin');
    const isLoginRoute = pathname === '/admin/login' || pathname === '/api/admin/login';

    if (isAdminRoute && !isLoginRoute) {
        const payload = adminSession ? await verifyToken(adminSession.value) : null;

        if (!payload || (payload as any).role !== 'admin') {
            console.log(`>>> [MIDDLEWARE] BLOCKING ${pathname} -> Rewriting to 404`);
            return NextResponse.rewrite(new URL('/404', request.url), {
                headers: responseHeaders
            });
        }
        console.log(`>>> [MIDDLEWARE] ALLOWING ${pathname}`);
    }

    let response = NextResponse.next({
        request: {
            headers: requestHeaders,
        },
    });

    if (pathname.startsWith('/admin')) {
        response = await updateSession(request);
        response.headers.set('x-pathname', pathname);
    }

    // Apply security headers to final response
    responseHeaders.forEach((value, key) => {
        response.headers.set(key, value);
    });

    return response;
}

export const config = {
    matcher: [
        '/admin',
        '/admin/:path*',
        '/api/admin',
        '/api/admin/:path*',
        '/((?!api|_next/static|_next/image|favicon.ico).*)', // Apply to all non-static routes
    ],
}
