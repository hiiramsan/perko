'use server';

import { createSupabaseAdminClient } from '@/lib/server/auth-route-utils'; // 🔗 Reusamos tu helper estándar
import { getSessionAction } from '@/app/actions/auth';

export type OnboardingData = {
  name?: string;
  slug?: string;
  logoUrl?: string;
  color?: string;
  selectedSystems?: string[];
  rewardProduct?: string;
  rewardVisits?: number;
  pesosForPoint?: number;
  pointToPesos?: number;
};

export type OnboardingSnapshot = {
  status: 'not_started' | 'in_progress' | 'completed';
  step: number;
  data?: OnboardingData;
};

// Helper interno para mapear solo los campos que mutan en el negocio
function buildBusinessUpdate(stepData?: OnboardingData) {
  const update: Record<string, unknown> = {};
  if (stepData?.name) update.name = stepData.name;
  if (stepData?.slug) update.slug = stepData.slug;
  if (stepData?.logoUrl) update.logo_url = stepData.logoUrl;
  if (stepData?.color) update.color = stepData.color;
  return update;
}

// Helper interno para sincronizar los programas de recompensas de forma atómica
async function upsertPrograms(supabase: any, businessId: string, stepData?: OnboardingData) {
  if (!stepData?.selectedSystems?.length) return;

  const hasRewards = stepData.selectedSystems.includes('rewards');
  const hasPoints = stepData.selectedSystems.includes('points');

  if (hasRewards && stepData.rewardProduct && (stepData.rewardVisits ?? 0) > 0) {
    const { error: upsertError } = await supabase
      .from('business_rewards_programs')
      .upsert(
        [{
          business_id: businessId,
          reward_product: stepData.rewardProduct,
          reward_visits: stepData.rewardVisits ?? 0,
        }],
        { onConflict: 'business_id' }
      );
    if (upsertError) console.error('Error upserting rewards program:', upsertError);
  } else if (!hasRewards) {
    const { error: deleteError } = await supabase
      .from('business_rewards_programs')
      .delete()
      .eq('business_id', businessId);
    if (deleteError) console.error('Error deleting rewards program:', deleteError);
  }

  if (hasPoints && (stepData.pesosForPoint ?? 0) > 0 && (stepData.pointToPesos ?? 0) > 0) {
    const { error: upsertError } = await supabase
      .from('business_points_programs')
      .upsert(
        [{
          business_id: businessId,
          pesos_for_point: stepData.pesosForPoint ?? 0,
          point_to_pesos: stepData.pointToPesos ?? 0,
        }],
        { onConflict: 'business_id' }
      );
    if (upsertError) console.error('Error upserting points program:', upsertError);
  } else if (!hasPoints) {
    const { error: deleteError } = await supabase
      .from('business_points_programs')
      .delete()
      .eq('business_id', businessId);
    if (deleteError) console.error('Error deleting points program:', deleteError);
  }
}

export async function saveOnboardingStepAction(step: number, stepData?: OnboardingData, completed?: boolean) {
  const session = await getSessionAction();
  if (!session) return { success: false, error: 'No autorizado' };

  const userId = (session as { id?: string }).id;
  if (!userId) return { success: false, error: 'No autorizado' };
  if (!step || step < 1) return { success: false, error: 'Paso inválido' };

  try {
    const supabaseAdmin = createSupabaseAdminClient(); // 👤 Usamos el cliente admin centralizado

    // Verificamos si la empresa ya fue creada en algún paso previo
    const { data: business } = await supabaseAdmin
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

    // Si no existe, hacemos INSERT; si existe, hacemos UPDATE
    if (!businessId) {
      const { data: inserted, error: insertError } = await supabaseAdmin
        .from('businesses')
        .insert([{ owner_id: userId, logo_url: stepData?.logoUrl ?? '', ...onboardingUpdate }])
        .select('id')
        .single();

      if (insertError) return { success: false, error: insertError.message };
      businessId = inserted.id;
    } else {
      const { error: updateError } = await supabaseAdmin
        .from('businesses')
        .update(onboardingUpdate)
        .eq('id', businessId);

      if (updateError) return { success: false, error: updateError.message };
    }

    // Sincronizamos las tablas hijas de configuración
    await upsertPrograms(supabaseAdmin, businessId, stepData);

    return { success: true, completed: Boolean(completed) };
  } catch (err: any) {
    console.error('Error al guardar paso de onboarding:', err?.message || err, { step, completed, hasLogo: !!stepData?.logoUrl, systems: stepData?.selectedSystems });
    return { success: false, error: err?.message || 'Error interno del servidor.' };
  }
}

/**
 * ACCIÓN: Recuperar el estado actual del Onboarding
 */
export async function loadOnboardingSnapshot() {
  const session = await getSessionAction();
  if (!session) return null;

  const userId = (session as { id?: string }).id;
  if (!userId) return null;

  try {
    const supabaseAdmin = createSupabaseAdminClient();

    const { data: business } = await supabaseAdmin
      .from('businesses')
      .select('id, name, slug, logo_url, color, onboarding_status, onboarding_step')
      .eq('owner_id', userId)
      .maybeSingle();

    if (!business) {
      return { status: 'not_started' as const, step: 1, data: {} };
    }

    const selectedSystems: string[] = [];

    const { data: rewardsProgram } = await supabaseAdmin
      .from('business_rewards_programs')
      .select('reward_product, reward_visits')
      .eq('business_id', business.id)
      .maybeSingle();

    if (rewardsProgram) selectedSystems.push('rewards');

    const { data: pointsProgram } = await supabaseAdmin
      .from('business_points_programs')
      .select('pesos_for_point, point_to_pesos')
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
        pesosForPoint: pointsProgram?.pesos_for_point ?? undefined,
        pointToPesos: pointsProgram?.point_to_pesos ?? undefined,
      },
    } satisfies OnboardingSnapshot;
  } catch (error) {
    console.error('Error al cargar el snapshot del onboarding:', error);
    return null;
  }
}