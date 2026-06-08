import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';
import { SignJWT } from 'jose';

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET);

const sessionCookieOptions = {
  httpOnly: true,
  secure: true,
  sameSite: 'lax' as const,
  path: '/',
};

export function createSupabaseAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

export async function signSessionToken(payload: Record<string, unknown>, expiresIn = '7d') {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(expiresIn)
    .sign(JWT_SECRET);
}

export function setSessionCookie(response: NextResponse, token: string, maxAge = 60 * 60 * 24 * 7) {
  response.cookies.set('perko_session', token, {
    ...sessionCookieOptions,
    maxAge,
  });
}

export function clearSessionCookie(response: NextResponse) {
  response.cookies.set('perko_session', '', {
    ...sessionCookieOptions,
    maxAge: 0,
  });
}