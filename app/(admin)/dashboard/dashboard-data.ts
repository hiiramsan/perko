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
};

export type RecentActivityItem = {
	time: string;
	message: string;
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