'use client';

import { Loader2, Plus, Save, StampIcon } from 'lucide-react';
import { useProgramSettings } from '@/hooks/useProgramSettings';
import { useEffect } from 'react';

type AdminProgramSectionProps = {
  businessId: string | null;
};

export function AdminProgramSection({ businessId }: AdminProgramSectionProps) {
  const {
    loading,
    saving,
    error,
    rewardProduct,
    setRewardProduct,
    rewardVisits,
    setRewardVisits,
    save,
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
          <div className="rounded-xl border border-[#edf2f7] bg-[#f9fcfb] p-4 sm:p-5">
            <div className="mb-4 flex items-center gap-2">
              <StampIcon size={16} className="text-[#05668D]" />
              <span className="text-xs font-bold uppercase tracking-wider text-[#334155]">Sistema de Timbres</span>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  Producto de Recompensa
                </label>
                <input
                  type="text"
                  value={rewardProduct}
                  onChange={(e) => setRewardProduct(e.target.value)}
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
                  onChange={(e) => setRewardVisits(e.target.value)}
                  className="mt-1 h-9 w-full rounded-lg border border-slate-200 px-3 text-xs outline-none focus:border-slate-950 transition"
                />
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between">
              {error && (
                <p className="text-xs font-medium text-red-500">{error}</p>
              )}
              <div className="ml-auto">
                <button
                  type="button"
                  onClick={save}
                  disabled={saving || !rewardProduct.trim() || !rewardVisits}
                  className="inline-flex h-8 items-center gap-1.5 rounded-full bg-[#05668D] px-4 text-xs font-semibold text-white transition hover:bg-[#045676] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {saving ? <Loader2 size={12} className="animate-spin" /> : <Save size={12} />}
                  Guardar cambios
                </button>
              </div>
            </div>
          </div>

          <div className="border-t border-[#edf2f7] pt-6">
            <button
              type="button"
              disabled
              className="inline-flex h-9 items-center gap-2 rounded-full border border-dashed border-[#c8d3de] bg-transparent px-5 text-xs font-semibold text-[#94a3b8] transition cursor-not-allowed"
            >
              <Plus size={14} />
              Agregar sistema
            </button>
            <p className="mt-1.5 text-[11px] text-[#94a3b8]">Próximamente: sistema de puntos, monedero digital y más.</p>
          </div>
        </div>
      )}
    </div>
  );
}
