'use client';

import { CARD_COLORS } from '../../lib/constants';

export function ColorPhase({
	cardColor,
	setCardColor,
}: {
	cardColor: string;
	setCardColor: (val: string) => void;
}) {
	return (
		<>
			<h1 className="mb-2 text-3xl font-semibold leading-tight text-[#0f172a] md:text-4xl">Elige el color de tu tarjeta</h1>
			<p className="mb-8 text-sm text-[#0f172a]/60">Así verás en vivo cómo se personaliza el diseño antes de pasar a los sistemas.</p>

			<label className="mb-3 block text-xs font-bold uppercase tracking-wide text-[#334155]">Color de la tarjeta</label>
			<div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
				{CARD_COLORS.map((option) => {
					const isSelected = cardColor === option.value;

					return (
						<button
							key={option.id}
							type="button"
							onClick={() => setCardColor(option.value)}
							className={`rounded-2xl border p-3 text-left transition ${isSelected ? 'border-[#0f172a] bg-white shadow-[0_10px_24px_-18px_rgba(15,23,42,0.55)]' : 'border-[#dbe4ec] bg-[#f8fbfd] hover:border-[#94a3b8]'}`}
						>
							<div className="flex items-center gap-3">
								<span className="h-10 w-10 rounded-full border border-white shadow-sm" style={{ backgroundColor: option.value }} />
								<div>
									<p className="text-sm font-semibold text-[#0f172a]">{option.label}</p>
									<p className="text-xs text-[#64748b]">{isSelected ? 'Seleccionado' : 'Toca para usarlo'}</p>
								</div>
							</div>
						</button>
					);
				})}
			</div>

			<div className="mt-4 rounded-2xl border border-dashed border-[#c6d3de] bg-[#f8fbfd] p-4">
				<div className="flex items-center justify-between gap-4">
					<div>
						<p className="text-sm font-semibold text-[#0f172a]">Color libre</p>
						<p className="mt-1 text-xs text-[#64748b]">Si ninguno te convence, elige cualquier color que quieras.</p>
					</div>
					<label className="inline-flex cursor-pointer items-center gap-3 rounded-full border border-[#dbe4ec] bg-white px-3 py-2">
						<span className="text-xs font-semibold uppercase tracking-wide text-[#334155]">Elegir</span>
						<input
							type="color"
							value={cardColor}
							onChange={(event) => setCardColor(event.target.value)}
							className="h-10 w-10 cursor-pointer rounded-full border border-[#dbe4ec] bg-transparent p-0"
						/>
					</label>
				</div>
			</div>
		</>
	);
}
