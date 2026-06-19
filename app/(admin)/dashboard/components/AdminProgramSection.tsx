'use client';

import { Loader2 } from 'lucide-react';
import { useProgramSettings } from '@/hooks/useProgramSettings';
import { useEffect } from 'react';
import { ProgramRewardsCard } from './ProgramRewardsCard';
import { ProgramPointsCard } from './ProgramPointsCard';
import { AddSystemPicker } from './AddSystemPicker';

type AdminProgramSectionProps = {
  businessId: string | null;
};

export function AdminProgramSection({ businessId }: AdminProgramSectionProps) {
  const {
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
    setBusinessId,
  } = useProgramSettings();

  useEffect(() => {
    if (businessId) setBusinessId(businessId);
  }, [businessId, setBusinessId]);

  return (
    <div className="flex flex-col rounded-none border border-black bg-white">
      <div className="border-b border-[#edf2f7] px-5 py-4">
        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#64748b]">Programa</span>
      </div>

      {loading ? (
        <div className="flex flex-1 items-center justify-center p-10">
          <Loader2 size={18} className="animate-spin text-[#64748b]" />
        </div>
      ) : (
        <div className="flex flex-col gap-8 p-5 sm:p-6">
          {error && (
            <div className="rounded-lg bg-red-50 px-4 py-2 text-xs font-medium text-red-600">
              {error}
            </div>
          )}

          {hasRewards && (
            <ProgramRewardsCard
              rewardProduct={rewardProduct}
              rewardVisits={rewardVisits}
              saving={saving}
              onRewardProductChange={setRewardProduct}
              onRewardVisitsChange={setRewardVisits}
              onSave={saveRewards}
              onRemove={() => removeSystem('rewards')}
            />
          )}

          {hasPoints && (
            <ProgramPointsCard
              pesosForPoint={pesosForPoint}
              pointToPesos={pointToPesos}
              saving={saving}
              onPesosForPointChange={setPesosForPoint}
              onPointToPesosChange={setPointToPesos}
              onSave={savePoints}
              onRemove={() => removeSystem('points')}
            />
          )}

          <div className="border-t border-[#edf2f7] pt-6">
            <AddSystemPicker
              hasRewards={hasRewards}
              hasPoints={hasPoints}
              saving={saving}
              onAdd={addSystem}
            />
          </div>
        </div>
      )}
    </div>
  );
}
