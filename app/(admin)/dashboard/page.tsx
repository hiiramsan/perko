'use client';

import { useState, useRef, useEffect } from 'react';
import { Moon, QrCode, Sun, UserCircle2, Activity, BadgeCheck, LogOut } from 'lucide-react';
import StampPreviewCard from '@/app/(admin)/onboarding/components/StampPreviewCard';
import { useAuth } from '@/app/context/AuthContext';
import { DashboardCardModal } from './components/DashboardCardModal';
import { DashboardPerformancePanel } from './components/DashboardPerformancePanel';
import { DashboardQrModal } from './components/DashboardQrModal';
import { RecentScansTable } from './components/RecentScansTable';
import { PeakHourCard } from './components/PeakHourCard';
import { TopClientsCard } from './components/TopClientsCard';
import { dashboardPerformanceMetricsHistorical, dashboardPerformanceMetricsToday, recentScanRows } from './dashboard-data';

export default function DashboardPage() {
	const { logout } = useAuth();
	const [isQrModalOpen, setIsQrModalOpen] = useState(false);
	const [isCardModalOpen, setIsCardModalOpen] = useState(false);
	const [isDarkMode, setIsDarkMode] = useState(false);
	const [cardColor, setCardColor] = useState('#4f7a35');
	const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
	const profileMenuRef = useRef<HTMLDivElement>(null);

	// Cerrar menú de perfil al hacer click afuera
	useEffect(() => {
		function handleClickOutside(event: MouseEvent) {
			if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
				setIsProfileMenuOpen(false);
			}
		}
		document.addEventListener('mousedown', handleClickOutside);
		return () => document.removeEventListener('mousedown', handleClickOutside);
	}, []);

	return (
		<main className="relative flex h-screen w-full flex-col overflow-hidden bg-[#f7f8fa] px-4 py-3 md:px-8 md:py-4">
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

			<header className="relative z-10 w-full py-1">
				<div className="flex flex-wrap items-center justify-between gap-3">
					<div className="flex items-center text-2xl font-bold tracking-tight text-[#0f172a]">
						Perk<BadgeCheck size={28} strokeWidth={3} className="-ml-px" />
					</div>

					<nav className="flex items-center gap-2 rounded-full border border-[#e5e9ef] bg-white/60 px-2 py-1 shadow-sm backdrop-blur">
						{['Inicio', 'Clientes', 'Programa', 'Analíticas'].map((tab, index) => {
							const isActive = index === 0;

							return (
								<button
									key={tab}
									type="button"
									className={`rounded-full px-3 py-1.5 text-xs font-semibold transition sm:px-4 sm:text-sm ${isActive ? 'bg-[#0f172a] text-white shadow-[0_8px_20px_-12px_rgba(15,23,42,0.7)]' : 'text-[#475569] hover:bg-white hover:text-[#0f172a]'}`}
								>
									{tab}
								</button>
							);
						})}
					</nav>

					<div className="flex items-center gap-2">
						<button
							type="button"
							onClick={() => setIsDarkMode((current) => !current)}
							className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#dbe4ec] bg-white/60 text-[#334155] shadow-sm backdrop-blur transition hover:border-[#94a3b8] hover:bg-white"
							aria-label="Cambiar modo"
						>
							{isDarkMode ? <Moon size={18} /> : <Sun size={18} />}
						</button>

						<div className="relative" ref={profileMenuRef}>
							<button
								type="button"
								onClick={() => setIsProfileMenuOpen((prev) => !prev)}
								className="inline-flex items-center gap-2 rounded-full border border-[#dbe4ec] bg-white/60 px-3 py-2 text-sm font-semibold text-[#0f172a] shadow-sm backdrop-blur transition hover:border-[#94a3b8] hover:bg-white"
							>
								<UserCircle2 size={18} className="text-[#05668D]" />
								Perfil
							</button>

							{isProfileMenuOpen && (
								<div className="absolute right-0 top-full mt-2 w-48 overflow-hidden rounded-xl border border-[#dbe4ec] bg-white py-1 shadow-lg shadow-black/5">
									<button
										type="button"
										onClick={() => {
											setIsProfileMenuOpen(false);
											logout();
										}}
										className="flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm font-medium text-red-600 transition hover:bg-red-50"
									>
										<LogOut size={16} />
										Cerrar sesión
									</button>
								</div>
							)}
						</div>
					</div>
				</div>
			</header>

			<div className="relative z-10 mx-auto flex min-h-0 w-full max-w-7xl flex-1 flex-col mt-4">
				<section className="grid min-h-0 flex-1 gap-3 lg:grid-cols-[0.85fr_1.15fr] lg:items-stretch">
					<div className="grid min-h-0 gap-3 lg:grid-rows-[minmax(0,0.85fr)_minmax(0,1.15fr)]">
						<article className="flex flex-col overflow-hidden rounded-[2rem] border border-[#d8e2ea] border-t-[5px] border-t-[#05668D] bg-white/94 shadow-[0_18px_40px_-26px_rgba(15,23,42,0.2)] backdrop-blur">
							<div className="px-5 pt-4 sm:px-6">
								<div className="flex items-center gap-2">
									<span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#64748b]">Mi tarjeta</span>
								</div>
							</div>

							<div className="flex min-h-0 flex-1 items-center justify-center gap-10 px-5 pb-5 sm:px-6">
								<div className="max-w-84 sm:max-w-88">
									<StampPreviewCard businessName="Tu negocio" logoPreview="" cardColor={cardColor} compact />
								</div>

								<div className="flex shrink-0 flex-col gap-3">
									<button type="button" onClick={() => setIsQrModalOpen(true)} className="inline-flex items-center justify-center gap-2 rounded-full bg-[#05668D] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#045676]">
										<QrCode size={16} />
										Mostrar QR
									</button>
									<button type="button" onClick={() => setIsCardModalOpen(true)} className="inline-flex items-center justify-center rounded-full border border-[#dbe4ec] bg-white px-4 py-3 text-sm font-semibold text-[#0f172a] transition hover:border-[#94a3b8] hover:bg-[#f8fbfd]">
										Editar tarjeta
									</button>
								</div>
							</div>
						</article>

						<DashboardPerformancePanel todayMetrics={dashboardPerformanceMetricsToday} historicalMetrics={dashboardPerformanceMetricsHistorical} />
					</div>

					<div className="grid min-h-0 flex-1 grid-rows-2 gap-3">
						<div className="min-h-0">
							<RecentScansTable items={recentScanRows} />
						</div>
						<div className="min-h-0 grid grid-cols-1 gap-3 sm:grid-cols-2">
							<PeakHourCard />
							<TopClientsCard />
						</div>
					</div>
				</section>
			</div>

				<DashboardCardModal open={isCardModalOpen} onClose={() => setIsCardModalOpen(false)}>
					<div className="flex flex-col md:flex-row gap-8">
						<div className="flex-1 lg:max-w-88 flex items-center justify-center">
							<div className="w-[320px]">
								<StampPreviewCard businessName="Tu negocio" logoPreview="" cardColor={cardColor} />
							</div>
						</div>
						<div className="flex-1 flex flex-col gap-6 pt-2">
							<div>
								<h3 className="text-sm font-semibold tracking-tight text-[#0f172a] mb-3">Color de la tarjeta</h3>
								<div className="flex gap-3 flex-wrap">
									{['#4f7a35', '#0f172a', '#E76F51', '#2A9D8F', '#05668D', '#8b5cf6'].map(color => (
										<button 
											key={color}
											onClick={() => setCardColor(color)}
											className={`h-10 w-10 rounded-full border-2 transition-transform hover:scale-110 ${cardColor === color ? 'border-[#0f172a] shadow-md scale-110' : 'border-transparent'}`}
											style={{ backgroundColor: color }}
											aria-label={`Seleccionar color ${color}`}
										/>
									))}
								</div>
							</div>

							<div>
								<h3 className="text-sm font-semibold tracking-tight text-[#0f172a] mb-3">Logo del negocio</h3>
								<div className="flex items-center gap-4">
									<div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-dashed border-[#cfd9e3] bg-[#f8fbfd] text-[#94a3b8]">
										<Activity size={24} />
									</div>
									<div className="flex flex-col gap-2">
										<button type="button" className="inline-flex items-center justify-center rounded-full bg-[#f8fbfd] border border-[#dbe4ec] px-4 py-2.5 text-xs font-semibold text-[#0f172a] transition hover:bg-white hover:border-[#94a3b8]">
											Subir nueva imagen
										</button>
										<p className="text-[10px] text-[#64748b]">Recomendado: PNG o JPG, min. 400x400px</p>
									</div>
								</div>
							</div>
						</div>
					</div>
				</DashboardCardModal>
			<DashboardQrModal open={isQrModalOpen} onClose={() => setIsQrModalOpen(false)} />
		</main>
	);
}