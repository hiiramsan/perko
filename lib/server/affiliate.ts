// lib/server/affiliate.ts
import { createSupabaseAdminClient } from '@/lib/server/auth-route-utils';

export async function autoAffiliateCustomer(
  supabaseAdmin: ReturnType<typeof createSupabaseAdminClient>,
  customerId: string,
  businessSlug: string,
) {
  if (!businessSlug) return;
  try {
    const { data: business } = await supabaseAdmin
      .from('businesses')
      .select('id')
      .eq('slug', businessSlug)
      .maybeSingle();

    if (!business) return;

    const { data: card, error: cardError } = await supabaseAdmin
      .from('loyalty_cards')
      .insert([{ customer_id: customerId, business_id: business.id, status: 'active' }])
      .select('id')
      .maybeSingle();

    if (cardError || !card) return;

    await supabaseAdmin
      .from('customer_rewards_balances')
      .insert([{ loyalty_card_id: card.id, current_stamps: 0, total_accumulated_stamps: 0 }]);

    await supabaseAdmin
      .from('customer_points_balances')
      .insert([{ loyalty_card_id: card.id, current_points: 0.00, total_earned_points: 0.00 }]);
  } catch (err) {
    console.error('autoAffiliateCustomer error:', err);
  }
}