'use client';

import { useEffect } from 'react';
import { Download, X } from 'lucide-react';
import { DashboardQrGraphic } from './DashboardQrGraphic';

type DashboardQrModalProps = {
	open: boolean;
	onClose: () => void;
};

export function DashboardQrModal({ open, onClose }: DashboardQrModalProps) {
	useEffect(() => {
		if (!open) return;

		const handleKeyDown = (event: KeyboardEvent) => {
			if (event.key === 'Escape') onClose();
		};

		window.addEventListener('keydown', handleKeyDown);
		return () => window.removeEventListener('keydown', handleKeyDown);
	}, [open, onClose]);

	if (!open) return null;

	return (
		<div className="fixed inset-0 z-40 flex items-center justify-center px-4 py-6">
			<button type="button" aria-label="Cerrar modal QR" className="absolute inset-0 bg-[#0f172a]/55 backdrop-blur-sm" onClick={onClose} />

			<div className="relative z-10 w-full max-w-lg rounded-[2rem] border border-[#d8e2ea] bg-white p-5 shadow-[0_24px_70px_-25px_rgba(15,23,42,0.45)] sm:p-7">
				<div className="flex items-start justify-between gap-4">
					<div>
						<p className="text-xs font-bold uppercase tracking-[0.28em] text-[#64748b]">QR del negocio</p>
						<h2 className="mt-2 text-2xl font-semibold tracking-tight text-[#0f172a]">Listo para imprimir o compartir</h2>
						<p className="mt-2 max-w-md text-sm leading-relaxed text-[#475569]">
							Puedes cerrar este modal en cualquier momento y volver a abrirlo desde el botón flotante.
						</p>
					</div>

					<button
						type="button"
						onClick={onClose}
						className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#dbe4ec] bg-white text-[#0f172a] transition hover:border-[#05668D] hover:text-[#05668D]"
						aria-label="Cerrar QR"
					>
						<X size={18} />
					</button>
				</div>

				<div className="mx-auto mt-6 w-full max-w-[22rem] rounded-[2rem] border border-[#dbe4ec] bg-[#f8fbfd] p-4 sm:p-5">
					<div className="rounded-[1.5rem] border border-[#edf2f7] bg-white p-4">
						<div className="aspect-square w-full overflow-hidden rounded-[1.25rem] bg-white p-2 sm:p-3">
							<DashboardQrGraphic />
						</div>
					</div>
				</div>

				<div className="mt-6 flex flex-col gap-3 sm:flex-row">
					<button
						type="button"
						className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-[#0f172a] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#1e293b]"
					>
						<Download size={16} />
						Descargar QR para imprimir
					</button>

					<button
						type="button"
						onClick={onClose}
						className="inline-flex flex-1 items-center justify-center rounded-full border border-[#dbe4ec] bg-white px-5 py-3 text-sm font-semibold text-[#0f172a] transition hover:border-[#94a3b8] hover:bg-[#f8fbfd]"
					>
						Cerrar
					</button>
				</div>
			</div>
		</div>
	);
}