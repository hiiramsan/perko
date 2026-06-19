'use server';

import { createSupabaseAdminClient } from '@/lib/server/auth-route-utils';
import { getSessionAction } from '@/app/actions/auth';

type ScanResult = {
  success: boolean;
  message?: string;
  error?: string;
  data?: {
    buyerName: string;
    programType: 'rewards' | 'points';
    newBalance: number;
    movement: string;
  };
};

export async function processCustomerScanAction(
  rawCardCode: string, 
  amount: number, // Puede ser 1 (para 1 timbre) o el total del ticket (para calcular puntos)
  description: string = 'Consumo en sucursal'
): Promise<ScanResult> {
  const session = await getSessionAction();
  if (!session) return { success: false, error: 'No autorizado.' };

  const baristaId = (session as { id?: string }).id;
  if (!baristaId) return { success: false, error: 'No autorizado.' };

  try {
    const supabaseAdmin = createSupabaseAdminClient();

    // 1. Extraer el ID real de la tarjeta desde el código QR
    const loyaltyCardId = Number.parseInt(rawCardCode.trim(), 10);

    if (Number.isNaN(loyaltyCardId)) {
      return { success: false, error: 'El código QR escaneado no es válido.' };
    }

    // 2. Verificar que el barista pertenezca al mismo negocio que la tarjeta escaneada
    const { data: staffRow } = await supabaseAdmin
      .from('business_staff')
      .select('business_id')
      .eq('staff_id', baristaId)
      .maybeSingle();

    if (!staffRow?.business_id) {
      return { success: false, error: 'Tu cuenta no está vinculada a ningún negocio.' };
    }

    const { data: card, error: cardError } = await supabaseAdmin
      .from('loyalty_cards')
      .select('id, customer_id, business_id, status')
      .eq('id', loyaltyCardId)
      .maybeSingle();

    if (cardError || !card) {
      return { success: false, error: 'Tarjeta de lealtad no encontrada.' };
    }

    if (card.status !== 'active') {
      return { success: false, error: 'Esta membresía se encuentra suspendida.' };
    }

    if (card.business_id !== staffRow.business_id) {
      return { success: false, error: 'Esta tarjeta no pertenece a tu empresa. Solo puedes escanear tarjetas de tu propio negocio.' };
    }

    // 3. Obtener el nombre del cliente para el feed del barista
    const { data: profile } = await supabaseAdmin
      .from('profiles')
      .select('name')
      .eq('id', card.customer_id)
      .maybeSingle();

    const buyerName = profile?.name || 'Cliente de Perko';

    // 4. Consultar qué programa tiene activo el negocio (Timbres vs Puntos)
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

    // ─────────────────────────────────────────────────────────────────
    // CASO A: EL COMERCIO OPERA CON SISTEMA DE TIMBRES / VISITAS
    // ─────────────────────────────────────────────────────────────────
    if (rewardsProg) {
      const stampsToAdd = Math.floor(amount) || 1; // Si mandan 1, suma 1 timbre

      // Obtener balance actual del sistema de timbres
      const { data: stampBalance } = await supabaseAdmin
        .from('customer_rewards_balances')
        .select('current_stamps, total_accumulated_stamps')
        .eq('loyalty_card_id', card.id)
        .maybeSingle();

      const currentStamps = stampBalance?.current_stamps || 0;
      const totalAccumulated = stampBalance?.total_accumulated_stamps || 0;
      
      let nextStamps = currentStamps + stampsToAdd;
      const maxVisits = rewardsProg.reward_visits || 10;
      let transactionType = 'stamp_earned';
      let finalDescription = description;

      // Lógica de ciclo: Si completa la planilla, se consume y reinicia el contador
      if (nextStamps >= maxVisits) {
        nextStamps = nextStamps - maxVisits; // Guarda el remanente si consumió de más
        transactionType = 'stamp_redeemed';
        finalDescription = `¡Planilla llena! Canjeó: ${rewardsProg.reward_product}`;
      }

      // Actualizamos el satélite de timbres
      const { error: updateStampErr } = await supabaseAdmin
        .from('customer_rewards_balances')
        .update({
          current_stamps: nextStamps,
          total_accumulated_stamps: totalAccumulated + stampsToAdd
        })
        .eq('loyalty_card_id', card.id);

      if (updateStampErr) throw updateStampErr;

      // Insertar bitácora en loyalty_card_transactions
      await supabaseAdmin.from('loyalty_card_transactions').insert([{
        loyalty_card_id: card.id,
        type: transactionType,
        amount: stampsToAdd,
        description: finalDescription,
        processed_by: baristaId
      }]);

      return {
        success: true,
        message: transactionType === 'stamp_redeemed' ? '¡Planilla completada con éxito!' : 'Timbre sumado correctamente.',
        data: {
          buyerName,
          programType: 'rewards',
          newBalance: nextStamps,
          movement: `+${stampsToAdd} Timbre(s)`
        }
      };
    }

    // ─────────────────────────────────────────────────────────────────
    // CASO B: EL COMERCIO OPERA CON MONEDERO ELECTRÓNICO (PUNTOS)
    // ─────────────────────────────────────────────────────────────────
    if (pointsProg) {
      const factor = Number(pointsProg.pesos_for_point) || 0.10; // Ejemplo: 10% de la compra
      const pointsToEarn = Number((amount * factor).toFixed(2));

      if (pointsToEarn <= 0) {
        return { success: false, error: 'El monto de compra no genera puntos mínimos.' };
      }

      // Obtener saldo del satélite de puntos
      const { data: pointsBalance } = await supabaseAdmin
        .from('customer_points_balances')
        .select('current_points, total_earned_points')
        .eq('loyalty_card_id', card.id)
        .maybeSingle();

      const currentPoints = pointsBalance ? Number(pointsBalance.current_points) : 0;
      const totalEarned = pointsBalance ? Number(pointsBalance.total_earned_points) : 0;
      const nextPoints = currentPoints + pointsToEarn;

      // Actualizamos el satélite de puntos
      const { error: updatePointsErr } = await supabaseAdmin
        .from('customer_points_balances')
        .update({
          current_points: nextPoints,
          total_earned_points: totalEarned + pointsToEarn
        })
        .eq('loyalty_card_id', card.id);

      if (updatePointsErr) throw updatePointsErr;

      // Insertar bitácora clínica en loyalty_card_transactions
      await supabaseAdmin.from('loyalty_card_transactions').insert([{
        loyalty_card_id: card.id,
        type: 'points_earned',
        amount: pointsToEarn,
        description: `Acumulación por compra de $${amount.toFixed(2)}. ${description}`,
        processed_by: baristaId
      }]);

      return {
        success: true,
        message: `Se han abonado $${pointsToEarn.toFixed(2)} puntos a la cuenta.`,
        data: {
          buyerName,
          programType: 'points',
          newBalance: nextPoints,
          movement: `+${pointsToEarn.toFixed(2)} Pts`
        }
      };
    }

    return { success: false, error: 'El negocio no cuenta con un programa de lealtad activo.' };

  } catch (err: any) {
    console.error('Error crítico procesando el escaneo en el backend:', err);
    return { success: false, error: 'Ocurrió un error interno al asentar la transacción.' };
  }
}