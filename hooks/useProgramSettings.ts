'use client';

import { useCallback, useEffect, useState } from 'react';
import { getProgramSettingsAction, updateRewardsProgramAction, type ProgramSettings } from '@/app/actions/dashboard';

export function useProgramSettings() {
  const [settings, setSettings] = useState<ProgramSettings | null>(null);
  const [businessId, setBusinessId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [rewardProduct, setRewardProduct] = useState('');
  const [rewardVisits, setRewardVisits] = useState('10');

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setLoading(true);

      const data = await getProgramSettingsAction();
      if (cancelled) return;

      if (data) {
        setSettings(data);
        setRewardProduct(data.rewardProduct ?? '');
        setRewardVisits(String(data.rewardVisits ?? 10));
      }

      setLoading(false);
    };

    load();
    return () => { cancelled = true; };
  }, []);

  const save = useCallback(async () => {
    if (!businessId) return { error: 'Negocio no identificado' };

    setSaving(true);
    setError(null);

    const result = await updateRewardsProgramAction(
      businessId,
      rewardProduct.trim(),
      Number(rewardVisits) || 10,
    );

    setSaving(false);

    if (result.error) {
      setError(result.error);
      return result;
    }

    return result;
  }, [businessId, rewardProduct, rewardVisits]);

  return {
    settings,
    businessId,
    setBusinessId,
    loading,
    saving,
    error,
    rewardProduct,
    setRewardProduct,
    rewardVisits,
    setRewardVisits,
    save,
  };
}
