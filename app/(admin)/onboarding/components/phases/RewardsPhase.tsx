'use client';

export function RewardsPhase({
	rewardProduct,
	setRewardProduct,
	rewardVisits,
	setRewardVisits,
}: {
	rewardProduct: string;
	setRewardProduct: (val: string) => void;
	rewardVisits: string;
	setRewardVisits: (val: string) => void;
}) {
	return (
		<>
			<h1 className="mb-2 text-3xl font-semibold leading-tight text-[#0f172a] md:text-4xl">Configura la recompensa por visitas</h1>
			<p className="mb-8 text-sm text-[#0f172a]/60">El cliente obtiene un producto gratis cuando completa las visitas o compras necesarias.</p>

			<div className="space-y-6">
				<div className="space-y-2">
					<label className="block text-xs font-bold uppercase tracking-wide text-[#334155]">Producto gratis</label>
					<input
						value={rewardProduct}
						onChange={(event) => setRewardProduct(event.target.value)}
						placeholder="Ej. café chico gratis"
						className="w-full rounded-2xl border border-[#dbe4ec] bg-white px-4 py-3 text-[#0f172a] placeholder:text-[#9aa8b6] focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[#2A9D8F]"
					/>
				</div>

				<div className="space-y-2">
					<label className="block text-xs font-bold uppercase tracking-wide text-[#334155]">Visitas necesarias</label>
					<input
						type="number"
						min="1"
						value={rewardVisits}
						onChange={(event) => setRewardVisits(event.target.value)}
						className="w-full rounded-2xl border border-[#dbe4ec] bg-white px-4 py-3 text-[#0f172a] focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[#2A9D8F]"
					/>
				</div>
			</div>
		</>
	);
}
