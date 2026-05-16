'use client';

import type { LucideIcon } from 'lucide-react';

export type DashboardKpiCardProps = {
	label: string;
	value: string;
	detail: string;
	icon: LucideIcon;
	accentClass: string;
	stripeClass: string;
	chipLabel: string;
	stampFilled: number;
};

const TOTAL_STAMPS = 10;

export function DashboardKpiCard({ label, value, detail, icon: Icon, accentClass, stripeClass, chipLabel, stampFilled }: DashboardKpiCardProps) {
	const stamps = Array.from({ length: TOTAL_STAMPS }, (_, index) => index);

	return (
		<article className="overflow-hidden rounded-[1.75rem] border border-[#dbe4ec] bg-white shadow-[0_16px_34px_-28px_rgba(15,23,42,0.45)]">
			<div className={`h-1.5 ${stripeClass}`} />
			<div className="p-4 sm:p-5">
				<div className="flex items-start justify-between gap-4">
					<div className={`flex h-11 w-11 items-center justify-center rounded-2xl ${accentClass}`}>
						<Icon size={18} />
					</div>

					<span className="rounded-full border border-[#dbe4ec] bg-[#f8fbfd] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.22em] text-[#475569]">
						{chipLabel}
					</span>
				</div>

				<div className="mt-4">
					<p className="text-sm font-medium text-[#64748b]">{label}</p>
					<p className="mt-1 text-3xl font-semibold tracking-tight text-[#0f172a]">{value}</p>
					<p className="mt-2 text-xs font-medium text-[#475569]">{detail}</p>
				</div>
			</div>
		</article>
	);
}