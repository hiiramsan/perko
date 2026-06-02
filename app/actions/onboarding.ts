'use server';

import { createClient } from '@supabase/supabase-js';
import { getSessionAction } from '@/app/actions/auth';

export type OnboardingData = {
  name?: string;
  slug?: string;
  logoUrl?: string;
  color?: string;
  selectedSystems?: string[];
  rewardProduct?: string;
  rewardVisits?: number;
  pointsPerPeso?: number;
  pesosPerPoint?: number;
};

function buildBusinessUpdate(stepData?: OnboardingData) {
  const update: Record<string, unknown> = {};
  if (stepData?.name) update.name = stepData.name;
  if (stepData?.slug) update.slug = stepData.slug;
  if (stepData?.logoUrl) update.logo_url = stepData.logoUrl;
  if (stepData?.color) update.color = stepData.color;
  return update;
}

async function upsertPrograms(
  supabase: ReturnType<typeof createClient<any>>,
  businessId: string,
  stepData?: OnboardingData,
) {
  if (!stepData?.selectedSystems?.length) return;

  const hasRewards = stepData.selectedSystems.includes('rewards');
  const hasPoints = stepData.selectedSystems.includes('points');

  if (hasRewards && stepData.rewardProduct && (stepData.rewardVisits ?? 0) > 0) {
    await supabase
      .from('business_rewards_programs')
      .upsert(
        [{
          business_id: businessId,
          reward_product: stepData.rewardProduct,
          reward_visits: stepData.rewardVisits ?? 0,
        }],
        { onConflict: 'business_id' },
      );
  }

  if (!hasRewards) {
    await supabase
      .from('business_rewards_programs')
      .delete()
      .eq('business_id', businessId);
  }

  if (hasPoints && (stepData.pointsPerPeso ?? 0) > 0 && (stepData.pesosPerPoint ?? 0) > 0) {
    await supabase
      .from('business_points_programs')
      .upsert(
        [{
          business_id: businessId,
          points_per_peso: stepData.pointsPerPeso ?? 0,
          pesos_per_point: stepData.pesosPerPoint ?? 0,
        }],
        { onConflict: 'business_id' },
      );
  }

  if (!hasPoints) {
    await supabase
      .from('business_points_programs')
      .delete()
      .eq('business_id', businessId);
  }
}

export async function saveOnboardingStepAction(
  step: number,
  stepData?: OnboardingData,
  completed?: boolean,
) {
  const session = await getSessionAction();
  if (!session) return { success: false, error: 'Unauthorized' };

  const userId = (session as { id?: string }).id;
  if (!userId) return { success: false, error: 'Unauthorized' };

  if (!step || step < 1) return { success: false, error: 'Invalid step' };

  const supabase = createClient<any>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  );

  const { data: business } = await supabase
    .from('businesses')
    .select('id')
    .eq('owner_id', userId)
    .maybeSingle();

  const onboardingUpdate = {
    onboarding_step: step,
    onboarding_status: completed ? 'completed' : 'in_progress',
    onboarding_completed_at: completed ? new Date().toISOString() : null,
    ...buildBusinessUpdate(stepData),
  };

  let businessId = business?.id;

  if (!businessId) {
    const { data: inserted, error: insertError } = await supabase
      .from('businesses')
      .insert([{ owner_id: userId, logo_url: stepData?.logoUrl ?? '', ...onboardingUpdate }])
      .select('id')
      .single();

    if (insertError) return { success: false, error: insertError.message };
    businessId = inserted.id;
  } else {
    const { error: updateError } = await supabase
      .from('businesses')
      .update(onboardingUpdate)
      .eq('id', businessId);

    if (updateError) return { success: false, error: updateError.message };
  }

  await upsertPrograms(supabase, businessId, stepData);

  return { success: true, completed: Boolean(completed) };
}

type CreateBusinessInput = {
  name: string;
  slug: string;
  logoUrl?: string;
  color?: string;
  selectedSystems: string[];
  rewardProduct: string;
  rewardVisits: number;
  pointsPerPeso: number;
  pesosPerPoint: number;
};

export async function createBusinessAction(data: CreateBusinessInput) {
  const session = await getSessionAction();
  if (!session) return { error: 'No autorizado. Debes iniciar sesion primero.' };

  const userId = (session as { id?: string }).id;
  if (!userId) return { error: 'No autorizado. Debes iniciar sesion primero.' };

  const supabaseAdmin = createClient<any>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  );

  const { data: existingBusiness } = await supabaseAdmin
    .from('businesses')
    .select('id')
    .eq('owner_id', userId)
    .maybeSingle();

  let businessId = existingBusiness?.id;

  if (!businessId) {
    const { data: newBusiness, error: insertError } = await supabaseAdmin
      .from('businesses')
      .insert([{
        name: data.name,
        slug: data.slug,
        logo_url: data.logoUrl || null,
        color: data.color || null,
        owner_id: userId,
      }])
      .select('id')
      .single();

    if (insertError) return { error: `Error en BD al crear negocio: ${insertError.message}` };
    businessId = newBusiness.id;
  } else {
    const { error: updateError } = await supabaseAdmin
      .from('businesses')
      .update({
        name: data.name,
        slug: data.slug,
        logo_url: data.logoUrl || null,
        color: data.color || null,
      })
      .eq('id', businessId);

    if (updateError) return { error: `Error en BD al actualizar negocio: ${updateError.message}` };
  }

  if (data.selectedSystems.includes('rewards')) {
    const { error: rewardsError } = await supabaseAdmin
      .from('business_rewards_programs')
      .upsert([{
        business_id: businessId,
        reward_product: data.rewardProduct,
        reward_visits: data.rewardVisits,
      }], { onConflict: 'business_id' });

    if (rewardsError) return { error: `Fallo la configuracion de recompensas: ${rewardsError.message}` };
  } else {
    await supabaseAdmin.from('business_rewards_programs').delete().eq('business_id', businessId);
  }

  if (data.selectedSystems.includes('points')) {
    const { error: pointsError } = await supabaseAdmin
      .from('business_points_programs')
      .upsert([{
        business_id: businessId,
        points_per_peso: data.pointsPerPeso,
        pesos_per_point: data.pesosPerPoint,
      }], { onConflict: 'business_id' });

    if (pointsError) return { error: `Fallo la configuracion de puntos: ${pointsError.message}` };
  } else {
    await supabaseAdmin.from('business_points_programs').delete().eq('business_id', businessId);
  }

  return { success: true, business: { id: businessId } };
}

export type OnboardingSnapshot = {
  status: 'not_started' | 'in_progress' | 'completed';
  step: number;
  data?: OnboardingData;
};

export async function loadOnboardingSnapshot() {
  const session = await getSessionAction();
  if (!session) return null;

  const userId = (session as { id?: string }).id;
  if (!userId) return null;

  const supabase = createClient<any>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  );

  const { data: business } = await supabase
    .from('businesses')
    .select('id, name, slug, logo_url, color, onboarding_status, onboarding_step')
    .eq('owner_id', userId)
    .maybeSingle();

  if (!business) {
    return { status: 'not_started' as const, step: 1, data: {} };
  }

  const selectedSystems: string[] = [];

  const { data: rewardsProgram } = await supabase
    .from('business_rewards_programs')
    .select('reward_product, reward_visits')
    .eq('business_id', business.id)
    .maybeSingle();

  if (rewardsProgram) selectedSystems.push('rewards');

  const { data: pointsProgram } = await supabase
    .from('business_points_programs')
    .select('points_per_peso, pesos_per_point')
    .eq('business_id', business.id)
    .maybeSingle();

  if (pointsProgram) selectedSystems.push('points');

  return {
    status: business.onboarding_status ?? 'not_started',
    step: business.onboarding_step ?? 1,
    data: {
      name: business.name ?? undefined,
      slug: business.slug ?? undefined,
      logoUrl: business.logo_url ?? undefined,
      color: business.color ?? undefined,
      selectedSystems,
      rewardProduct: rewardsProgram?.reward_product ?? undefined,
      rewardVisits: rewardsProgram?.reward_visits ?? undefined,
      pointsPerPeso: pointsProgram?.points_per_peso ?? undefined,
      pesosPerPoint: pointsProgram?.pesos_per_point ?? undefined,
    },
  } satisfies OnboardingSnapshot;
}
