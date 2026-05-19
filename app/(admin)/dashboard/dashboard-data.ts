import { Gift, RefreshCcw, ScanLine, Users } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export type DashboardMetric = {
	label: string;
	value: string;
	detail: string;
	icon: LucideIcon;
	accentClass: string;
	stripeClass: string;
	chipLabel: string;
	stampFilled: number;
};

export type ActivityPoint = {
	label: string;
	value: number;
	isHighlighted?: boolean;
};

export type RecentActivityItem = {
	time: string;
	message: string;
	accentClass: string;
};

export type RecentScanRow = {
	transactionId: string;
	buyerName: string;
	dateTime: string;
	transaction: string;
	accentClass: string;
};

export type DashboardPerformanceMetric = {
	key: string;
	label: string;
	value: string;
	detail: string;
	chartData: ActivityPoint[];
	highlightIndex: number;
	accentClass: string;
};

export type DashboardSignal = {
	label: string;
	accentClass: string;
};

export type DashboardScanTickerItem = {
	label: string;
	accentClass: string;
};

export const dashboardMetrics: DashboardMetric[] = [
	{
		label: 'Clientes registrados',
		value: '1,248',
		detail: '+82 esta semana',
		icon: Users,
		accentClass: 'bg-[#2A9D8F]/10 text-[#2A9D8F]',
		stripeClass: 'bg-[#2A9D8F]',
		chipLabel: 'Crecimiento',
		stampFilled: 6,
	},
	{
		label: 'Visitas totales',
		value: '8,430',
		detail: 'Promedio de 19 por día',
		icon: ScanLine,
		accentClass: 'bg-[#ef4f2f]/10 text-[#ef4f2f]',
		stripeClass: 'bg-[#ef4f2f]',
		chipLabel: 'Ritmo alto',
		stampFilled: 8,
	},
	{
		label: 'Premios entregados',
		value: '126',
		detail: '37 canjes este mes',
		icon: Gift,
		accentClass: 'bg-[#05668D]/10 text-[#05668D]',
		stripeClass: 'bg-[#05668D]',
		chipLabel: 'Canjes',
		stampFilled: 4,
	},
	{
		label: 'Tasa de retorno',
		value: '31%',
		detail: '+4 puntos vs. el mes anterior',
		icon: RefreshCcw,
		accentClass: 'bg-[#7b4aa2]/10 text-[#7b4aa2]',
		stripeClass: 'bg-[#7b4aa2]',
		chipLabel: 'Fidelidad',
		stampFilled: 7,
	},
];

export const activityChartData: ActivityPoint[] = [
	{ label: 'Lun', value: 18 },
	{ label: 'Mar', value: 24 },
	{ label: 'Mié', value: 21 },
	{ label: 'Jue', value: 31 },
	{ label: 'Vie', value: 28 },
	{ label: 'Sáb', value: 37 },
	{ label: 'Dom', value: 26 },
];

export const recentActivityItems: RecentActivityItem[] = [
	{ time: 'Hace 5 min', message: 'Ana G. sumó 1 punto', accentClass: 'bg-[#2A9D8F]' },
	{ time: 'Hace 11 min', message: 'Pedro R. canjeó un café Americano', accentClass: 'bg-[#ef4f2f]' },
	{ time: 'Hace 17 min', message: 'Sofía M. registró su visita número 4', accentClass: 'bg-[#05668D]' },
	{ time: 'Hace 24 min', message: 'Carlos L. obtuvo una recompensa gratis', accentClass: 'bg-[#7b4aa2]' },
	{ time: 'Hace 41 min', message: 'María P. escaneó el QR desde mostrador', accentClass: 'bg-[#c58b00]' },
];

export const dashboardPerformanceMetricsToday: DashboardPerformanceMetric[] = [
	{
		key: 'visits',
		label: 'Visitas',
		value: '134',
		detail: 'La actividad de hoy queda resaltada en naranja dentro de la semana',
		chartData: [
			{ label: 'Lun', value: 18 },
			{ label: 'Mar', value: 24 },
			{ label: 'Mié', value: 21 },
			{ label: 'Jue', value: 31, isHighlighted: true },
			{ label: 'Vie', value: 28 },
			{ label: 'Sáb', value: 37 },
			{ label: 'Dom', value: 26 },
		],
		highlightIndex: 3,
		accentClass: 'bg-[#05668D]',
	},
	{
		key: 'new-clients',
		label: 'Nuevos Clientes',
		value: '24',
		detail: 'Registro diario con foco en el día actual',
		chartData: [
			{ label: 'Lun', value: 3 },
			{ label: 'Mar', value: 4 },
			{ label: 'Mié', value: 2 },
			{ label: 'Jue', value: 6, isHighlighted: true },
			{ label: 'Vie', value: 5 },
			{ label: 'Sáb', value: 7 },
			{ label: 'Dom', value: 4 },
		],
		highlightIndex: 3,
		accentClass: 'bg-[#2A9D8F]',
	},
	{
		key: 'rewards',
		label: 'Premios Canjeados',
		value: '8',
		detail: 'Canjes del día, con énfasis visual en la jornada actual',
		chartData: [
			{ label: 'Lun', value: 1 },
			{ label: 'Mar', value: 2 },
			{ label: 'Mié', value: 1 },
			{ label: 'Jue', value: 3, isHighlighted: true },
			{ label: 'Vie', value: 2 },
			{ label: 'Sáb', value: 4 },
			{ label: 'Dom', value: 3 },
		],
		highlightIndex: 3,
		accentClass: 'bg-[#ef4f2f]',
	},
];

export const dashboardPerformanceMetricsHistorical: DashboardPerformanceMetric[] = [
	{
		key: 'registered-clients',
		label: 'Clientes registrados',
		value: '1,248',
		detail: 'Acumulado histórico de registros por semana',
		chartData: [
			{ label: 'Sem 1', value: 180 },
			{ label: 'Sem 2', value: 214 },
			{ label: 'Sem 3', value: 202 },
			{ label: 'Sem 4', value: 236, isHighlighted: true },
			{ label: 'Sem 5', value: 268 },
			{ label: 'Sem 6', value: 238 },
			{ label: 'Sem 7', value: 280 },
		],
		highlightIndex: 3,
		accentClass: 'bg-[#2A9D8F]',
	},
	{
		key: 'total-visits',
		label: 'Visitas totales',
		value: '8,430',
		detail: 'Tendencia consolidada de visitas a lo largo del periodo',
		chartData: [
			{ label: 'Sem 1', value: 920 },
			{ label: 'Sem 2', value: 1050 },
			{ label: 'Sem 3', value: 980 },
			{ label: 'Sem 4', value: 1124, isHighlighted: true },
			{ label: 'Sem 5', value: 1206 },
			{ label: 'Sem 6', value: 1150 },
			{ label: 'Sem 7', value: 1278 },
		],
		highlightIndex: 3,
		accentClass: 'bg-[#05668D]',
	},
	{
		key: 'delivered-rewards',
		label: 'Premios entregados',
		value: '126',
		detail: 'Canjes totales en el histórico mostrado',
		chartData: [
			{ label: 'Sem 1', value: 12 },
			{ label: 'Sem 2', value: 14 },
			{ label: 'Sem 3', value: 9 },
			{ label: 'Sem 4', value: 17, isHighlighted: true },
			{ label: 'Sem 5', value: 19 },
			{ label: 'Sem 6', value: 15 },
			{ label: 'Sem 7', value: 20 },
		],
		highlightIndex: 3,
		accentClass: 'bg-[#ef4f2f]',
	},
];

export const recentScanRows: RecentScanRow[] = [
	{ transactionId: 'TX-1048', buyerName: 'Ana G.', dateTime: '19 May, 10:42', transaction: 'Canjeó café y sumó 1 punto', accentClass: 'bg-[#2A9D8F]' },
	{ transactionId: 'TX-1047', buyerName: 'Pedro R.', dateTime: '19 May, 10:31', transaction: 'Escaneó el QR y registró visita', accentClass: 'bg-[#05668D]' },
	{ transactionId: 'TX-1046', buyerName: 'Sofía M.', dateTime: '19 May, 10:18', transaction: 'Canjeó un premio y cerró su tarjeta', accentClass: 'bg-[#ef4f2f]' },
	{ transactionId: 'TX-1045', buyerName: 'Carlos L.', dateTime: '19 May, 10:04', transaction: 'Sumó 1 punto por compra', accentClass: 'bg-[#7b4aa2]' },
];

export const recentActivityTickerItems: DashboardScanTickerItem[] = [
	{ label: 'Ana G. +1 punto', accentClass: 'bg-[#2A9D8F]' },
	{ label: 'Pedro R. canjeó café', accentClass: 'bg-[#ef4f2f]' },
	{ label: 'Sofía M. visita #4', accentClass: 'bg-[#05668D]' },
	{ label: 'Carlos L. premio gratis', accentClass: 'bg-[#7b4aa2]' },
	{ label: 'María P. escaneó el QR', accentClass: 'bg-[#c58b00]' },
];

export const dashboardSignals: DashboardSignal[] = [
	{ label: '3 canjes hoy', accentClass: 'text-[#ef4f2f]' },
	{ label: '12 visitas en la última hora', accentClass: 'text-[#05668D]' },
	{ label: 'Logo vacío listo para personalizar', accentClass: 'text-[#2A9D8F]' },
	{ label: 'QR activo para mostrador', accentClass: 'text-[#7b4aa2]' },
	{ label: '84% de clientes vuelven', accentClass: 'text-[#c58b00]' },
];