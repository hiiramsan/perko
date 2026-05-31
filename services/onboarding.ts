export type OnboardingSnapshot = {
  status: 'not_started' | 'in_progress' | 'completed';
  step: number;
  data?: {
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
};

export async function loadOnboardingSnapshot(): Promise<OnboardingSnapshot | null> {
  try {
    const res = await fetch('/api/onboarding/step', { method: 'GET' });
    if (!res.ok) return null;
    return (await res.json()) as OnboardingSnapshot;
  } catch {
    return null;
  }
}

export async function saveOnboardingStep(
  step: number,
  stepData?: OnboardingSnapshot['data'],
  completed?: boolean
): Promise<void> {
  try {
    await fetch('/api/onboarding/step', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ step, stepData, completed }),
    });
  } catch {
    // Ignore snapshot failures; the onboarding flow still works.
  }
}