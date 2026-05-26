'use client';

export function PointsPhase({
	pointsPerPeso,
	setPointsPerPeso,
	pesosPerPoint,
	setPesosPerPoint,
}: {
	pointsPerPeso: string;
	setPointsPerPeso: (val: string) => void;
	pesosPerPoint: string;
	setPesosPerPoint: (val: string) => void;
}) {
	return (
		<>
			<h1 className="mb-2 text-3xl font-semibold leading-tight text-[#0f172a] md:text-4xl">Configura los puntos por compra</h1>
			<p className="mb-8 text-sm text-[#0f172a]/60">Por cada compra se ganan puntos. Aquí defines la conversión entre peso y puntos.</p>

			<div className="space-y-6">
				<div className="space-y-2">
					<label className="block text-xs font-bold uppercase tracking-wide text-[#334155]">¿Cada cuántos pesos se gana un punto?</label>
					<input
						type="number"
						min="1"
						value={pointsPerPeso}
						onChange={(event) => setPointsPerPeso(event.target.value)}
						className="w-full rounded-2xl border border-[#dbe4ec] bg-white px-4 py-3 text-[#0f172a] focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[#2A9D8F]"
					/>
				</div>

				<div className="space-y-2">
					<label className="block text-xs font-bold uppercase tracking-wide text-[#334155]">¿Cuánto vale 1 punto al momento de pagar?</label>
					<input
						type="number"
						min="1"
						value={pesosPerPoint}
						onChange={(event) => setPesosPerPoint(event.target.value)}
						className="w-full rounded-2xl border border-[#dbe4ec] bg-white px-4 py-3 text-[#0f172a] focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[#2A9D8F]"
					/>
				</div>
			</div>
		</>
	);
}
