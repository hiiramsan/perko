import { Clock, Coffee, Bell, Lightbulb } from 'lucide-react';

export function PeakHourCard() {
	return (
		<section className="flex h-full min-h-0 flex-col rounded-none border border-black bg-white p-4 sm:p-5 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
			<div className="mb-3 flex shrink-0 items-center gap-2">
				<span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#64748b]">Insights del Día</span>
			</div>

			<div className="flex flex-1 flex-col justify-center gap-2.5">
				<div className="flex items-start gap-3 rounded-xl border border-[#edf2f7] bg-[#f9fcfb] p-3 transition hover:bg-white">
					<div className="mt-0.5 text-black">
						<Clock size={16} />
					</div>

					<div className="flex-1">
						<h4 className="text-xs font-bold text-[#0f172a]">Hora Pico de Hoy</h4>
						<p className="mt-0.5 text-xs leading-relaxed text-[#475569]">
							Tu mayor flujo de escaneos hoy fue entre las 2:00 PM y las 3:00 PM (15 visitas).
						</p>

						<div className="mt-1.5 flex justify-end">
							<button
								type="button"
								className="text-[10px] font-semibold text-[#d97706] hover:underline"
							>
								Ver más &rarr;
							</button>
						</div>
					</div>
				</div>

				<div className="flex items-start gap-3 rounded-xl border border-[#edf2f7] bg-[#f9fcfb] p-3 transition hover:bg-white">
					<div className="mt-0.5 text-black">
						<Coffee size={16} />
					</div>

					<div className="flex-1">
						<h4 className="text-xs font-bold text-[#0f172a]">El Producto Estrella</h4>
						<p className="mt-0.5 text-xs leading-relaxed text-[#475569]">
							60% de los puntos de hoy se generaron por compras de Café Americano.
						</p>

						<div className="mt-1.5 flex justify-end">
							<button
								type="button"
								className="text-[10px] font-semibold text-[#d97706] hover:underline"
							>
								Ver más &rarr;
							</button>
						</div>
					</div>
				</div>

				<div className="flex items-start gap-3 rounded-xl border border-[#edf2f7] bg-[#f9fcfb] p-3 transition hover:bg-white">
					<div className="mt-0.5 text-black">
						<Bell size={16} />
					</div>

					<div className="flex-1">
						<h4 className="text-xs font-bold text-[#0f172a]">
							Alerta de Canjes Próximos
						</h4>

						<p className="mt-0.5 text-xs leading-relaxed text-[#475569]">
							Hay 8 clientes en el local que están a 1 solo punto de ganar su premio.
						</p>

						<div className="mt-1.5 flex justify-end">
							<button
								type="button"
								className="text-[10px] font-semibold text-[#ef4f2f] hover:underline"
							>
								Ver más &rarr;
							</button>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}