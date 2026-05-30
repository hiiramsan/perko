import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET);

type StepData = {
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

async function getUserIdFromCookie(): Promise<string | null> {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get('perko_session')?.value;
  if (!sessionToken) return null;

  try {
    const { payload } = await jwtVerify(sessionToken, JWT_SECRET);
    return (payload as { id?: string }).id ?? null;
  } catch {
    return null;
  }
}

function buildBusinessUpdate(stepData?: StepData) {
  const update: Record<string, unknown> = {};
  if (stepData?.name) update.name = stepData.name;
  if (stepData?.slug) update.slug = stepData.slug;
  if (stepData?.logoUrl) update.logo_url = stepData.logoUrl;
  if (stepData?.color) update.color = stepData.color;
  return update;
}

type SupabaseClientAny = ReturnType<typeof createClient<any>>;

async function upsertPrograms(
  supabase: SupabaseClientAny,
  businessId: string,
  stepData?: StepData
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
        { onConflict: 'business_id' }
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
        { onConflict: 'business_id' }
      );
  }

  if (!hasPoints) {
    await supabase
      .from('business_points_programs')
      .delete()
      .eq('business_id', businessId);
  }
}

export async function GET() {
  const userId = await getUserIdFromCookie();
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return NextResponse.json(
      { error: 'Supabase service role key is missing in env.' },
      { status: 500 }
    );
  }

  const supabase = createClient<any>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { data: business, error } = await supabase
    .from('businesses')
    .select('id, name, slug, logo_url, color, onboarding_status, onboarding_step')
    .eq('owner_id', userId)
    .maybeSingle();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  if (!business) {
    return NextResponse.json({
      status: 'not_started',
      step: 1,
      data: {},
    });
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

  return NextResponse.json({
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
  });
}

export async function PATCH(req: NextRequest) {
  const userId = await getUserIdFromCookie();
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return NextResponse.json(
      { error: 'Supabase service role key is missing in env.' },
      { status: 500 }
    );
  }

  const { step, stepData, completed } = (await req.json()) as {
    step?: number;
    stepData?: StepData;
    completed?: boolean;
  };

  if (!step || step < 1) {
    return NextResponse.json({ error: 'Invalid step' }, { status: 400 });
  }

  const supabase = createClient<any>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
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

  let businessId = business?.id as string | undefined;

  if (!businessId) {
    const { data: inserted, error: insertError } = await supabase
      .from('businesses')
      .insert([
        {
          owner_id: userId,
          logo_url: stepData?.logoUrl ?? '',
          ...onboardingUpdate,
        },
      ])
      .select('id')
      .single();

    if (insertError) return NextResponse.json({ error: insertError.message }, { status: 500 });
    businessId = inserted.id;
  } else {
    const { error: updateError } = await supabase
      .from('businesses')
      .update(onboardingUpdate)
      .eq('id', businessId);

    if (updateError) return NextResponse.json({ error: updateError.message }, { status: 500 });
  }

  if (!businessId) {
    return NextResponse.json({ error: 'Business not found after update.' }, { status: 500 });
  }

  await upsertPrograms(supabase, businessId, stepData);

  return NextResponse.json({
    success: true,
    completed: Boolean(completed),
  });
}