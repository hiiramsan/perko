'use client';

import { useCallback, useEffect, useState } from 'react';
import {
  getProgramSettingsAction,
  updateRewardsProgramAction,
  updatePointsProgramAction,
  removeBusinessSystemAction,
  type ProgramSettings,
} from '@/app/actions/dashboard';

export function useProgramSettings() {
  const [settings, setSettings] = useState<ProgramSettings | null>(null);
  const [businessId, setBusinessId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [hasRewards, setHasRewards] = useState(false);
  const [hasPoints, setHasPoints] = useState(false);

  const [rewardProduct, setRewardProduct] = useState('');
  const [rewardVisits, setRewardVisits] = useState('10');

  const [pesosForPoint, setPesosForPoint] = useState('5');
  const [pointToPesos, setPointToPesos] = useState('0.10');

  const load = useCallback(async () => {
    setLoading(true);

    const data = await getProgramSettingsAction();

    if (data) {
      setSettings(data);
      setHasRewards(data.rewardProduct !== undefined || data.rewardVisits !== undefined);
      setHasPoints(data.pesosForPoint !== undefined || data.pointToPesos !== undefined);
      setRewardProduct(data.rewardProduct ?? '');
      setRewardVisits(String(data.rewardVisits ?? 10));
      setPesosForPoint(String(data.pesosForPoint ?? 5));
      setPointToPesos(String(data.pointToPesos ?? '0.10'));
    }

    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const saveRewards = useCallback(async () => {
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

  const savePoints = useCallback(async () => {
    if (!businessId) return { error: 'Negocio no identificado' };

    setSaving(true);
    setError(null);

    const result = await updatePointsProgramAction(
      businessId,
      Number(pesosForPoint) || 5,
      Number(pointToPesos) || 0.10,
    );

    setSaving(false);

    if (result.error) {
      setError(result.error);
      return result;
    }

    return result;
  }, [businessId, pesosForPoint, pointToPesos]);

  const addSystem = useCallback(async (systemId: 'rewards' | 'points') => {
    if (!businessId) return;

    setSaving(true);
    setError(null);

    if (systemId === 'rewards') {
      const result = await updateRewardsProgramAction(businessId, '', 10);
      if (result.success) {
        setHasRewards(true);
        setRewardProduct('');
        setRewardVisits('10');
      } else if (result.error) {
        setError(result.error);
      }
    } else {
      const result = await updatePointsProgramAction(businessId, 5, 0.10);
      if (result.success) {
        setHasPoints(true);
        setPesosForPoint('5');
        setPointToPesos('0.10');
      } else if (result.error) {
        setError(result.error);
      }
    }

    setSaving(false);
  }, [businessId]);

  const removeSystem = useCallback(async (systemId: 'rewards' | 'points') => {
    if (!businessId) return;

    setSaving(true);
    setError(null);

    const result = await removeBusinessSystemAction(businessId, systemId);
    if (result.success) {
      if (systemId === 'rewards') {
        setHasRewards(false);
        setRewardProduct('');
        setRewardVisits('10');
      } else {
        setHasPoints(false);
        setPesosForPoint('5');
        setPointToPesos('0.10');
      }
    } else if (result.error) {
      setError(result.error);
    }

    setSaving(false);
  }, [businessId]);

  return {
    settings,
    businessId,
    setBusinessId,
    loading,
    saving,
    error,

    hasRewards,
    hasPoints,

    rewardProduct,
    setRewardProduct,
    rewardVisits,
    setRewardVisits,

    pesosForPoint,
    setPesosForPoint,
    pointToPesos,
    setPointToPesos,

    saveRewards,
    savePoints,
    addSystem,
    removeSystem,
  };
}
