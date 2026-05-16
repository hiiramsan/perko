'use client';

import { useState } from 'react';
import { BadgeCheck, QrCode } from 'lucide-react';
import { Highlighter } from '@/components/ui/highlighter';
import { Marquee } from '@/components/ui/marquee';
import StampPreviewCard from '@/app/(admin)/onboarding/components/StampPreviewCard';
import { ActivityChart } from './components/ActivityChart';
import { DashboardFloatingQrButton } from './components/DashboardFloatingQrButton';
import { DashboardCardModal } from './components/DashboardCardModal';
import { DashboardKpiGrid } from './components/DashboardKpiGrid';
import { DashboardQrModal } from './components/DashboardQrModal';
import { RecentActivityFeed } from './components/RecentActivityFeed';
import { activityChartData, dashboardMetrics, recentActivityItems, recentActivityTickerItems } from './dashboard-data';

export default function DashboardPage() {
	const [isQrModalOpen, setIsQrModalOpen] = useState(false);
	const [isCardModalOpen, setIsCardModalOpen] = useState(false);

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
				<div className="absolute left-[16%] top-[18%] h-44 w-44 rounded-full bg-[#eef2f1] blur-[80px]" />
			</div>

			<div className="relative z-10 mx-auto flex w-full max-w-7xl flex-col gap-6">
				<header className="flex flex-col gap-4 rounded-[2rem] border border-[#d8e2ea] bg-white/94 px-5 py-5 shadow-[0_18px_40px_-25px_rgba(15,23,42,0.18)] backdrop-blur sm:flex-row sm:items-end sm:justify-between sm:px-6">
					<div className="flex items-start gap-3">
						<div>
							<p className="text-xs font-bold uppercase tracking-[0.32em] text-[#64748b]">Panel de fidelidad</p>
							<h1 className="mt-2 text-3xl font-semibold tracking-tight text-[#0f172a] sm:text-4xl">Perko dashboard</h1>
							<p className="mt-2 max-w-2xl text-sm leading-relaxed text-[#475569]">
								La actividad del negocio se ve como una tarjeta viva: sello, ritmo y QR conviven en una misma superficie.
							</p>
						</div>
					</div>
					<div className="flex h-12 w-12 items-center justify-center self-start rounded-2xl border border-[#dbe4ec] bg-[#f8fbfd] text-[#05668D] sm:self-auto">
						<BadgeCheck size={24} strokeWidth={2.4} />
					</div>
				</header>

				<DashboardKpiGrid metrics={dashboardMetrics} />

                <section className="grid gap-6 lg:grid-cols-[0.98fr_1.02fr]">
						<article className="overflow-hidden rounded-[2rem] border border-[#d8e2ea] bg-white/94 shadow-[0_18px_40px_-26px_rgba(15,23,42,0.2)] backdrop-blur">
						<div className="border-b border-[#edf2f7] bg-[#f8fbfd] px-5 py-5 sm:px-6">
							<p className="text-[11px] font-bold uppercase tracking-[0.34em] text-[#64748b]">Actividad en tiempo real</p>
							<h2 className="mt-2 text-2xl font-semibold tracking-tight text-[#0f172a] sm:text-3xl">
								Convierte cada visita en <Highlighter action="underline" color="#FF9800" strokeWidth={3}>ritmo</Highlighter>
							</h2>
							<p className="mt-2 max-w-2xl text-sm leading-relaxed text-[#475569]">
									Hoy has tenido un 15% más de actividad que el promedio de los sábados.
							</p>
						</div>

						<div className="px-5 py-5 sm:px-6">
							<div className="flex flex-wrap gap-3">
								<button
									type="button"
									onClick={() => setIsQrModalOpen(true)}
									className="inline-flex items-center justify-center gap-2 rounded-full bg-[#05668D] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#045676]"
								>
									<QrCode size={16} />
									Mostrar QR
								</button>
								<button
									type="button"
										onClick={() => setIsCardModalOpen(true)}
										className="inline-flex items-center justify-center rounded-full border border-[#dbe4ec] bg-white px-4 py-3 text-sm font-semibold text-[#0f172a] transition hover:border-[#94a3b8] hover:bg-[#f8fbfd]"
								>
										Ver tarjeta
								</button>
							</div>

							<div className="mt-5 space-y-3">
								<Marquee pauseOnHover className="[--duration:22s]">
									{recentActivityTickerItems.map((item) => (
										<span key={`ticker-a-${item.label}`} className="mx-2 inline-flex items-center gap-2 rounded-full border border-[#dbe4ec] bg-white px-4 py-2 text-sm font-semibold text-[#0f172a] shadow-[0_10px_22px_-18px_rgba(15,23,42,0.45)]">
											<span className={`h-2.5 w-2.5 rounded-full ${item.accentClass}`} />
											{item.label}
										</span>
									))}
								</Marquee>
								<Marquee pauseOnHover reverse className="[--duration:22s]">
									{recentActivityTickerItems.map((item) => (
										<span key={`ticker-b-${item.label}`} className="mx-2 inline-flex items-center gap-2 rounded-full border border-[#dbe4ec] bg-white px-4 py-2 text-sm font-semibold text-[#0f172a] shadow-[0_10px_22px_-18px_rgba(15,23,42,0.45)]">
											<span className={`h-2.5 w-2.5 rounded-full ${item.accentClass}`} />
											{item.label}
										</span>
									))}
								</Marquee>
							</div>
						</div>
					</article>

						<div className="rounded-[2rem] border border-[#d8e2ea] bg-white/94 p-5 shadow-[0_18px_40px_-26px_rgba(15,23,42,0.2)] backdrop-blur sm:p-6">
							<div className="flex items-start justify-between gap-4">
								<div>
									<p className="text-xs font-bold uppercase tracking-[0.28em] text-[#64748b]">Rendimiento semanal</p>
									<h2 className="mt-2 text-2xl font-semibold tracking-tight text-[#0f172a]">Tendencia de visitas</h2>
								</div>
								<span className="rounded-full border border-[#dbe4ec] bg-[#f8fbfd] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.24em] text-[#05668D]">7 días</span>
							</div>

								<div className="mt-5">
									<ActivityChart data={activityChartData} />
								</div>
						</div>
				</section>

					<section>
						<RecentActivityFeed items={recentActivityItems} />
				</section>
			</div>

				<DashboardCardModal open={isCardModalOpen} onClose={() => setIsCardModalOpen(false)}>
					<StampPreviewCard businessName="Tu negocio" logoPreview="" cardColor="#4f7a35" />
				</DashboardCardModal>
			<DashboardQrModal open={isQrModalOpen} onClose={() => setIsQrModalOpen(false)} />
			<DashboardFloatingQrButton onClick={() => setIsQrModalOpen(true)} />
		</main>
	);
}