'use server';

import { createClient } from '@supabase/supabase-js';
import { getSessionAction } from '@/app/actions/auth';

export async function getDashboardBusiness() {
  const session = await getSessionAction();
  if (!session) return null;

  const userId = (session as { id?: string }).id;
  if (!userId) return null;

  const supabaseAdmin = createClient<any>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  );

  const { data: business } = await supabaseAdmin
    .from('businesses')
    .select('id, name, slug, logo_url, color')
    .eq('owner_id', userId)
    .maybeSingle();

  return business;
}

export async function updateBusinessCardProps(businessId: string, color: string, logoUrl?: string) {
  const session = await getSessionAction();
  if (!session) return { error: 'No autorizado' };

  try {
    const supabaseAdmin = createClient<any>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
    );

    const updateData: Record<string, unknown> = { color };
    if (logoUrl !== undefined) {
      updateData.logo_url = logoUrl;
    }

    const { error } = await supabaseAdmin
      .from('businesses')
      .update(updateData)
      .eq('id', businessId);

    if (error) throw error;

    return { success: true };
  } catch (error: any) {
    return { error: error.message };
  }
}

export type ProgramSettings = {
  rewardProduct?: string;
  rewardVisits?: number;
  pointsPerPeso?: number;
  pesosPerPoint?: number;
};

export async function getProgramSettingsAction() {
  const session = await getSessionAction();
  if (!session) return null;

  const userId = (session as { id?: string }).id;
  if (!userId) return null;

  const supabaseAdmin = createClient<any>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  );

  const { data: business } = await supabaseAdmin
    .from('businesses')
    .select('id')
    .eq('owner_id', userId)
    .maybeSingle();

  if (!business) return null;

  const { data: rewards } = await supabaseAdmin
    .from('business_rewards_programs')
    .select('reward_product, reward_visits')
    .eq('business_id', business.id)
    .maybeSingle();

  const { data: points } = await supabaseAdmin
    .from('business_points_programs')
    .select('points_per_peso, pesos_per_point')
    .eq('business_id', business.id)
    .maybeSingle();

  return {
    rewardProduct: rewards?.reward_product ?? undefined,
    rewardVisits: rewards?.reward_visits ?? undefined,
    pointsPerPeso: points?.points_per_peso ?? undefined,
    pesosPerPoint: points?.pesos_per_point ?? undefined,
  } satisfies ProgramSettings;
}

export async function updateRewardsProgramAction(
  businessId: string,
  rewardProduct: string,
  rewardVisits: number,
) {
  const session = await getSessionAction();
  if (!session) return { error: 'No autorizado' };

  try {
    const supabaseAdmin = createClient<any>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
    );

    const { error } = await supabaseAdmin
      .from('business_rewards_programs')
      .upsert(
        [{
          business_id: businessId,
          reward_product: rewardProduct,
          reward_visits: rewardVisits,
        }],
        { onConflict: 'business_id' },
      );

    if (error) throw error;

    return { success: true };
  } catch (error: any) {
    console.error('Error updating rewards program:', error);
    return { error: error.message };
  }
}

export type StaffPerformanceRow = {
  name: string;
  stampsGiven: number;
  pointsGiven: number;
};

export type AdminIndicators = {
  totalStamps: number;
  totalPoints: number;
  rewardsClaimed: number;
  stampsCompleted: number;
  staff: StaffPerformanceRow[];
};

export async function getIndicatorsAction(): Promise<AdminIndicators | null> {
  const session = await getSessionAction();
  if (!session) return null;

  const userId = (session as { id?: string }).id;
  if (!userId) return null;

  const supabaseAdmin = createClient<any>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  );

  // Get admin's business
  const { data: business } = await supabaseAdmin
    .from('businesses')
    .select('id')
    .eq('owner_id', userId)
    .maybeSingle();

  if (!business) return null;

  const businessId = business.id;

  // Get all loyalty cards for this business
  const { data: cards } = await supabaseAdmin
    .from('loyalty_cards')
    .select('id')
    .eq('business_id', businessId);

  if (!cards || cards.length === 0) {
    return { totalStamps: 0, totalPoints: 0, rewardsClaimed: 0, stampsCompleted: 0, staff: [] };
  }

  const cardIds = cards.map((c: any) => c.id);

  // Fetch today's transactions for this business's cards
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const { data: transactions } = await supabaseAdmin
    .from('loyalty_card_transactions')
    .select('type, amount, processed_by, created_at')
    .in('loyalty_card_id', cardIds)
    .gte('created_at', today.toISOString());

  if (!transactions || transactions.length === 0) {
    return { totalStamps: 0, totalPoints: 0, rewardsClaimed: 0, stampsCompleted: 0, staff: [] };
  }

  // Aggregate indicators
  let totalStamps = 0;
  let totalPoints = 0;
  let rewardsClaimed = 0;
  let stampsCompleted = 0;

  const staffMap = new Map<string, { name: string; stampsGiven: number; pointsGiven: number }>();

  for (const tx of transactions) {
    const staffId: string = tx.processed_by;
    const amount = Number(tx.amount) || 0;

    if (tx.type === 'stamp_earned') {
      totalStamps += amount;
      const entry = staffMap.get(staffId) || { name: '', stampsGiven: 0, pointsGiven: 0 };
      entry.stampsGiven += amount;
      staffMap.set(staffId, entry);
    } else if (tx.type === 'points_earned') {
      totalPoints += amount;
      const entry = staffMap.get(staffId) || { name: '', stampsGiven: 0, pointsGiven: 0 };
      entry.pointsGiven += amount;
      staffMap.set(staffId, entry);
    } else if (tx.type === 'stamp_redeemed') {
      rewardsClaimed += 1;
      stampsCompleted += amount;
      const entry = staffMap.get(staffId) || { name: '', stampsGiven: 0, pointsGiven: 0 };
      entry.stampsGiven += amount;
      staffMap.set(staffId, entry);
    }
  }

  // Resolve staff names from profiles
  const staffIds = Array.from(staffMap.keys());
  const { data: profiles } = await supabaseAdmin
    .from('profiles')
    .select('id, name')
    .in('id', staffIds);

  const profileMap = new Map<string, string>();
  if (profiles) {
    for (const p of profiles) {
      profileMap.set(p.id, p.name);
    }
  }

  const staff: StaffPerformanceRow[] = Array.from(staffMap.entries())
    .map(([id, entry]) => ({
      name: profileMap.get(id) || 'Desconocido',
      stampsGiven: entry.stampsGiven,
      pointsGiven: entry.pointsGiven,
    }))
    .sort((a, b) => b.stampsGiven + b.pointsGiven - (a.stampsGiven + a.pointsGiven));

  return { totalStamps, totalPoints, rewardsClaimed, stampsCompleted, staff };
}
