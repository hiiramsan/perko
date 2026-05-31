import { NextResponse } from 'next/server';
import { createSupabaseAdminClient, setSessionCookie, signSessionToken } from '@/lib/server/auth-route-utils';
import bcrypt from 'bcrypt';
import { jwtVerify } from 'jose';
import crypto from 'crypto';

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET);

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const token = searchParams.get('token');
  
  if (!token) {
    return NextResponse.redirect(`${origin}/login?error=invalid-token`);
  }

  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    const { email, password, fullName, role } = payload as Record<string, string>;

    const supabaseAdmin = createSupabaseAdminClient();

    const hashedPassword = await bcrypt.hash(password, 12);

    const { data: newProfile, error: dbError } = await supabaseAdmin
      .from('profiles')
      .insert([
        { 
          id: crypto.randomUUID(),
          email, 
          name: fullName, 
          role: role,
          custom_password_hash: hashedPassword
        }
      ])
      .select()
      .single();

    if (dbError) {
      if (dbError.code === '23505') {
        return NextResponse.redirect(`${origin}/login?error=already-registered`);
      }
      console.error("Error inserting verified user", dbError);
      return NextResponse.redirect(`${origin}/login?error=db-error`);
    }

    const customSessionToken = await signSessionToken({
      id: newProfile.id,
      email: newProfile.email,
      role: newProfile.role,
      name: newProfile.name,
    });

    const targetUrl = role === 'admin' ? `${origin}/onboarding` : `${origin}/cartera`;
    const response = NextResponse.redirect(targetUrl);

    setSessionCookie(response, customSessionToken);

    return response;

  } catch (err) {
    console.error("Token verification failed", err);
    return NextResponse.redirect(`${origin}/login?error=expired-token`);
  }
}
