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

			<div className="relative z-10 w-full max-w-3xl rounded-[2rem] border border-[#d8e2ea] bg-white p-5 shadow-[0_24px_70px_-25px_rgba(15,23,42,0.45)] sm:p-8">
				<div className="flex items-start justify-between gap-4 mb-6">
					<div>
						<p className="text-xs font-bold uppercase tracking-[0.28em] text-[#64748b]">Tarjeta de fidelidad</p>
						<h2 className="mt-2 text-2xl font-semibold tracking-tight text-[#0f172a]">Personaliza tu tarjeta</h2>
					</div>

					<button
						type="button"
						onClick={onClose}
						className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#dbe4ec] bg-white text-[#0f172a] transition hover:border-[#05668D] hover:bg-[#f8fbfd]"
						aria-label="Cerrar tarjeta"
					>
						<X size={18} />
					</button>
				</div>

				<div className="mt-2 text-left">
					{children}
				</div>
			</div>
		</div>
	);
}