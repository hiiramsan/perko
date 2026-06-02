import { useState, useMemo, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { CARD_COLORS, SYSTEM_SELECTION_STAGE_INDEX } from '@/app/(admin)/onboarding/lib/constants';
import { buildSlug, getOrderedSystems } from '@/app/(admin)/onboarding/lib/utils';
import { loadOnboardingSnapshot, saveOnboardingStepAction, type OnboardingSnapshot } from '@/app/actions/onboarding';
import { uploadPublicFile } from '@/lib/supabase/storage';
import type { ChangeEvent } from 'react';

function getDbStep(stageIndex: number): number {
  return stageIndex + 1;
}

function isRewardsSystem(systemId: string) {
  return systemId === 'rewards';
}

function isPointsSystem(systemId: string) {
  return systemId === 'points';
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
      const snapshot = await loadOnboardingSnapshot();
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

  const currentPhase = phases[Math.min(stageIndex, phases.length - 1)];

  const phaseData = currentPhase?.kind === 'system' ? currentPhase.system : null;

  const canContinueCurrentPhase = useMemo(() => {
    if (!currentPhase) return false;

    if (currentPhase.kind === 'business') return businessName.trim().length > 1;
    if (currentPhase.kind === 'logo') return Boolean(logoFile || logoUrl);
    if (currentPhase.kind === 'link') return slug.trim().length > 1;
    if (currentPhase.kind === 'color') return Boolean(cardColor);
    if (currentPhase.kind === 'systems') return selectedSystems.length > 0;
    if (!phaseData) return false;

    if (isRewardsSystem(phaseData.id)) {
      return rewardProduct.trim().length > 1 && Number(rewardVisits) > 0;
    }

    if (isPointsSystem(phaseData.id)) {
      return Number(pointsPerPeso) > 0 && Number(pesosPerPoint) > 0;
    }

    return true;
  }, [businessName, cardColor, currentPhase, logoFile, logoUrl, phaseData, pesosPerPoint, pointsPerPeso, rewardProduct, rewardVisits, selectedSystems, slug]);

  const buildStepData = (override?: Partial<OnboardingSnapshot['data']>) => {
    if (!currentPhase) return undefined;

    const merge = (base?: OnboardingSnapshot['data']) => (override ? { ...(base ?? {}), ...override } : base);

    if (currentPhase.kind === 'business') return merge({ name: businessName, slug });
    if (currentPhase.kind === 'logo') return merge({ name: businessName, slug, logoUrl });
    if (currentPhase.kind === 'link') return merge({ slug, logoUrl });
    if (currentPhase.kind === 'color') return merge({ color: cardColor, logoUrl });
    if (currentPhase.kind === 'systems') return merge({ selectedSystems, logoUrl });

    if (isRewardsSystem(currentPhase.system.id)) {
      return merge({
        selectedSystems,
        rewardProduct,
        rewardVisits: Number(rewardVisits) || 0,
      });
    }

    if (isPointsSystem(currentPhase.system.id)) {
      return merge({
        selectedSystems,
        pointsPerPeso: Number(pointsPerPeso) || 0,
        pesosPerPoint: Number(pesosPerPoint) || 0,
      });
    }

    return merge({ selectedSystems, logoUrl });
  };

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

  const progress = useMemo(() => {
    if (phases.length <= 1) return 0;
    return (stageIndex / (phases.length - 1)) * 100;
  }, [phases.length, stageIndex]);
  const canContinue = useMemo(() => canContinueCurrentPhase, [canContinueCurrentPhase]);

  const uploadLogo = async () => {
    if (!logoFile) return '';

    try {
      return await uploadPublicFile('logos', logoFile);
    } catch (error) {
      console.error('Error al subir el logo:', error);
      alert('Ocurrió un error al subir el logo. Por favor, intenta de nuevo.');
      return '';
    }
  };

  const handleLogoChange = (event: ChangeEvent<HTMLInputElement>) => {
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

      const finalStepData = {
        name: businessName,
        slug,
        logoUrl: uploadedLogoUrl || undefined,
        color: cardColor,
        selectedSystems,
        rewardProduct,
        rewardVisits: Number(rewardVisits) || 0,
        pointsPerPeso: Number(pointsPerPeso) || 0,
        pesosPerPoint: Number(pesosPerPoint) || 0,
      };
      
      const result = await saveOnboardingStepAction(phases.length, finalStepData, true);

      setLoading(false);

      if (result?.error) {
        alert(result.error);
        return;
      }

      if (result?.success) {
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
    const stepData = buildStepData(
      currentPhase?.kind === 'logo'
        ? { logoUrl: uploadedLogoUrlOverride || logoUrl || undefined }
        : undefined
    );
    saveOnboardingStepAction(nextStep, stepData).catch(() => { });

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