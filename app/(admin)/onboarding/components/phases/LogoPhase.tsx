'use client';

import { ImageUp } from 'lucide-react';

export function LogoPhase({
	logoFile,
	logoPreview,
	handleLogoChange,
}: {
	logoFile: File | null;
	logoPreview: string;
	handleLogoChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}) {
	return (
		<>
			<h1 className="mb-2 text-3xl font-semibold leading-tight text-[#0f172a] md:text-4xl">Sube el logo de tu negocio</h1>
			<p className="mb-8 text-sm text-[#0f172a]/60">Tu logo aparecerá en la tarjeta digital y en tu página de negocio.</p>

			<label className="mb-2 block text-xs font-bold uppercase tracking-wide text-[#334155]">Logo del negocio</label>
			<label className="flex cursor-pointer items-center justify-between gap-4 rounded-xl border-2 border-dashed border-[#c6d3de] bg-[#f8fbfd] p-5 transition hover:border-[#57b6d9]">
				<div className="flex items-center gap-3">
					<ImageUp size={22} className="text-[#57b6d9]" />
					<span className="text-sm font-semibold text-[#334155]">{logoFile ? logoFile.name : 'Seleccionar archivo'}</span>
				</div>
				<span className="rounded-md bg-[#0f172a] px-3 py-1.5 text-xs font-semibold uppercase text-white">Subir</span>
				<input type="file" accept="image/*" className="hidden" onChange={handleLogoChange} />
			</label>

			{logoPreview ? (
				<div className="mt-5 flex items-center gap-4 rounded-xl border border-[#dbe4ec] bg-white p-3">
					<img src={logoPreview} alt="Preview del logo" className="h-14 w-14 rounded-lg border border-[#dbe4ec] object-cover" />
					<p className="text-sm font-medium text-[#334155]">Vista previa cargada correctamente</p>
				</div>
			) : null}
		</>
	);
}
