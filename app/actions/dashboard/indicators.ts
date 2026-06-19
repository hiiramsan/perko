'use server';

import { createClient } from '@supabase/supabase-js';
import { getSessionAction } from '@/app/actions/auth';

function createAdminClient() {
  return createClient<any>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  );
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

  const supabaseAdmin = createAdminClient();

  const { data: business } = await supabaseAdmin
    .from('businesses')
    .select('id')
    .eq('owner_id', userId)
    .maybeSingle();

  if (!business) return null;

  const businessId = business.id;

  const { data: cards } = await supabaseAdmin
    .from('loyalty_cards')
    .select('id')
    .eq('business_id', businessId);

  if (!cards || cards.length === 0) {
    return { totalStamps: 0, totalPoints: 0, rewardsClaimed: 0, stampsCompleted: 0, staff: [] };
  }

  const cardIds = cards.map((c: any) => c.id);

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
