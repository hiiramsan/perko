'use client';

import type { AdminIndicators } from '@/app/actions/dashboard';

type AdminKpiSectionProps = {
  indicators: AdminIndicators | null;
  loading: boolean;
};

export function AdminKpiSection({ indicators, loading }: AdminKpiSectionProps) {
  const kpiCards = indicators
    ? [
        { label: 'Timbres otorgados hoy', value: indicators.totalStamps },
        { label: 'Puntos acumulados hoy', value: indicators.totalPoints.toFixed(2) },
        { label: 'Premios reclamados hoy', value: indicators.rewardsClaimed },
        { label: 'Timbres completados hoy', value: indicators.stampsCompleted },
      ]
    : [];

  return (
    <div className="flex flex-col rounded-none border border-black bg-white">
      <div className="border-b border-[#edf2f7] px-5 py-4">
        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#64748b]">Indicadores de rendimiento</span>
      </div>

      {loading ? (
        <div className="flex flex-1 items-center justify-center p-5">
          <p className="text-xs text-[#64748b]">Cargando indicadores...</p>
        </div>
      ) : (
        <div className="grid h-full grid-cols-2 divide-x divide-y divide-[#e8edf2]">
          {kpiCards.map((card) => (
            <div key={card.label} className="flex flex-col items-start justify-center px-6 py-5">
              <span className="inline-flex rounded-full bg-[#05668D]/10 px-4 py-1.5 text-xl font-bold text-[#05668D]">
                {typeof card.value === 'number' ? card.value.toLocaleString() : card.value}
              </span>
              <p className="mt-4 text-sm font-medium leading-snug text-[#64748b]">{card.label}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
