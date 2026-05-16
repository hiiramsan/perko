'use client';

import type { DashboardMetric } from '../dashboard-data';
import { DashboardKpiCard } from './DashboardKpiCard';

type DashboardKpiGridProps = {
	metrics: DashboardMetric[];
};

export function DashboardKpiGrid({ metrics }: DashboardKpiGridProps) {
	return (
		<section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
			{metrics.map((metric) => (
				<DashboardKpiCard key={metric.label} {...metric} />
			))}
		</section>
	);
}