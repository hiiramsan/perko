import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET);

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Extract your custom secure cookie
  const sessionToken = request.cookies.get('perko_session')?.value;

  let userPayload = null;

  // 2. Try to verify the token if it exists
  if (sessionToken) {
    try {
      const { payload } = await jwtVerify(sessionToken, JWT_SECRET);
      userPayload = payload as { id: string; email: string; role: 'customer' | 'admin' | 'staff' };
    } catch (err) {
      // Token is invalid, expired, or tampered with
      console.error('Middleware JWT Verification Failed:', err);
      
      // Clear the corrupted cookie and kick them back to login
      const response = NextResponse.redirect(new URL('/login?error=session-expired', request.url));
      response.cookies.delete('perko_session');
      return response;
    }
  }

  // --- TRAFFIC CONTROL LOGIC ---

  // Case A: User is NOT authenticated
  if (!userPayload) {
    // Let them see the public landing page or any page in the (auth) group
    if (
      pathname === '/' ||
      pathname.startsWith('/login') ||
      pathname.startsWith('/register') ||
      pathname.startsWith('/business') ||
      pathname.startsWith('/callback')
    ) {
      return NextResponse.next();
    }
    
    // Trying to access anything else? Redirect to login
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Case B: User IS authenticated
  if (userPayload) {
    // If they have a valid session but are hanging out on auth screens or the landing page, redirect them based on their role
    if (
      pathname === '/' ||
      pathname.startsWith('/login') ||
      pathname.startsWith('/register') ||
      pathname.startsWith('/business')
    ) {
      if (userPayload.role === 'customer') {
        return NextResponse.redirect(new URL('/cartera', request.url));
      }
      if (userPayload.role === 'admin' || userPayload.role === 'staff') {
        return NextResponse.redirect(new URL('/dashboard', request.url));
      }
    }

    // Role Guard: Prevent Customers from visiting any business admin/dashboard routes
    if (pathname.startsWith('/dashboard') || pathname.startsWith('/onboarding') || pathname.startsWith('/scan')) {
      if (userPayload.role === 'customer') {
        return NextResponse.redirect(new URL('/cartera', request.url));
      }
    }

    // Role Guard: Prevent Admins/Staff from entering customer wallet paths
    if (pathname.startsWith('/cartera')) {
      if (userPayload.role === 'admin' || userPayload.role === 'staff') {
        return NextResponse.redirect(new URL('/dashboard', request.url));
      }
    }
  }

  // Allow the request to pass through if all guard checks clear
  return NextResponse.next();
}

// 3. Define exactly which routes this middleware runs on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (allows public API endpoints to handle their own logic)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
  ],
};