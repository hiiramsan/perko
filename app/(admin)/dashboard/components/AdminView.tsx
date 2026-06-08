'use client';

import { useEffect, useRef, useState } from 'react';
import { Moon, QrCode, Sun, UserCircle2, BadgeCheck, LogOut, Home, Users, Gift, BarChart2 } from 'lucide-react';
import StampPreviewCard from '@/components/StampPreviewCard';
import { useAuth } from '@/app/context/AuthContext';
import { AdminAddStaffForm } from './AdminAddStaffForm';
import { DashboardCardEditorModal } from './DashboardCardEditorModal';
import { DashboardPerformancePanel } from './DashboardPerformancePanel';
import { DashboardQrModal } from './DashboardQrModal';
import { RecentScansTable } from './RecentScansTable';
import { PeakHourCard } from './PeakHourCard';
import { TopClientsCard } from './TopClientsCard';
import { dashboardPerformanceMetricsHistorical, dashboardPerformanceMetricsToday, recentScanRows } from '../dashboard-data';
import { useDashboardCardEditor } from '@/hooks/useDashboardCardEditor';

export function AdminView() {
    const { logout } = useAuth();
    const [isQrModalOpen, setIsQrModalOpen] = useState(false);
    const [isCardModalOpen, setIsCardModalOpen] = useState(false);
    const [isStaffFormOpen, setIsStaffFormOpen] = useState(false);
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
    const profileMenuRef = useRef<HTMLDivElement>(null);

    const {
        businessName,
        slug,
        logoPreview,
        cardColor,
        tempColor,
        tempLogoPreview,
        isSaving,
        setTempColor,
        handleLogoChange,
        handleSaveCard,
        resetCardDraft,
    } = useDashboardCardEditor();

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

                    <nav className="flex items-center gap-2 rounded-full border border-black bg-white/60 px-2 py-1 shadow-sm backdrop-blur">
                        {[
                            { name: 'Inicio', icon: Home },
                            { name: 'Clientes', icon: Users },
                            { name: 'Programa', icon: Gift },
                            { name: 'Analíticas', icon: BarChart2 },
                        ].map((tab, index) => {
                            const isActive = index === 0;

                            return (
                                <button
                                    key={tab.name}
                                    type="button"
                                    className={`flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold transition sm:px-4 sm:text-sm ${isActive ? 'bg-[#05668D] text-white shadow-sm' : 'text-[#475569] hover:bg-white hover:text-[#0f172a]'}`}
                                >
                                    <tab.icon size={16} />
                                    {tab.name}
                                </button>
                            );
                        })}
                    </nav>

                    <div className="flex items-center gap-2">
                        <button
                            type="button"
                            onClick={() => setIsStaffFormOpen(true)}
                            className="inline-flex h-10 items-center gap-2 rounded-full border border-[#dbe4ec] bg-white/60 px-4 text-sm font-semibold text-[#0f172a] shadow-sm backdrop-blur transition hover:border-[#94a3b8] hover:bg-white"
                        >
                            + Staff
                        </button>

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

            <div className="relative z-10 mx-auto flex min-h-0 w-full max-w-7xl flex-1 flex-col mt-4 pb-4">
                <section className="grid min-h-0 flex-1 gap-6 lg:grid-cols-[0.85fr_1.15fr] lg:items-stretch">
                    <div className="grid min-h-0 gap-6 lg:grid-rows-[minmax(0,0.85fr)_minmax(0,1.15fr)]">
                        <article className="flex flex-col overflow-hidden rounded-none border border-black bg-white">
                            <div className="px-5 pt-4 sm:px-6">
                                <div className="flex items-center gap-2">
                                    <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#64748b]">Mi tarjeta</span>
                                </div>
                            </div>

                            <div className="flex min-h-0 flex-1 items-center justify-center gap-10 px-5 pb-5 sm:px-6">
                                <div className="max-w-84 sm:max-w-88">
                                    <StampPreviewCard businessName={businessName} logoPreview={logoPreview} cardColor={cardColor} compact />
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

                    <div className="grid min-h-0 flex-1 grid-rows-2 gap-6">
                        <div className="min-h-0">
                            <RecentScansTable items={recentScanRows} />
                        </div>
                        <div className="min-h-0 grid grid-cols-1 gap-6 sm:grid-cols-2">
                            <PeakHourCard />
                            <TopClientsCard />
                        </div>
                    </div>
                </section>
            </div>

            <DashboardCardEditorModal
                open={isCardModalOpen}
                onClose={() => {
                    setIsCardModalOpen(false);
                    resetCardDraft();
                }}
                businessName={businessName}
                tempColor={tempColor}
                tempLogoPreview={tempLogoPreview}
                isSaving={isSaving}
                onColorChange={setTempColor}
                onLogoChange={handleLogoChange}
                onSave={handleSaveCard}
            />

            <DashboardQrModal 
                open={isQrModalOpen} 
                onClose={() => setIsQrModalOpen(false)} 
                slug={slug} 
                logoUrl={logoPreview} 
            />

            {isStaffFormOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm">
                    <div className="relative">
                        <button
                            type="button"
                            onClick={() => setIsStaffFormOpen(false)}
                            className="absolute -right-2 -top-2 z-10 flex h-7 w-7 items-center justify-center rounded-full border border-slate-200 bg-white text-xs font-bold text-slate-500 shadow-sm hover:bg-slate-100 cursor-pointer"
                        >
                            ✕
                        </button>
                        <AdminAddStaffForm />
                    </div>
                </div>
            )}
        </main>
    );
}