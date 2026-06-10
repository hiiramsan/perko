import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';
import { createSupabaseAdminClient } from '@/lib/server/auth-route-utils';

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET);

async function affiliateCustomer(
  supabaseAdmin: ReturnType<typeof createSupabaseAdminClient>,
  customerId: string,
  businessSlug: string,
) {
  const { data: business } = await supabaseAdmin
    .from('businesses')
    .select('id')
    .eq('slug', businessSlug)
    .maybeSingle();

  if (!business) return { error: 'Business not found' };

  // Upsert-safe: if the card already exists this insert will fail silently
  const { data: card, error: cardError } = await supabaseAdmin
    .from('loyalty_cards')
    .insert([{ customer_id: customerId, business_id: business.id, status: 'active' }])
    .select('id')
    .maybeSingle();

  // Already affiliated — not an error, just nothing to do
  if (cardError?.code === '23505' || !card) return { alreadyAffiliated: true };

  await supabaseAdmin
    .from('customer_rewards_balances')
    .insert([{ loyalty_card_id: card.id, current_stamps: 0, total_accumulated_stamps: 0 }]);

  await supabaseAdmin
    .from('customer_points_balances')
    .insert([{ loyalty_card_id: card.id, current_points: 0.00, total_earned_points: 0.00 }]);

  return { success: true };
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { origin } = new URL(request.url);
  const { slug } = await params;

  const sessionToken = request.cookies.get('perko_session')?.value;

  console.log('slug', slug)

  if (!sessionToken) {
    // No session — send them to register with the slug cookie already set
    return NextResponse.redirect(`${origin}/register?role=customer`);
  }

  let userPayload: { id: string; role: string };
  try {
    const { payload } = await jwtVerify(sessionToken, JWT_SECRET);
    userPayload = payload as { id: string; role: string };
  } catch {
    return NextResponse.redirect(`${origin}/login?error=session-expired`);
  }

  // Only customers get loyalty cards
  if (userPayload.role !== 'customer') {
    return NextResponse.redirect(`${origin}/dashboard`);
  }

  const supabaseAdmin = createSupabaseAdminClient();
  await affiliateCustomer(supabaseAdmin, userPayload.id, slug);

  // Clear the slug cookie and send them to their wallet
  const response = NextResponse.redirect(`${origin}/cartera?joined=${slug}`);
  response.cookies.set('perko_join_business_slug', '', { maxAge: 0, path: '/' });
  return response;
}