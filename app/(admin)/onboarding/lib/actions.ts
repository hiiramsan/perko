'use server';

import { createClient } from '@/lib/supabase/server';

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
  const supabase = await createClient();

  // Obtener al usuario autenticado desde el servidor
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    return { error: 'No autorizado. Debes iniciar sesión primero.' };
  }

  // Insertar la empresa inyectando el UUID del usuario como owner_id
  const { data: newBusiness, error: insertError } = await supabase
    .from('businesses')
    .insert([
      {
        name: data.name,
        slug: data.slug,
        logo_url: data.logoUrl || null,
        color: data.color || null,
        owner_id: user.id,
      },
    ])
    .select()
    .single();

  if (insertError) {
    console.error('Error de Supabase al insertar empresa:', insertError.message);
    return { error: 'No se pudo crear el negocio. El slug podría estar duplicado.' };
  }

  // 3. Insertar configuraciones satélite basadas en la selección del onboarding
	
	// ¿Activó recompensas por visitas?
	if (data.selectedSystems.includes('rewards')) {
		const { error: rewardsError } = await supabase
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
			return { error: 'Negocio creado, pero falló la configuración del sistema de visitas.' };
		}
	}

	// ¿Activó puntos por compra?
	if (data.selectedSystems.includes('points')) {
		const { error: pointsError } = await supabase
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
			return { error: 'Negocio creado, pero falló la configuración del sistema de puntos.' };
		}
	}

  return { success: true, business: newBusiness };
}