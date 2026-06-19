'use server';

import { createClient } from '@supabase/supabase-js';
import { getSessionAction } from '@/app/actions/auth';

function createAdminClient() {
  return createClient<any>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  );
}

export async function getDashboardBusiness() {
  const session = await getSessionAction();
  if (!session) return null;

  const userId = (session as { id?: string }).id;
  if (!userId) return null;

  const supabaseAdmin = createAdminClient();

  const { data: business } = await supabaseAdmin
    .from('businesses')
    .select('id, name, slug, logo_url, color')
    .eq('owner_id', userId)
    .maybeSingle();

  return business;
}

export async function updateBusinessCardProps(businessId: string, color: string, logoUrl?: string) {
  const session = await getSessionAction();
  if (!session) return { error: 'No autorizado' };

  try {
    const supabaseAdmin = createAdminClient();

    const updateData: Record<string, unknown> = { color };
    if (logoUrl !== undefined) {
      updateData.logo_url = logoUrl;
    }

    const { error } = await supabaseAdmin
      .from('businesses')
      .update(updateData)
      .eq('id', businessId);

    if (error) throw error;

    return { success: true };
  } catch (error: any) {
    return { error: error.message };
  }
}
