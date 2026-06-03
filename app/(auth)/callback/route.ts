import { NextResponse, type NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createSupabaseAdminClient, setSessionCookie, signSessionToken } from '@/lib/server/auth-route-utils';

// Afiliación automática al negocio del QR e inicialización de sistemas de fidelización asociados
async function autoAffiliateCustomer(supabaseAdmin: any, customerId: string, businessSlug: string) {
  if (!businessSlug) return;
  try {
    // 1. Buscamos el ID real del negocio por medio de su slug único
    const { data: business } = await supabaseAdmin
      .from('businesses')
      .select('id')
      .eq('slug', businessSlug)
      .maybeSingle();

    if (!business) return;

    // 2. Insertamos la membresía central en loyalty_cards
    const { data: card, error: cardError } = await supabaseAdmin
      .from('loyalty_cards')
      .insert([{
        customer_id: customerId,
        business_id: business.id,
        status: 'active'
      }])
      .select('id')
      .maybeSingle();

    if (cardError || !card) return;

    // 3. Inicializamos los balances de las tablas satélites en 0 de forma limpia
    await supabaseAdmin
      .from('customer_rewards_balances')
      .insert([{ loyalty_card_id: card.id, current_stamps: 0, total_accumulated_stamps: 0 }]);

    await supabaseAdmin
      .from('customer_points_balances')
      .insert([{ loyalty_card_id: card.id, current_points: 0.00, total_earned_points: 0.00 }]);

  } catch (err) {
    console.error('Error crítico en autoAffiliateCustomer (Google):', err);
  }
}

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  
  const signupRoleCookie = request.cookies.get('perko_signup_role')?.value;
  const signupRole = signupRoleCookie === 'admin' ? 'admin' : signupRoleCookie === 'customer' ? 'customer' : null;
  
  // Capturamos la cookie del mostrador escaneado
  const joinBusinessSlug = request.cookies.get('perko_join_business_slug')?.value;

  if (!code) return NextResponse.redirect(`${origin}/login?error=no-code`);

  const supabase = await createClient();
  const { error } = await supabase.auth.exchangeCodeForSession(code);
  
  if (error) return NextResponse.redirect(`${origin}/login?error=auth-failed`);

  const { data: { user } } = await supabase.auth.getUser();
  const supabaseAdmin = createSupabaseAdminClient();

  if (user) {
    let { data: profile } = await supabaseAdmin
      .from('profiles')
      .select('id, email, role, name')
      .eq('id', user.id)
      .maybeSingle();

    if (!profile && user.email) {
      const { data: profileByEmail } = await supabaseAdmin
        .from('profiles')
        .select('id, email, role, name')
        .eq('email', user.email)
        .maybeSingle();

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
          const { data: profileByEmail } = await supabaseAdmin
            .from('profiles')
            .select('id, email, role, name')
            .eq('email', user.email)
            .maybeSingle();

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

    if (currentRole === 'customer' && joinBusinessSlug) {
      await autoAffiliateCustomer(supabaseAdmin, profile.id, joinBusinessSlug);
    }

    const customSessionToken = await signSessionToken({
      id: profile.id,
      email: profile.email,
      role: currentRole,
      name: profile.name,
    });

    let targetUrl = currentRole === 'customer' ? `${origin}/cartera` : `${origin}/dashboard`;
    if (signupRole === 'admin' || (isNewProfile && currentRole === 'admin')) {
      targetUrl = `${origin}/onboarding`;
    }

    const response = NextResponse.redirect(targetUrl);
    setSessionCookie(response, customSessionToken);
    
    if (signupRoleCookie) {
      response.cookies.set('perko_signup_role', '', { maxAge: 0, path: '/' });
    }
    if (joinBusinessSlug) {
      response.cookies.set('perko_join_business_slug', '', { maxAge: 0, path: '/' });
    }

    return response;
  }

  return NextResponse.redirect(`${origin}/login?error=unknown`);
}