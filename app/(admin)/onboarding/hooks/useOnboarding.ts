import { useState, useMemo, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { createBusinessAction } from '../lib/actions';
import { CARD_COLORS, SYSTEM_SELECTION_STAGE_INDEX } from '../lib/constants';
import { buildSlug, getOrderedSystems } from '../lib/utils';

type OnboardingSnapshot = {
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

function getDbStep(stageIndex: number): number {
  return stageIndex + 1;
}

async function saveStepProgress(
  step: number,
  stepData?: OnboardingSnapshot['data'],
  completed?: boolean
): Promise<void> {
  await fetch('/api/onboarding/step', {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ step, stepData, completed }),
  });
  // We intentionally don't throw here — a failed progress save is not
  // critical enough to block the user from continuing. The final
  // createBusinessAction is the source of truth.
}

export function useOnboarding(initialStep = 1) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  // 🆕 Initialise stageIndex from the DB step so resuming drops them
  //    back at the right phase. DB step is 1-based; stage is 0-based.
  const [stageIndex, setStageIndex] = useState(() => Math.max(0, initialStep - 1));
  const [resumeStep, setResumeStep] = useState<number | null>(null);
  const resumeAppliedRef = useRef(false);

  const [businessName, setBusinessName] = useState('');
  const [slug, setSlug] = useState('');
  const [slugTouched, setSlugTouched] = useState(false);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState('');
  const [logoUrl, setLogoUrl] = useState('');
  const [cardColor, setCardColor] = useState(CARD_COLORS[0].value);
  const [selectedSystems, setSelectedSystems] = useState<string[]>([]);
  const [lockedSystems, setLockedSystems] = useState<string[]>([]);
  const [rewardProduct, setRewardProduct] = useState('');
  const [rewardVisits, setRewardVisits] = useState('10');
  const [pointsPerPeso, setPointsPerPeso] = useState('5');
  const [pesosPerPoint, setPesosPerPoint] = useState('0.10');

  useEffect(() => {
    let cancelled = false;

    const loadSnapshot = async () => {
      try {
        const res = await fetch('/api/onboarding/step', { method: 'GET' });
        if (!res.ok) return;

        const snapshot = (await res.json()) as OnboardingSnapshot;
        if (cancelled || !snapshot) return;

        const { data, step, status } = snapshot;

        if (data?.name) setBusinessName(data.name);
        if (data?.slug) {
          setSlug(data.slug);
          setSlugTouched(true);
        }
        if (data?.logoUrl) {
          setLogoUrl(data.logoUrl);
          setLogoPreview(data.logoUrl);
        }
        if (data?.color) setCardColor(data.color);

        if (data?.selectedSystems?.length) {
          setSelectedSystems(data.selectedSystems);
        }
        if (data?.rewardProduct) setRewardProduct(data.rewardProduct);
        if (data?.rewardVisits) setRewardVisits(String(data.rewardVisits));
        if (data?.pointsPerPeso) setPointsPerPeso(String(data.pointsPerPeso));
        if (data?.pesosPerPoint) setPesosPerPoint(String(data.pesosPerPoint));

        if (status !== 'completed' && step && step > 0) {
          setResumeStep(step);
        }
      } catch {
        // Ignore snapshot failures; the onboarding flow still works.
      }
    };

    loadSnapshot();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!slugTouched) {
      setSlug(buildSlug(businessName));
    }
  }, [businessName, slugTouched]);

  useEffect(() => {
    return () => {
      if (logoPreview.startsWith('blob:')) {
        URL.revokeObjectURL(logoPreview);
      }
    };
  }, [logoPreview]);

  const activeSystems =
    stageIndex > SYSTEM_SELECTION_STAGE_INDEX
      ? getOrderedSystems(lockedSystems)
      : getOrderedSystems(selectedSystems);

  const phases = useMemo(() => {
    return [
      { kind: 'business' as const },
      { kind: 'logo' as const },
      { kind: 'link' as const },
      { kind: 'color' as const },
      { kind: 'systems' as const },
      ...activeSystems.map((system) => ({ kind: 'system' as const, system })),
    ];
  }, [activeSystems]);

  useEffect(() => {
    if (!resumeStep || resumeAppliedRef.current) return;
    const targetStage = Math.max(0, resumeStep - 1);
    const maxStage = Math.max(0, phases.length - 1);
    const clampedStage = Math.min(targetStage, maxStage);
    setStageIndex(clampedStage);
    resumeAppliedRef.current = true;

    if (clampedStage > SYSTEM_SELECTION_STAGE_INDEX && selectedSystems.length) {
      setLockedSystems(getOrderedSystems(selectedSystems).map((system) => system.id));
    }
  }, [resumeStep, selectedSystems, phases.length]);

  const currentPhase = phases[Math.min(stageIndex, phases.length - 1)];
  const progress = useMemo(() => {
    if (phases.length <= 1) return 0;
    return (stageIndex / (phases.length - 1)) * 100;
  }, [phases.length, stageIndex]);

  const canContinue = useMemo(() => {
    if (!currentPhase) return false;
    switch (currentPhase.kind) {
      case 'business': return businessName.trim().length > 1;
      case 'logo':     return Boolean(logoFile || logoUrl);
      case 'link':     return slug.trim().length > 1;
      case 'color':    return Boolean(cardColor);
      case 'systems':  return selectedSystems.length > 0;
      case 'system':
        switch (currentPhase.system.id) {
          case 'rewards':
            return rewardProduct.trim().length > 1 && Number(rewardVisits) > 0;
          case 'points':
            return Number(pointsPerPeso) > 0 && Number(pesosPerPoint) > 0;
          default: return true;
        }
      default: return false;
    }
  }, [businessName, cardColor, currentPhase, logoFile, logoUrl, pointsPerPeso, pesosPerPoint, rewardProduct, rewardVisits, selectedSystems, slug]);

  const getStepData = (override?: Partial<OnboardingSnapshot['data']>) => {
    if (!currentPhase) return undefined;
    const merge = (base?: OnboardingSnapshot['data']) =>
      override ? { ...(base ?? {}), ...override } : base;

    switch (currentPhase.kind) {
      case 'business':
        return merge({ name: businessName, slug });
      case 'logo':
        return merge({ name: businessName, slug, logoUrl });
      case 'link':
        return merge({ slug, logoUrl });
      case 'color':
        return merge({ color: cardColor, logoUrl });
      case 'systems':
        return merge({ selectedSystems, logoUrl });
      case 'system':
        switch (currentPhase.system.id) {
          case 'rewards':
            return merge({
              selectedSystems,
              rewardProduct,
              rewardVisits: Number(rewardVisits) || 0,
            });
          case 'points':
            return merge({
              selectedSystems,
              pointsPerPeso: Number(pointsPerPeso) || 0,
              pesosPerPoint: Number(pesosPerPoint) || 0,
            });
          default:
            return merge({ selectedSystems, logoUrl });
        }
      default:
        return undefined;
    }
  };

  const uploadLogo = async () => {
    if (!logoFile) return '';

    const supabase = createClient();
    const fileExt = logoFile.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExt}`;
    const { error: uploadError } = await supabase.storage
      .from('logos')
      .upload(fileName, logoFile);

    if (uploadError) {
      console.error('Error al subir el logo:', uploadError);
      alert('Ocurrió un error al subir el logo. Por favor, intenta de nuevo.');
      return '';
    }

    const { data } = supabase.storage.from('logos').getPublicUrl(fileName);
    return data.publicUrl;
  };

  const handleLogoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setLogoFile(file);
    setLogoUrl('');
    setLogoPreview(URL.createObjectURL(file));
  };

  const toggleSystem = (id: string) => {
    setSelectedSystems((current) =>
      current.includes(id)
        ? current.filter((systemId) => systemId !== id)
        : [...current, id],
    );
  };

  const goNext = async () => {
    if (!canContinue || loading) return;

    // ── Final step: upload logo + create everything ──────────────────────
    if (stageIndex === phases.length - 1) {
      setLoading(true);

      let uploadedLogoUrl = logoUrl;
      if (!uploadedLogoUrl && logoFile) {
        uploadedLogoUrl = await uploadLogo();
      }

      if (logoFile && !uploadedLogoUrl) {
        setLoading(false);
        return;
      }

      const result = await createBusinessAction({
        name: businessName,
        slug,
        logoUrl: uploadedLogoUrl || undefined,
        color: cardColor,
        selectedSystems,
        rewardProduct,
        rewardVisits: Number(rewardVisits) || 0,
        pointsPerPeso: Number(pointsPerPeso) || 0,
        pesosPerPoint: Number(pesosPerPoint) || 0,
      });

      setLoading(false);

      if (result?.error) {
        alert(result.error);
        return;
      }

      if (result?.success) {
        // 🆕 Mark onboarding as fully completed before redirecting
        await saveStepProgress(phases.length, getStepData({ logoUrl: uploadedLogoUrl || undefined }), true);
        router.push('/dashboard');
      }
      return;
    }

    let uploadedLogoUrlOverride: string | undefined;
    if (currentPhase?.kind === 'logo' && logoFile && !logoUrl) {
      const uploadedLogoUrl = await uploadLogo();
      if (!uploadedLogoUrl) return;
      uploadedLogoUrlOverride = uploadedLogoUrl;
      setLogoUrl(uploadedLogoUrl);
    }

    // ── Intermediate step: lock systems selection then advance ───────────
    if (currentPhase?.kind === 'systems') {
      setLockedSystems(getOrderedSystems(selectedSystems).map((s) => s.id));
    }

    const nextStageIndex = stageIndex + 1;
    const nextStep = getDbStep(nextStageIndex);

    // 🆕 Persist progress before advancing the UI — fire-and-forget
    //    so there's no visible delay for the user.
    const stepData = getStepData(
      currentPhase?.kind === 'logo'
        ? { logoUrl: uploadedLogoUrlOverride || logoUrl || undefined }
        : undefined
    );
    saveStepProgress(nextStep, stepData);

    setStageIndex(nextStageIndex);
  };

  const goBack = () => {
    setStageIndex((prev) => Math.max(prev - 1, 0));
  };

  return {
    state: {
      loading,
      stageIndex,
      businessName,
      slug,
      logoFile,
      logoPreview,
      cardColor,
      selectedSystems,
      lockedSystems,
      rewardProduct,
      rewardVisits,
      pointsPerPeso,
      pesosPerPoint,
    },
    setters: {
      setBusinessName,
      setSlugTouched,
      setSlug,
      setCardColor,
      setRewardProduct,
      setRewardVisits,
      setPointsPerPeso,
      setPesosPerPoint,
    },
    handlers: {
      handleLogoChange,
      toggleSystem,
      goNext,
      goBack,
    },
    derived: {
      phases,
      currentPhase,
      progress,
      canContinue,
    },
  };
}