'use client';

const COLOR_PALETTE = [
	'#ffffff',
	'#111827', '#374151', '#6b7280',
	'#0f172a', '#1e293b', '#334155',
	'#0f4c5c', '#05668D', '#0a9396',
	'#0b7285', '#2c7da0', '#468faf',
	'#2f6f3e', '#3f7d20', '#5a8f29',
	'#6a994e', '#a7c957', '#b7e4c7',
	'#7f1d1d', '#b91c1c', '#dc2626',
	'#f97316', '#f59e0b', '#facc15',
	'#6d28d9', '#7c3aed', '#a855f7',
	'#9d4edd', '#b5179e', '#e11d48',
	'#14b8a6',
];

export function ColorPhase({
	cardColor,
	setCardColor,
}: {
	cardColor: string;
	setCardColor: (val: string) => void;
}) {
	return (
		<div className="max-w-lg">
			<h1 className="mb-2 text-3xl font-semibold leading-tight text-[#0f172a] md:text-4xl">Elige el color de tu tarjeta</h1>
			<p className="mb-6 text-sm text-[#0f172a]/60">Así verás en vivo cómo se personaliza el diseño antes de pasar a los sistemas.</p>

			<div className="grid grid-cols-6 gap-3 sm:grid-cols-8">
				{COLOR_PALETTE.map((color) => {
					const isSelected = cardColor.toLowerCase() === color.toLowerCase();

					return (
						<button
							key={color}
							type="button"
							onClick={() => setCardColor(color)}
							aria-label="Seleccionar color"
							className={`relative flex h-10 w-10 items-center justify-center rounded-full transition cursor-pointer ${isSelected ? 'ring-2 ring-[#05668D] ring-offset-2 ring-offset-white' : 'hover:ring-2 hover:ring-[#cfd8e3]'
								}`}
						>
							<span className="h-9 w-9 rounded-full border border-[#dbe4ec] shadow-sm" style={{ backgroundColor: color }} />
						</button>
					);
				})}
			</div>

			<div className="mt-6 flex flex-wrap items-center gap-3 rounded-2xl border border-[#dbe4ec] bg-white/70 p-4">
				<label className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-[#dbe4ec] bg-white px-3 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#475569] shadow-sm transition hover:border-[#94a3b8] relative">
					<span
						className="h-5 w-5 rounded-full border border-[#e2e8f0] shadow-sm flex-shrink-0"
						style={{ backgroundColor: cardColor }}
					/>
					<span>Elegir</span>
					<input
						type="color"
						value={cardColor}
						onChange={(event) => setCardColor(event.target.value)}
						className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
					/>
				</label>
				<div className="min-w-[140px] flex-1">
					<input
						type="text"
						value={cardColor}
						onChange={(event) => setCardColor(event.target.value)}
						placeholder="#05668D"
						className="w-full rounded-lg border border-[#dbe4ec] bg-white px-3 py-2 text-sm font-semibold text-[#0f172a] shadow-sm focus:border-[#94a3b8] focus:outline-none"
					/>
				</div>
			</div>
		</div>
	);
}