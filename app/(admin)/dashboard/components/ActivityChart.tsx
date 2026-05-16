'use client';

import { useMemo } from 'react';
import type { ActivityPoint } from '../dashboard-data';

type ActivityChartProps = {
	data: ActivityPoint[];
};

export function ActivityChart({ data }: ActivityChartProps) {
	const chart = useMemo(() => {
		const width = 720;
		const height = 320;
		const paddingX = 56;
		const paddingTop = 32;
		const paddingBottom = 64;
		const innerWidth = width - paddingX * 2;
		const innerHeight = height - paddingTop - paddingBottom;
		const maxValue = Math.max(...data.map((point) => point.value), 1);
		const points = data.map((point, index) => {
			const x = paddingX + (innerWidth / Math.max(data.length - 1, 1)) * index;
			const y = paddingTop + innerHeight - (point.value / maxValue) * innerHeight;
			return { ...point, x, y };
		});
		const linePath = points.map((point, index) => `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`).join(' ');
		const lastPoint = points[points.length - 1];
		const areaPath = `${linePath} L ${lastPoint?.x ?? width} ${height - paddingBottom} L ${points[0]?.x ?? paddingX} ${height - paddingBottom} Z`;

		return { width, height, points, linePath, areaPath };
	}, [data]);

	return (
		<svg viewBox={`0 0 ${chart.width} ${chart.height}`} className="h-full w-full" role="img" aria-label="Gráfica de actividad">
			<defs>
				<linearGradient id="chart-fill" x1="0" x2="0" y1="0" y2="1">
					<stop offset="0%" stopColor="#2A9D8F" stopOpacity="0.22" />
					<stop offset="100%" stopColor="#2A9D8F" stopOpacity="0.02" />
				</linearGradient>
			</defs>

			{[0, 1, 2, 3, 4].map((line) => {
				const y = 32 + ((chart.height - 32 - 64) / 4) * line;
				return <line key={line} x1="56" x2="664" y1={y} y2={y} stroke="#e7edf2" strokeDasharray="4 6" />;
			})}

			<path d={chart.areaPath} fill="url(#chart-fill)" />
			<path d={chart.linePath} fill="none" stroke="#2A9D8F" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />

			{chart.points.map((point) => (
				<circle key={point.label} cx={point.x} cy={point.y} r="6" fill="#2A9D8F" stroke="#ffffff" strokeWidth="4" />
			))}

			{chart.points.map((point) => (
				<text key={`label-${point.label}`} x={point.x} y={286} textAnchor="middle" className="fill-[#64748b] text-[12px] font-semibold">
					{point.label}
				</text>
			))}

			{chart.points.map((point) => (
				<text key={`value-${point.label}`} x={point.x} y={point.y - 14} textAnchor="middle" className="fill-[#0f172a] text-[12px] font-semibold">
					{point.value}
				</text>
			))}
		</svg>
	);
}