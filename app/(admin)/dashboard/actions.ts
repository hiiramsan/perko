'use server';

import { createClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET);

export async function getDashboardBusiness() {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get('perko_session')?.value;

  if (!sessionToken) return null;

  try {
    const { payload } = await jwtVerify(sessionToken, JWT_SECRET);
    const userId = payload.id as string;

    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const { data: business } = await supabaseAdmin
      .from('businesses')
      .select('id, name, slug, logo_url, color')
      .eq('owner_id', userId)
      .maybeSingle();

    return business;
  } catch (error) {
    console.error('Error fetching dashboard business:', error);
    return null;
  }
}

export async function updateBusinessCardProps(businessId: string, color: string, logoUrl?: string) {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get('perko_session')?.value;

  if (!sessionToken) return { error: 'No autorizado' };

  try {
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const updateData: any = { color };
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
    console.error('Error updating business:', error);
    return { error: error.message };
  }
}

