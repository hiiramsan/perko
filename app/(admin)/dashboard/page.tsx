'use client';

import { Download } from 'lucide-react';

function BusinessQrGraphic() {
	return (
		<svg viewBox="0 0 240 240" className="h-full w-full" role="img" aria-label="QR del negocio">
			<rect width="240" height="240" rx="28" fill="#ffffff" />
			<rect x="18" y="18" width="204" height="204" rx="18" fill="#f8fbfd" />

			<rect x="36" y="36" width="48" height="48" rx="10" fill="#0f172a" />
			<rect x="48" y="48" width="24" height="24" rx="6" fill="#ffffff" />

			<rect x="156" y="36" width="48" height="48" rx="10" fill="#0f172a" />
			<rect x="168" y="48" width="24" height="24" rx="6" fill="#ffffff" />

			<rect x="36" y="156" width="48" height="48" rx="10" fill="#0f172a" />
			<rect x="48" y="168" width="24" height="24" rx="6" fill="#ffffff" />

			<g fill="#0f172a">
				<rect x="104" y="40" width="12" height="12" rx="3" />
				<rect x="128" y="40" width="12" height="12" rx="3" />
				<rect x="104" y="64" width="12" height="12" rx="3" />
				<rect x="128" y="64" width="12" height="12" rx="3" />
				<rect x="96" y="96" width="12" height="12" rx="3" />
				<rect x="120" y="96" width="12" height="12" rx="3" />
				<rect x="144" y="96" width="12" height="12" rx="3" />
				<rect x="96" y="120" width="12" height="12" rx="3" />
				<rect x="120" y="120" width="12" height="12" rx="3" />
				<rect x="144" y="120" width="12" height="12" rx="3" />
				<rect x="96" y="144" width="12" height="12" rx="3" />
				<rect x="120" y="144" width="12" height="12" rx="3" />
				<rect x="144" y="144" width="12" height="12" rx="3" />
				<rect x="176" y="104" width="12" height="12" rx="3" />
				<rect x="176" y="128" width="12" height="12" rx="3" />
				<rect x="176" y="152" width="12" height="12" rx="3" />
				<rect x="104" y="176" width="12" height="12" rx="3" />
				<rect x="128" y="176" width="12" height="12" rx="3" />
				<rect x="152" y="176" width="12" height="12" rx="3" />
				<rect x="64" y="104" width="12" height="12" rx="3" />
				<rect x="64" y="128" width="12" height="12" rx="3" />
				<rect x="64" y="152" width="12" height="12" rx="3" />
			</g>
		</svg>
	);
}

export default function DashboardPage() {
	return (
		<main className="relative min-h-screen w-full overflow-hidden bg-[#f7f8fa] px-4 py-6 md:px-8 md:py-8">
			<div
				className="absolute inset-0 z-0"
				style={{
					background: '#ffffff',
					backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(0, 0, 0, 0.28) 1px, transparent 0)',
					backgroundSize: '20px 20px',
				}}
			/>

			<div className="absolute inset-0 overflow-hidden">
				<div className="absolute -left-1/4 -top-1/2 h-130 w-130 rounded-full bg-[#d8e6df] blur-[130px]" />
				<div className="absolute -right-1/4 -bottom-1/2 h-110 w-110 rounded-full bg-[#e6ece9] blur-[120px]" />
			</div>

			<div className="relative z-10 flex min-h-[calc(100vh-3rem)] items-center justify-center">
				<div className="w-full max-w-lg rounded-4xl border border-[#d8e2ea] bg-white/95 p-6 shadow-[0_18px_40px_-25px_rgba(15,23,42,0.35)] backdrop-blur sm:p-8">
					<div className="text-center">
						<p className="text-xs font-bold uppercase tracking-[0.28em] text-[#64748b]">QR del negocio</p>
						<h1 className="mt-3 text-3xl font-semibold tracking-tight text-[#0f172a] sm:text-4xl">QR listo para compartir</h1>
						<p className="mt-3 text-sm leading-relaxed text-[#475569]">
							Este QR está visible en todo momento y preparado para impresión o uso en mostrador.
						</p>
					</div>

					<div className="mx-auto mt-8 w-full max-w-88 rounded-4xl border border-[#dbe4ec] bg-[#f8fbfd] p-4 shadow-[0_18px_40px_-28px_rgba(15,23,42,0.45)] sm:p-5">
						<div className="rounded-3xl border border-[#edf2f7] bg-white p-4">
							<div className="aspect-square w-full overflow-hidden rounded-[1.25rem] bg-white p-2 sm:p-3">
								<BusinessQrGraphic />
							</div>
						</div>
					</div>

					<div className="mt-8 flex justify-center">
						<button
							type="button"
							className="inline-flex items-center justify-center gap-2 rounded-full bg-[#0f172a] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#1e293b] focus:outline-none focus:ring-2 focus:ring-[#0f172a] focus:ring-offset-2"
						>
							<Download size={16} />
							Descargar QR para imprimir
						</button>
					</div>
				</div>
			</div>
		</main>
	);
}