'use client';

export function BusinessPhase({
	businessName,
	setBusinessName,
}: {
	businessName: string;
	setBusinessName: (value: string) => void;
}) {
	return (
		<>
			<h1 className="mb-2 text-3xl font-semibold leading-tight text-[#0f172a] md:text-4xl">
				¿Cómo se llama tu negocio?
			</h1>
			<p className="mb-8 text-sm text-[#0f172a]/60">Lo usaremos para personalizar tu tarjeta y crear tu link.</p>

			<label className="mb-2 block text-xs font-bold uppercase tracking-wide text-[#334155]">Nombre del negocio</label>
			<div className="flex items-center gap-2 border-b-2 border-[#57b6d9] pb-2">
				<input
					value={businessName}
					onChange={(event) => setBusinessName(event.target.value)}
					placeholder="Ej. Matcha House"
					className="w-full bg-transparent text-lg text-[#0f172a] placeholder:text-[#9aa8b6] focus:outline-none"
				/>
			</div>
		</>
	);
}
