import { NextResponse, type NextRequest } from 'next/server';
import { createSupabaseAdminClient, setSessionCookie, signSessionToken } from '@/lib/server/auth-route-utils';
import bcrypt from 'bcrypt';
import { jwtVerify } from 'jose';
import crypto from 'crypto';

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET);

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

    // Si ya existía o da error, salimos sutilmente para no romper el inicio de sesión
    if (cardError || !card) return;

    // 3. Inicializamos los balances de las tablas satélites en 0 de forma limpia
    await supabaseAdmin
      .from('customer_rewards_balances')
      .insert([{ loyalty_card_id: card.id, current_stamps: 0, total_accumulated_stamps: 0 }]);

    await supabaseAdmin
      .from('customer_points_balances')
      .insert([{ loyalty_card_id: card.id, current_points: 0.00, total_earned_points: 0.00 }]);

  } catch (err) {
    console.error('Error crítico en autoAffiliateCustomer (Tradicional):', err);
  }
}

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const token = searchParams.get('token');
  
  const joinBusinessSlug = request.cookies.get('perko_join_business_slug')?.value;
  
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

    // ⚡ AFILIACIÓN TRADICIONAL: Si el usuario verificado es un cliente y viene de escanear el QR
    if (role === 'customer' && joinBusinessSlug) {
      await autoAffiliateCustomer(supabaseAdmin, newProfile.id, joinBusinessSlug);
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

    if (joinBusinessSlug) {
      response.cookies.set('perko_join_business_slug', '', { maxAge: 0, path: '/' });
    }

    return response;

  } catch (err) {
    console.error("Token verification failed", err);
    return NextResponse.redirect(`${origin}/login?error=expired-token`);
  }
}