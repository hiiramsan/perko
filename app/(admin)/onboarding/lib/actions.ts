'use server';

import { createClient as createSupabaseClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET);

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
  // 1. Obtener al usuario desde la cookie custom en lugar de Supabase Auth
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get('perko_session')?.value;

  if (!sessionToken) {
    return { error: 'No autorizado. Debes iniciar sesión primero.' };
  }

  let userPayload;
  try {
    const { payload } = await jwtVerify(sessionToken, JWT_SECRET);
    userPayload = payload as { id: string; email: string; role: string };
  } catch (err) {
    return { error: 'Sesión inválida o expirada.' };
  }

  // 2. Usar Admin Client para saltar RLS ya que la sesión custom no usa tokens nativos de Supabase
  const supabaseAdmin = createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { data: existingBusiness, error: fetchError } = await supabaseAdmin
    .from('businesses')
    .select('id')
    .eq('owner_id', userPayload.id)
    .maybeSingle();

  if (fetchError) {
    console.error('Error de Supabase al buscar empresa:', fetchError.message);
    return { error: `Error en BD al buscar negocio: ${fetchError.message}` };
  }

  let businessId = existingBusiness?.id as string | undefined;

  if (!businessId) {
    const { data: newBusiness, error: insertError } = await supabaseAdmin
      .from('businesses')
      .insert([
        {
          name: data.name,
          slug: data.slug,
          logo_url: data.logoUrl || null,
          color: data.color || null,
          owner_id: userPayload.id,
        },
      ])
      .select('id')
      .single();

    if (insertError) {
      console.error('Error de Supabase al insertar empresa:', insertError.message);
      return { error: `Error en BD al crear negocio: ${insertError.message}` };
    }

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

    if (updateError) {
      console.error('Error de Supabase al actualizar empresa:', updateError.message);
      return { error: `Error en BD al actualizar negocio: ${updateError.message}` };
    }
  }

  // 3. Insertar configuraciones satélite
  if (data.selectedSystems.includes('rewards')) {
    const { error: rewardsError } = await supabaseAdmin
      .from('business_rewards_programs')
      .upsert([
        {
          business_id: businessId,
          reward_product: data.rewardProduct,
          reward_visits: data.rewardVisits,
        },
      ], { onConflict: 'business_id' });

    if (rewardsError) {
      console.error(rewardsError);
      return { error: `Falló la configuración de recompensas: ${rewardsError.message}` };
    }
  } else {
    await supabaseAdmin
      .from('business_rewards_programs')
      .delete()
      .eq('business_id', businessId);
  }

  if (data.selectedSystems.includes('points')) {
    const { error: pointsError } = await supabaseAdmin
      .from('business_points_programs')
      .upsert([
        {
          business_id: businessId,
          points_per_peso: data.pointsPerPeso,
          pesos_per_point: data.pesosPerPoint,
        },
      ], { onConflict: 'business_id' });

    if (pointsError) {
      console.error(pointsError);
      return { error: `Falló la configuración de puntos: ${pointsError.message}` };
    }
  } else {
    await supabaseAdmin
      .from('business_points_programs')
      .delete()
      .eq('business_id', businessId);
  }

  return { success: true, business: { id: businessId } };
}