'use client';

import type { RecentActivityItem } from '../dashboard-data';

type RecentActivityFeedProps = {
	items: RecentActivityItem[];
};

export function RecentActivityFeed({ items }: RecentActivityFeedProps) {
	return (
		<section className="rounded-[2rem] border border-[#d8e2ea] bg-white/92 p-5 shadow-[0_12px_30px_-24px_rgba(15,23,42,0.35)] backdrop-blur sm:p-6">
			<div className="flex items-end justify-between gap-4">
				<div>
					<p className="text-xs font-bold uppercase tracking-[0.28em] text-[#64748b]">Actividad reciente</p>
					<h2 className="mt-2 text-2xl font-semibold tracking-tight text-[#0f172a]">Últimos escaneos</h2>
				</div>
				<div className="rounded-full border border-[#dbe4ec] bg-[#f8fbfd] px-3 py-1 text-xs font-semibold text-[#334155]">
					Live
				</div>
			</div>

			<ul className="mt-5 space-y-3">
				{items.map((item) => (
					<li key={`${item.time}-${item.message}`} className="rounded-[1.25rem] border border-[#edf2f7] bg-[#f9fcfb] p-4">
						<div className="flex items-start gap-3">
							<span className={`mt-1 h-2.5 w-2.5 shrink-0 rounded-full ${item.accentClass}`} />
							<div className="min-w-0 flex-1">
								<p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#64748b]">{item.time}</p>
								<p className="mt-2 text-sm leading-relaxed text-[#0f172a]">{item.message}</p>
							</div>
						</div>
					</li>
				))}
			</ul>
		</section>
	);
}