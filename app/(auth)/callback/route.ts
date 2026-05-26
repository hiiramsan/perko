import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { SignJWT } from 'jose';

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET);

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const flow = searchParams.get('flow');

  if (!code) return NextResponse.redirect(`${origin}/login?error=no-code`);

  const supabase = await createClient();
  const { error } = await supabase.auth.exchangeCodeForSession(code);
  
  if (error) return NextResponse.redirect(`${origin}/login?error=auth-failed`);

  const { data: { user } } = await supabase.auth.getUser();

  if (user) {
    let { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).maybeSingle();

    // (Identity bridging logic remains identical here if needed...)

    let currentRole = profile?.role;
    if (!currentRole) {
      currentRole = flow === 'owner' ? 'admin' : 'customer';
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
    const targetUrl = currentRole === 'customer' ? `${origin}/cartera` : `${origin}/onboarding`;
    
    // Check if business exists for admin
    if (currentRole === 'admin') {
      const { data: business } = await supabase.from('businesses').select('id').eq('owner_id', user.id).maybeSingle();
      if (business) {
        return createSessionResponse(`${origin}/dashboard`, customSessionToken);
      }
    }

    return createSessionResponse(targetUrl, customSessionToken);
  }

  return NextResponse.redirect(`${origin}/login?error=unknown`);
}

// Helper to set the custom secure cookie on redirect
function createSessionResponse(url: string, token: string) {
  const response = NextResponse.redirect(url);
  response.cookies.set('perko_session', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: '/',
  });
  return response;
}