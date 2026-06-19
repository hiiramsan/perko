'use client';

import { Loader2, Save, StampIcon, Trash2 } from 'lucide-react';

type ProgramRewardsCardProps = {
  rewardProduct: string;
  rewardVisits: string;
  saving: boolean;
  onRewardProductChange: (val: string) => void;
  onRewardVisitsChange: (val: string) => void;
  onSave: () => void;
  onRemove: () => void;
};

export function ProgramRewardsCard({
  rewardProduct,
  rewardVisits,
  saving,
  onRewardProductChange,
  onRewardVisitsChange,
  onSave,
  onRemove,
}: ProgramRewardsCardProps) {
  return (
    <div className="rounded-xl border border-[#edf2f7] bg-[#f9fcfb] p-4 sm:p-5">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <StampIcon size={16} className="text-[#05668D]" />
          <span className="text-xs font-bold uppercase tracking-wider text-[#334155]">Sistema de Timbres</span>
        </div>
        <button
          type="button"
          onClick={onRemove}
          className="inline-flex h-6 w-6 items-center justify-center rounded-full text-[#94a3b8] transition hover:bg-red-50 hover:text-red-500"
          title="Eliminar sistema"
        >
          <Trash2 size={12} />
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
            Producto de Recompensa
          </label>
          <input
            type="text"
            value={rewardProduct}
            onChange={(e) => onRewardProductChange(e.target.value)}
            placeholder="Ej: Café Americano"
            className="mt-1 h-9 w-full rounded-lg border border-slate-200 px-3 text-xs outline-none focus:border-slate-950 transition"
          />
        </div>
        <div>
          <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
            Timbres Necesarios
          </label>
          <input
            type="number"
            min={1}
            value={rewardVisits}
            onChange={(e) => onRewardVisitsChange(e.target.value)}
            className="mt-1 h-9 w-full rounded-lg border border-slate-200 px-3 text-xs outline-none focus:border-slate-950 transition"
          />
        </div>
      </div>

      <div className="mt-4 flex justify-end">
        <button
          type="button"
          onClick={onSave}
          disabled={saving || !rewardProduct.trim() || !rewardVisits}
          className="inline-flex h-8 items-center gap-1.5 rounded-full bg-[#05668D] px-4 text-xs font-semibold text-white transition hover:bg-[#045676] disabled:cursor-not-allowed disabled:opacity-50"
        >
          {saving ? <Loader2 size={12} className="animate-spin" /> : <Save size={12} />}
          Guardar cambios
        </button>
      </div>
    </div>
  );
}
