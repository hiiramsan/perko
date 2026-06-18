'use client';

import { useState } from 'react';
import { Search, Filter, History } from 'lucide-react';
import type { RecentScanRow } from '../dashboard-data';

type RecentScansTableProps = {
	items: RecentScanRow[];
};

export function RecentScansTable({ items }: RecentScansTableProps) {
	const [showFilters, setShowFilters] = useState(false);

	return (
		<section className="flex h-full min-h-0 flex-col rounded-none border border-black bg-white p-4 sm:p-5">
			<div className="flex items-start justify-between gap-4">
				<div>
					<div className="mb-1.5 flex items-center gap-2">
						<span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#64748b]">Últimos escaneos</span>
					</div>
				</div>
				<div className="flex items-center gap-2 relative">
					<div className="relative">
						<Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[#94a3b8]" />
						<input
							type="text"
							placeholder="Buscar escaneo..."
							className="h-8 w-36 rounded-full border border-[#dbe4ec] bg-[#f8fbfd] pl-8 pr-3 text-xs text-[#0f172a] placeholder-[#94a3b8] outline-none transition focus:border-[#0f172a] focus:bg-white sm:w-44"
						/>
					</div>
					<button
						type="button"
						onClick={() => setShowFilters(!showFilters)}
						className={`inline-flex h-8 w-8 items-center justify-center rounded-full border transition ${showFilters ? 'border-[#0f172a] bg-[#0f172a] text-white' : 'border-[#dbe4ec] bg-[#f8fbfd] text-[#334155] hover:border-[#0f172a] hover:bg-white'}`}
						aria-label="Filtrar"
					>
						<Filter size={14} />
					</button>

					{showFilters && (
						<div className="absolute right-0 top-10 z-20 w-64 rounded-2xl border border-[#d8e2ea] bg-white p-4 shadow-[0_12px_30px_-15px_rgba(15,23,42,0.2)]">
							<h3 className="mb-3 text-xs font-bold uppercase tracking-wider text-[#64748b]">Filtros</h3>

							<div className="flex flex-col gap-3">
								<div className="flex flex-col gap-1.5">
									<label className="text-xs font-semibold text-[#0f172a]">Rango de fecha</label>
									<select className="rounded-lg border border-[#e2e8f0] bg-[#f8fafc] px-3 py-1.5 text-xs text-[#334155] outline-none focus:border-[#0f172a]">
										<option>Hoy</option>
										<option>Últimos 7 días</option>
										<option>Último mes</option>
										<option>Personalizado...</option>
									</select>
								</div>

								<div className="flex flex-col gap-1.5">
									<label className="text-xs font-semibold text-[#0f172a]">Transacción</label>
									<select className="rounded-lg border border-[#e2e8f0] bg-[#f8fafc] px-3 py-1.5 text-xs text-[#334155] outline-none focus:border-[#0f172a]">
										<option>Todas</option>
										<option>Puntos sumados</option>
										<option>Premios canjeados</option>
									</select>
								</div>

								<div className="flex flex-col gap-1.5">
									<label className="text-xs font-semibold text-[#0f172a]">Comprador</label>
									<input
										type="text"
										placeholder="Nombre del comprador..."
										className="rounded-lg border border-[#e2e8f0] bg-[#f8fafc] px-3 py-1.5 text-xs text-[#334155] outline-none focus:border-[#0f172a] placeholder-[#94a3b8]"
									/>
								</div>
							</div>
						</div>
					)}
				</div>
			</div>

			<div className="mt-3 flex min-h-0 flex-1 overflow-hidden rounded-[1.5rem] border border-[#edf2f7] bg-[#f9fcfb]">
				<div className="overflow-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
					<table className="w-full border-collapse text-left">
						<thead className="bg-[#f3f7f8] text-[10px] font-bold uppercase tracking-[0.24em] text-[#64748b]">
							<tr>
								<th className="px-4 py-2.5">ID de transacción</th>
								<th className="px-4 py-2.5">Nombre del comprador</th>
								<th className="px-4 py-2.5">Fecha y hora</th>
								<th className="px-4 py-2.5">Transacción</th>
							</tr>
						</thead>
						<tbody>
							{items.map((item) => (
								<tr
									key={item.transactionId}
									className="border-t border-[#edf2f7] bg-white/80 transition hover:bg-white"
								>
                                    <td className="px-4 py-2.5 align-top">
                                        <p className="text-sm text-[#475569]">
                                            {item.transactionId}
                                        </p>
                                    </td>

                                    <td className="px-4 py-2.5 align-top text-sm text-[#475569]">
                                        {item.buyerName}
                                    </td>

									<td className="px-4 py-2.5 align-top text-sm text-[#475569]">
										{item.dateTime}
									</td>

									<td className="px-4 py-2.5 align-top text-sm leading-relaxed text-[#475569]">
										{item.transaction}
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</div>
		</section>
	);
}