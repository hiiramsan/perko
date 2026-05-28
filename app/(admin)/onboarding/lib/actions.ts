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

  // Insertar la empresa
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
    .select()
    .single();

  if (insertError) {
    console.error('Error de Supabase al insertar empresa:', insertError.message);
    return { error: `Error en BD al crear negocio: ${insertError.message}` };
  }

  // 3. Insertar configuraciones satélite
	if (data.selectedSystems.includes('rewards')) {
		const { error: rewardsError } = await supabaseAdmin
			.from('business_rewards_programs')
			.insert([
				{
					business_id: newBusiness.id,
					reward_product: data.rewardProduct,
					reward_visits: data.rewardVisits
				}
			]);

		if (rewardsError) {
			console.error(rewardsError);
			return { error: `Falló la configuración de recompensas: ${rewardsError.message}` };
		}
	}

	if (data.selectedSystems.includes('points')) {
		const { error: pointsError } = await supabaseAdmin
			.from('business_points_programs')
			.insert([
				{
					business_id: newBusiness.id,
					points_per_peso: data.pointsPerPeso,
					pesos_per_point: data.pesosPerPoint
				}
			]);

		if (pointsError) {
			console.error(pointsError);
			return { error: `Falló la configuración de puntos: ${pointsError.message}` };
		}
	}

  return { success: true, business: newBusiness };
}