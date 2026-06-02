import { NextResponse, type NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createSupabaseAdminClient, setSessionCookie, signSessionToken } from '@/lib/server/auth-route-utils';

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
  const supabaseAdmin = createSupabaseAdminClient();

  const findProfileByEmail = (email: string) =>
    supabaseAdmin
      .from('profiles')
      .select('id, email, role, name')
      .eq('email', email)
      .maybeSingle();

  if (user) {
    let { data: profile } = await supabaseAdmin
      .from('profiles')
      .select('id, email, role, name')
      .eq('id', user.id)
      .maybeSingle();

    if (!profile && user.email) {
      const { data: profileByEmail } = await findProfileByEmail(user.email);
      profile = profileByEmail ?? null;
    }

    let currentRole = profile?.role;
    let isNewProfile = false;

    if (!profile) {
      currentRole = signupRole || 'customer';

      const { data: insertedProfile, error: insertError } = await supabaseAdmin
        .from('profiles')
        .insert([{
          id: user.id,
          email: user.email!,
          name: user.user_metadata?.full_name || 'Usuario de Google',
          role: currentRole,
          avatar_url: user.user_metadata?.avatar_url,
        }])
        .select('id, email, role, name')
        .single();

      if (insertError) {
        if (insertError.code === '23505' && user.email) {
          const { data: profileByEmail } = await findProfileByEmail(user.email);
          if (profileByEmail) {
            profile = profileByEmail;
            currentRole = profile.role;
          } else {
            return NextResponse.redirect(`${origin}/login?error=db-error`);
          }
        } else {
          return NextResponse.redirect(`${origin}/login?error=db-error`);
        }
      } else {
        profile = insertedProfile;
        isNewProfile = true;
      }
    }

    if (!profile) {
      return NextResponse.redirect(`${origin}/login?error=unknown`);
    }

    if (!currentRole) {
      currentRole = 'customer';
    }

    if (signupRole === 'admin') {
      currentRole = 'admin';

      if (profile.role !== 'admin') {
        await supabaseAdmin
          .from('profiles')
          .update({ role: 'admin' })
          .eq('id', profile.id);
        profile.role = 'admin';
      }
    }

    const customSessionToken = await signSessionToken({
      id: profile.id,
      email: profile.email,
      role: currentRole,
      name: profile.name,
    });

    const needsOnboarding = signupRole === 'admin' || (isNewProfile && currentRole === 'admin');
    const targetUrl = needsOnboarding
      ? `${origin}/onboarding`
      : currentRole === 'customer' ? `${origin}/cartera` : `${origin}/dashboard`;

    const response = NextResponse.redirect(targetUrl);
    setSessionCookie(response, customSessionToken);
    if (signupRoleCookie) {
      response.cookies.set('perko_signup_role', '', { maxAge: 0, path: '/' });
    }

    return response;
  }

  return NextResponse.redirect(`${origin}/login?error=unknown`);
}
