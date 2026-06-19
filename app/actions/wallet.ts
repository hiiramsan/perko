'use server';

import { createSupabaseAdminClient } from '@/lib/server/auth-route-utils';
import { getSessionAction } from '@/app/actions/auth';

export type WalletCardData = {
  id: string;
  businessName: string;
  linkLabel: string;
  href: string;
  logoSrc: string;
  cardColor: string;
  rewardText: string;
  cardCode: string;
  qrValue: string;
  programType: 'rewards' | 'points';
  stampsFilled: number;
  maxStamps: number;
  currentPoints: number;
};

export async function getCustomerWalletAction() {
  const session = await getSessionAction();
  if (!session) return { success: false, error: 'No autorizado' };

  const userId = (session as { id?: string }).id;
  if (!userId) return { success: false, error: 'No autorizado' };

  try {
    const supabaseAdmin = createSupabaseAdminClient();

    // 1. Obtener los índices de membresía del cliente actual
    const { data: cards, error: cardsError } = await supabaseAdmin
      .from('loyalty_cards')
      .select('id, business_id, status')
      .eq('customer_id', userId)
      .eq('status', 'active');

    if (cardsError) throw cardsError;
    if (!cards || cards.length === 0) return { success: true, cards: [] };

    const formattedCards: WalletCardData[] = [];

    for (const card of cards) {
      // 2. Obtener metadatos visuales de la empresa
      const { data: business } = await supabaseAdmin
        .from('businesses')
        .select('name, logo_url, color, slug')
        .eq('id', card.business_id)
        .maybeSingle();

      if (!business) continue;

      // 3. Consultar qué programa está activo para saber el tipo (Timbres vs Puntos)
      const { data: rewardsProg } = await supabaseAdmin
        .from('business_rewards_programs')
        .select('reward_product, reward_visits')
        .eq('business_id', card.business_id)
        .maybeSingle();

      const { data: pointsProg } = await supabaseAdmin
        .from('business_points_programs')
        .select('pesos_for_point')
        .eq('business_id', card.business_id)
        .maybeSingle();

      // Valores por defecto
      let programType: 'rewards' | 'points' = 'rewards';
      let stampsFilled = 0;
      let maxStamps = 10;
      let currentPoints = 0;
      let rewardText = 'Acumula visitas para ganar premios';

      // 4. Establecer contadores desde las tablas de cada sistema en BD
      if (rewardsProg) {
        programType = 'rewards';
        maxStamps = rewardsProg.reward_visits || 10;
        rewardText = `Premio: ${rewardsProg.reward_product}`;

        const { data: stampBalance } = await supabaseAdmin
          .from('customer_rewards_balances')
          .select('current_stamps')
          .eq('loyalty_card_id', card.id)
          .maybeSingle();
        
        stampsFilled = stampBalance?.current_stamps || 0;
      } else if (pointsProg) {
        programType = 'points';
        rewardText = 'Usa tus puntos como efectivo al pagar';

        const { data: pointsBalance } = await supabaseAdmin
          .from('customer_points_balances')
          .select('current_points')
          .eq('loyalty_card_id', card.id)
          .maybeSingle();

        currentPoints = pointsBalance ? Number(pointsBalance.current_points) : 0;
      }

      const cardCode = `PK-${new Date().getFullYear()}-${String(card.id).padStart(4, '0')}`;

      formattedCards.push({
        id: String(card.id),
        businessName: business.name,
        linkLabel: 'Ver detalles del comercio',
        href: `/join/${business.slug}`,
        logoSrc: business.logo_url || '/perko.png',
        cardColor: business.color || '#2A9D8F',
        rewardText,
        cardCode,
        qrValue: String(card.id),
        programType,
        stampsFilled,
        maxStamps,
        currentPoints,
      });
    }

    return { success: true, cards: formattedCards };
  } catch (err: any) {
    console.error('Error al cargar la cartera relacional:', err);
    return { success: false, error: 'Error al sincronizar tu billetera digital.' };
  }
}