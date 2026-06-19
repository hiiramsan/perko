'use server';

import { createClient } from '@supabase/supabase-js';
import { getSessionAction } from '@/app/actions/auth';

function createAdminClient() {
  return createClient<any>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  );
}

export type ProgramSettings = {
  rewardProduct?: string;
  rewardVisits?: number;
  pesosForPoint?: number;
  pointToPesos?: number;
};

export async function getProgramSettingsAction() {
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

  const { data: rewards } = await supabaseAdmin
    .from('business_rewards_programs')
    .select('reward_product, reward_visits')
    .eq('business_id', business.id)
    .maybeSingle();

  const { data: points } = await supabaseAdmin
    .from('business_points_programs')
    .select('pesos_for_point, point_to_pesos')
    .eq('business_id', business.id)
    .maybeSingle();

  return {
    rewardProduct: rewards?.reward_product ?? undefined,
    rewardVisits: rewards?.reward_visits ?? undefined,
    pesosForPoint: points?.pesos_for_point ?? undefined,
    pointToPesos: points?.point_to_pesos ?? undefined,
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
    const supabaseAdmin = createAdminClient();

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

export async function updatePointsProgramAction(
  businessId: string,
  pesosForPoint: number,
  pointToPesos: number,
) {
  const session = await getSessionAction();
  if (!session) return { error: 'No autorizado' };

  try {
    const supabaseAdmin = createAdminClient();

    const { error } = await supabaseAdmin
      .from('business_points_programs')
      .upsert(
        [{
          business_id: businessId,
          pesos_for_point: pesosForPoint,
          point_to_pesos: pointToPesos,
        }],
        { onConflict: 'business_id' },
      );

    if (error) throw error;

    return { success: true };
  } catch (error: any) {
    console.error('Error updating points program:', error);
    return { error: error.message };
  }
}

export async function removeBusinessSystemAction(businessId: string, systemId: 'rewards' | 'points') {
  const session = await getSessionAction();
  if (!session) return { error: 'No autorizado' };

  try {
    const supabaseAdmin = createAdminClient();

    if (systemId === 'rewards') {
      const { error } = await supabaseAdmin
        .from('business_rewards_programs')
        .delete()
        .eq('business_id', businessId);
      if (error) throw error;
    } else if (systemId === 'points') {
      const { error } = await supabaseAdmin
        .from('business_points_programs')
        .delete()
        .eq('business_id', businessId);
      if (error) throw error;
    }

    return { success: true };
  } catch (error: any) {
    console.error('Error removing system:', error);
    return { error: error.message };
  }
}
