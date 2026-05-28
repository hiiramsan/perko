import { Trophy, Star } from 'lucide-react';

export function TopClientsCard() {
	return (
		<section className="flex h-full min-h-0 flex-col rounded-none border border-black bg-white p-4 sm:p-5">
			<div className="mb-3 flex items-center gap-2">
				<span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#64748b]">Top 3 Clientes (Semana)</span>
			</div>
			
			<div className="flex flex-1 flex-col justify-center gap-2.5">
				{[
					{ name: 'Ana G.', visits: 5, bgColor: 'bg-[#fff9e6]', color: 'text-[#f59e0b]', border: 'border-[#fef3c7]' },
					{ name: 'Carlos L.', visits: 4, bgColor: 'bg-[#f1f5f9]', color: 'text-[#94a3b8]', border: 'border-[#e2e8f0]' },
					{ name: 'Sofía M.', visits: 4, bgColor: 'bg-[#fdf4ea]', color: 'text-[#d97706]', border: 'border-[#ffedd5]' }
				].map((client, i) => (
					<div key={i} className="flex items-center justify-between rounded-xl border border-[#edf2f7] bg-[#f9fcfb] p-3 transition hover:bg-white">
						<div className="flex items-center gap-3">
							<div className={`flex h-7 w-7 items-center justify-center rounded-full font-bold text-xs ${client.bgColor} ${client.color} ${client.border} border`}>
								#{i + 1}
							</div>
							<div className="text-sm font-semibold text-[#0f172a]">{client.name}</div>
						</div>
						<div className="flex items-center gap-1 text-xs font-medium text-[#64748b]">
							<Star size={12} className={client.color} />
							<span>{client.visits} visitas</span>
						</div>
					</div>
				))}
			</div>
			
			<div className="mt-2 flex justify-end">
				<button type="button" className="text-xs font-semibold text-[#ef4f2f] hover:underline">Ver más &rarr;</button>
			</div>
		</section>
	);
}
