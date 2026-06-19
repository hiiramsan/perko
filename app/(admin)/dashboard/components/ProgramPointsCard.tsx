'use client';

import { Loader2, Save, Coins, Trash2 } from 'lucide-react';

type ProgramPointsCardProps = {
  pesosForPoint: string;
  pointToPesos: string;
  saving: boolean;
  onPesosForPointChange: (val: string) => void;
  onPointToPesosChange: (val: string) => void;
  onSave: () => void;
  onRemove: () => void;
};

export function ProgramPointsCard({
  pesosForPoint,
  pointToPesos,
  saving,
  onPesosForPointChange,
  onPointToPesosChange,
  onSave,
  onRemove,
}: ProgramPointsCardProps) {
  return (
    <div className="rounded-xl border border-[#edf2f7] bg-[#f9fcfb] p-4 sm:p-5">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Coins size={16} className="text-[#05668D]" />
          <span className="text-xs font-bold uppercase tracking-wider text-[#334155]">Sistema de Puntos</span>
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
            ¿Cada cuántos pesos se gana un punto?
          </label>
          <input
            type="number"
            min={1}
            value={pesosForPoint}
            onChange={(e) => onPesosForPointChange(e.target.value)}
            className="mt-1 h-9 w-full rounded-lg border border-slate-200 px-3 text-xs outline-none focus:border-slate-950 transition"
          />
        </div>
        <div>
          <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
            ¿Cuánto vale 1 punto al pagar?
          </label>
          <input
            type="number"
            min={0.01}
            step={0.01}
            value={pointToPesos}
            onChange={(e) => onPointToPesosChange(e.target.value)}
            className="mt-1 h-9 w-full rounded-lg border border-slate-200 px-3 text-xs outline-none focus:border-slate-950 transition"
          />
        </div>
      </div>

      <div className="mt-4 flex justify-end">
        <button
          type="button"
          onClick={onSave}
          disabled={saving || !pesosForPoint || !pointToPesos}
          className="inline-flex h-8 items-center gap-1.5 rounded-full bg-[#05668D] px-4 text-xs font-semibold text-white transition hover:bg-[#045676] disabled:cursor-not-allowed disabled:opacity-50"
        >
          {saving ? <Loader2 size={12} className="animate-spin" /> : <Save size={12} />}
          Guardar cambios
        </button>
      </div>
    </div>
  );
}
