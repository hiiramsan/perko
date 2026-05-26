'use client';

import { Link2 } from 'lucide-react';
import { buildSlug } from '../../lib/utils';

export function LinkPhase({
	slug,
	setSlug,
	setSlugTouched,
}: {
	slug: string;
	setSlug: (val: string) => void;
	setSlugTouched: (val: boolean) => void;
}) {
	return (
		<>
			<h1 className="mb-2 text-3xl font-semibold leading-tight text-[#0f172a] md:text-4xl">Define el link de tu negocio</h1>
			<p className="mb-8 text-sm text-[#0f172a]/60">Se autogenera según tu nombre, pero puedes editar la parte final.</p>

			<label className="mb-2 block text-xs font-bold uppercase tracking-wide text-[#334155]">Link público</label>
			<div className="flex items-center gap-2 border-b-2 border-[#57b6d9] pb-2">
				<Link2 size={18} className="text-[#57b6d9]" />
				<span className="text-[#64748b]">perko.com/</span>
				<input
					value={slug}
					onChange={(event) => {
						setSlugTouched(true);
						setSlug(buildSlug(event.target.value));
					}}
					placeholder="tu-negocio"
					className="w-full bg-transparent text-lg text-[#0f172a] placeholder:text-[#9aa8b6] focus:outline-none"
				/>
			</div>
			<p className="mt-3 text-xs text-[#64748b]">
				Link final: <span className="font-semibold text-[#0f172a]">perko.com/{slug || 'tu-negocio'}</span>
			</p>
		</>
	);
}
