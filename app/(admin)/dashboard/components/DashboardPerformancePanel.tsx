'use client';

import { useMemo, useState } from 'react';
import type { DashboardPerformanceMetric } from '../dashboard-data';
import { ActivityChart } from './ActivityChart';

type DashboardPerformancePanelProps = {
	todayMetrics: DashboardPerformanceMetric[];
	historicalMetrics: DashboardPerformanceMetric[];
};

type PerformanceMode = 'today' | 'historical';

export function DashboardPerformancePanel({ todayMetrics, historicalMetrics }: DashboardPerformancePanelProps) {
	const [mode, setMode] = useState<PerformanceMode>('today');
	const [activeKey, setActiveKey] = useState(todayMetrics[0]?.key ?? 'visits');

	const metrics = mode === 'today' ? todayMetrics : historicalMetrics;
	const activeMetric = useMemo(() => metrics.find((metric) => metric.key === activeKey) ?? metrics[0], [activeKey, metrics]);

	return (
		<section className="flex h-full min-h-0 w-full flex-col rounded-[2rem] border border-[#d8e2ea] border-t-[5px] border-t-[#05668D] bg-white/94 p-4 shadow-[0_18px_40px_-26px_rgba(15,23,42,0.2)] backdrop-blur sm:p-5">
			<div className="flex items-center justify-between gap-4 w-full">
				<div>
					<div className="flex items-center gap-2">
						<span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#64748b]">Indicadores de rendimiento</span>
					</div>
				</div>

				<div className="flex rounded-full border border-[#dbe4ec] bg-[#f8fbfd] p-1 shrink-0">
					<button
						type="button"
						onClick={() => {
							setMode('today');
							setActiveKey((currentKey) => (todayMetrics.some((metric) => metric.key === currentKey) ? currentKey : todayMetrics[0]?.key ?? currentKey));
						}}
						className={`rounded-full px-3 py-1 text-[11px] font-semibold transition sm:text-xs ${mode === 'today' ? 'bg-white text-[#0f172a] shadow-sm' : 'text-[#64748b] hover:text-[#0f172a]'}`}
					>
						Hoy
					</button>
					<button
						type="button"
						onClick={() => {
							setMode('historical');
							setActiveKey((currentKey) => (historicalMetrics.some((metric) => metric.key === currentKey) ? currentKey : historicalMetrics[0]?.key ?? currentKey));
						}}
						className={`rounded-full px-3 py-1 text-[11px] font-semibold transition sm:text-xs ${mode === 'historical' ? 'bg-white text-[#0f172a] shadow-sm' : 'text-[#64748b] hover:text-[#0f172a]'}`}
					>
						Histórico
					</button>
				</div>
			</div>

			{activeMetric ? (
				<div className="mt-6 flex min-h-0 flex-1 flex-col w-full px-1">
					{/* Cambiado a flex-col en pantallas pequeñas y flex-row en XL para evitar colisiones de ancho */}
					<div className="flex flex-col md:flex-row md:items-end justify-between gap-4 w-full">
						<div className="flex items-baseline gap-2">
							<p className="text-[2.8rem] leading-none font-semibold tracking-tight text-[#0f172a]">{activeMetric.value}</p>
							{/* Espacio para el badge de crecimiento (+12%) que platicamos antes, si decides ponerlo */}
						</div>
						
						{/* Contenedor de botones optimizado para no comprimir el layout */}
						<div className="flex flex-wrap gap-2 justify-start md:justify-end shrink-0">
							{metrics.map((metric) => {
								const isActive = metric.key === activeKey;

								return (
									<button
										key={metric.key}
										type="button"
										onClick={() => setActiveKey(metric.key)}
										className={`rounded-full border px-3 py-1 text-[11px] font-semibold transition ${isActive ? 'border-transparent bg-[#0f172a] text-white shadow-[0_10px_26px_-14px_rgba(15,23,42,0.7)]' : 'border-[#dbe4ec] bg-white text-[#334155] hover:border-[#94a3b8] hover:bg-[#f8fbfd]'}`}
									>
										{metric.label}
									</button>
								);
							})}
						</div>
					</div>

					{/* Contenedor de la gráfica forzado a ocupar el 100% del ancho disponible */}
					<div className="mt-6 flex-1 min-h-0 w-full min-w-0 pt-1">
						<ActivityChart data={activeMetric.chartData} highlightIndex={activeMetric.highlightIndex} />
					</div>
				</div>
			) : null}
		</section>
	);
}