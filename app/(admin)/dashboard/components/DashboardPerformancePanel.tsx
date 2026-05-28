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
		<section className="flex h-full min-h-0 w-full flex-col rounded-none border border-black bg-white p-4 sm:p-5">
			<div className="flex items-start justify-between gap-4 w-full">
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
						className={`rounded-full px-3 py-1 text-[11px] font-semibold transition sm:text-xs ${mode === 'today' ? 'bg-[#05668D] text-white shadow-sm' : 'text-[#0f172a] hover:text-[#475569]'}`}
					>
						Hoy
					</button>
					<button
						type="button"
						onClick={() => {
							setMode('historical');
							setActiveKey((currentKey) => (historicalMetrics.some((metric) => metric.key === currentKey) ? currentKey : historicalMetrics[0]?.key ?? currentKey));
						}}
						className={`rounded-full px-3 py-1 text-[11px] font-semibold transition sm:text-xs ${mode === 'historical' ? 'bg-[#05668D] text-white shadow-sm' : 'text-[#0f172a] hover:text-[#475569]'}`}
					>
						Histórico
					</button>
				</div>
			</div>

			{activeMetric ? (
				<div className="mt-4 flex min-h-0 flex-1 flex-col w-full px-1">
					<div className="flex flex-col md:flex-row md:items-center justify-between gap-4 w-full">
						<div className="flex items-baseline gap-2 shrink-0">
							<p className="text-[2.8rem] leading-none font-semibold tracking-tight text-[#0f172a]">{activeMetric.value}</p>
						</div>

						<div className="flex flex-wrap gap-2 justify-start md:justify-end flex-1">
							{metrics.map((metric) => {
								const isActive = metric.key === activeKey;

								return (
									<button
										key={metric.key}
										type="button"
										onClick={() => setActiveKey(metric.key)}
										className={`rounded-full border px-3 py-1 text-[11px] font-semibold transition ${isActive ? 'border-transparent bg-[#05668D] text-white shadow-sm' : 'border-[#dbe4ec] bg-white text-[#0f172a] hover:border-[#94a3b8] hover:bg-[#f8fbfd]'}`}
									>
										{metric.label}
									</button>
								);
							})}
						</div>
					</div>

					<div className="mt-4 flex-1 min-h-0 w-full min-w-0 pt-1">
						<ActivityChart data={activeMetric.chartData} highlightIndex={activeMetric.highlightIndex} />
					</div>
				</div>
			) : null}
		</section>
	);
}