'use client';

import { useEffect } from 'react';
import { X } from 'lucide-react';

type DashboardCardModalProps = {
	open: boolean;
	onClose: () => void;
	children: React.ReactNode;
};

export function DashboardCardModal({ open, onClose, children }: DashboardCardModalProps) {
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
			<button type="button" aria-label="Cerrar tarjeta" className="absolute inset-0 bg-[#0f172a]/55 backdrop-blur-sm" onClick={onClose} />

			<div className="relative z-10 w-full max-w-[26rem] rounded-[2rem] border border-[#d8e2ea] bg-white p-5 shadow-[0_24px_70px_-25px_rgba(15,23,42,0.45)] sm:p-7">
				<div className="flex items-start justify-between gap-4">
					<div>
						<p className="text-xs font-bold uppercase tracking-[0.28em] text-[#64748b]">Tarjeta del negocio</p>
						<h2 className="mt-2 text-2xl font-semibold tracking-tight text-[#0f172a]">Vista previa del sello</h2>
						<p className="mt-2 max-w-md text-sm leading-relaxed text-[#475569]">
							Así es como tus clientes verán tu tarjeta de fidelidad.
						</p>
					</div>

					<button
						type="button"
						onClick={onClose}
						className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#dbe4ec] bg-white text-[#0f172a] transition hover:border-[#05668D] hover:text-[#05668D]"
						aria-label="Cerrar tarjeta"
					>
						<X size={18} />
					</button>
				</div>

				<div className="mt-6">
					{children}
				</div>

				<div className="mt-6 flex justify-end">
					<button
						type="button"
						onClick={onClose}
						className="inline-flex items-center justify-center rounded-full border border-[#dbe4ec] bg-white px-5 py-3 text-sm font-semibold text-[#0f172a] transition hover:border-[#94a3b8] hover:bg-[#f8fbfd]"
					>
						Cerrar
					</button>
				</div>
			</div>
		</div>
	);
}