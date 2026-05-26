import { NextResponse, type NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { SignJWT } from 'jose';

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET);

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const signupRoleCookie = request.cookies.get('perko_signup_role')?.value;
  const signupRole = signupRoleCookie === 'admin' ? 'admin' : signupRoleCookie === 'customer' ? 'customer' : null;

  if (!code) return NextResponse.redirect(`${origin}/login?error=no-code`);

  const supabase = await createClient();
  const { error } = await supabase.auth.exchangeCodeForSession(code);
  
  if (error) return NextResponse.redirect(`${origin}/login?error=auth-failed`);

  const { data: { user } } = await supabase.auth.getUser();

  if (user) {
    let { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).maybeSingle();

    // (Identity bridging logic remains identical here if needed...)

    let currentRole = profile?.role;
    let isNewProfile = false;
    if (!currentRole) {
      currentRole = signupRole || 'customer';
      const { data: newProfile } = await supabase
        .from('profiles')
        .insert([{
          id: user.id,
          email: user.email!,
          name: user.user_metadata?.full_name || 'Usuario de Google',
          role: currentRole,
          avatar_url: user.user_metadata?.avatar_url
        }])
        .select().single();
      profile = newProfile;
      isNewProfile = true;
    }

    // --- YOUR CUSTOM SESSION GENERATION LAYER ---
    // Create a custom session token valid for 7 days
    const customSessionToken = await new SignJWT({ 
        id: profile.id, 
        email: profile.email, 
        role: profile.role,
        name: profile.name 
      })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('7d')
      .sign(JWT_SECRET);

    // Create the redirect response
    let targetUrl = currentRole === 'customer' ? `${origin}/cartera` : `${origin}/dashboard`;
    if (isNewProfile && currentRole === 'admin') {
      targetUrl = `${origin}/onboarding`;
    }

    return createSessionResponse(targetUrl, customSessionToken, signupRoleCookie ? 'perko_signup_role' : null);
  }

  return NextResponse.redirect(`${origin}/login?error=unknown`);
}

// Helper to set the custom secure cookie on redirect
function createSessionResponse(url: string, token: string, signupCookieName: string | null) {
  const response = NextResponse.redirect(url);
  response.cookies.set('perko_session', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: '/',
  });
  if (signupCookieName) {
    response.cookies.set(signupCookieName, '', { maxAge: 0, path: '/' });
  }
  return response;
}