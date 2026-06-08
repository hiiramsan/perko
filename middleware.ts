import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET);

// 🆕 Supabase URL + service key for the lightweight status check
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// 🆕 Lean fetch — no SDK, just a single REST call. Middleware runs on the
//    edge runtime where heavy imports are expensive. This stays fast.
async function getOnboardingStatus(
  userId: string,
  role: string
): Promise<{ status: string; step: number } | null> {
  if (role === 'staff') return null;

  try {
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/businesses?owner_id=eq.${userId}&select=onboarding_status,onboarding_step&limit=1`,
      {
        headers: {
          apikey: SUPABASE_SERVICE_ROLE_KEY,
          Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (!res.ok) return null;

    const rows = await res.json();
    if (!rows?.length) {
      return { status: 'not_started', step: 1 };
    }

    return {
      status: rows[0].onboarding_status,
      step: rows[0].onboarding_step ?? 1,
    };
  } catch {
    return null; // fail open — let the page-level auth handle edge cases
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const sessionToken = request.cookies.get('perko_session')?.value;

  let userPayload = null;

  if (sessionToken) {
    try {
      const { payload } = await jwtVerify(sessionToken, JWT_SECRET);
      userPayload = payload as { id: string; email: string; role: 'customer' | 'admin' | 'staff' };
    } catch (err) {
      console.error('Middleware JWT Verification Failed:', err);
      const response = NextResponse.redirect(new URL('/login?error=session-expired', request.url));
      response.cookies.delete('perko_session');
      return response;
    }
  }

  // --- TRAFFIC CONTROL LOGIC ---

  if (!userPayload) {
    if (
      pathname === '/' ||
      pathname.startsWith('/login') ||
      pathname.startsWith('/register') ||
      pathname.startsWith('/verify-email') ||
      pathname.startsWith('/business') ||
      pathname.startsWith('/callback') ||
      pathname.startsWith('/join')
    ) {
      return NextResponse.next();
    }
    const targetRole = pathname.startsWith('/cartera') ? 'customer' : 'admin';
    return NextResponse.redirect(new URL(`/login?role=${targetRole}`, request.url));
  }

  if (userPayload) {
    const isPublicRoute =
      pathname === '/' ||
      pathname.startsWith('/login') ||
      pathname.startsWith('/register') ||
      pathname.startsWith('/verify-email') ||
      pathname.startsWith('/business');

    if (isPublicRoute) {
      if (userPayload.role === 'customer') {
        return NextResponse.redirect(new URL('/cartera', request.url));
      }

      if (userPayload.role === 'admin' || userPayload.role === 'staff') {
        const onboarding = await getOnboardingStatus(userPayload.id, userPayload.role);

        if (onboarding?.status === 'completed') {
          return NextResponse.redirect(new URL('/dashboard', request.url));
        }

        return NextResponse.next();
      }
    }

    // 🆕 Onboarding gate — only applies to business roles
    if (userPayload.role === 'admin' || userPayload.role === 'staff') {
      const isOnboardingRoute = pathname.startsWith('/onboarding');
      const isDashboardRoute  = pathname.startsWith('/dashboard');
      const isScanRoute       = pathname.startsWith('/scan');

      // Only run the DB check when the user is heading somewhere that requires
      // onboarding to be resolved. Skips the fetch for unrelated routes.
      if (isOnboardingRoute || isDashboardRoute || isScanRoute) {
        const onboarding = await getOnboardingStatus(userPayload.id, userPayload.role);

        if (onboarding) {
          const { status } = onboarding;

          // Not done yet → keep them in onboarding
          if (status !== 'completed') {
            if (!isOnboardingRoute) {
              return NextResponse.redirect(new URL('/onboarding', request.url));
            }
            // Already on an onboarding route → let them through
            return NextResponse.next();
          }

          // Onboarding done → block re-entry into onboarding pages
          if (status === 'completed' && isOnboardingRoute) {
            return NextResponse.redirect(new URL('/dashboard', request.url));
          }
        } else if (!isOnboardingRoute) {
          return NextResponse.next();
        }
      }
    }

    if (pathname.startsWith('/dashboard') || pathname.startsWith('/onboarding') || pathname.startsWith('/scan')) {
      if (userPayload.role === 'customer') {
        return NextResponse.redirect(new URL('/cartera', request.url));
      }
    }

    if (pathname.startsWith('/cartera')) {
      if (userPayload.role === 'admin' || userPayload.role === 'staff') {
        return NextResponse.redirect(new URL('/dashboard', request.url));
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|.*\\..*).*)',
  ],
};