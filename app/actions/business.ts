'use server';

import { createClient } from '@supabase/supabase-js';

// Inicializador del cliente admin seguro
function getSupabaseAdmin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

/**
 * 🔍 Obtener info pública del negocio a partir del slug
 */
export async function getBusinessPublicInfo(slug: string) {
  try {
    const supabaseAdmin = getSupabaseAdmin();
    const { data: business, error } = await supabaseAdmin
      .from('businesses')
      .select('id, name, logo_url, color')
      .eq('slug', slug)
      .maybeSingle();

    if (error || !business) return null;
    return business;
  } catch (error) {
    console.error('Error fetching public business:', error);
    return null;
  }
}