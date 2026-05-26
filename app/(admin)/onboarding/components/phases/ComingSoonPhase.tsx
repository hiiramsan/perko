'use client';

import type { SystemOption } from '../../components/SystemSelectionCombobox';

export function ComingSoonPhase({ system }: { system: SystemOption }) {
	return (
		<>
			<h1 className="mb-2 text-3xl font-semibold leading-tight text-[#0f172a] md:text-4xl">{system.label}</h1>
			<p className="mb-8 text-sm text-[#0f172a]/60">{system.details}</p>

			<div className="rounded-2xl border border-[#dbe4ec] bg-[#f8fbfd] p-5">
				<p className="text-sm font-semibold text-[#0f172a]">Próximamente</p>
				<p className="mt-2 text-sm text-[#475569]">
					Esta fase queda preparada para configuración futura, pero todavía no tiene controles activos.
				</p>
			</div>
		</>
	);
}
