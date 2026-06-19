'use client';

import { useEffect, useRef, useState } from 'react';
import { useAuth } from '@/app/context/AuthContext';
import { AdminAddStaffForm } from './AdminAddStaffForm';
import { AdminDashboardHeader, type AdminTab } from './AdminDashboardHeader';
import { AdminKpiSection } from './AdminKpiSection';
import { AdminStaffSection } from './AdminStaffSection';
import { AdminProgramSection } from './AdminProgramSection';
import { AdminCardSection } from './AdminCardSection';
import { ModalBackdrop } from './ModalBackdrop';
import { DashboardCardEditorModal } from './DashboardCardEditorModal';
import { DashboardQrModal } from './DashboardQrModal';
import { RecentScansTable } from './RecentScansTable';
import { recentScanRows } from '../dashboard-data';
import { useDashboardCardEditor } from '@/hooks/useDashboardCardEditor';
import { getIndicatorsAction, type AdminIndicators } from '@/app/actions/dashboard';

export function AdminView() {
    const { logout } = useAuth();
    const [activeTab, setActiveTab] = useState<AdminTab>('inicio');
    const [isQrModalOpen, setIsQrModalOpen] = useState(false);
    const [isCardFlipped, setIsCardFlipped] = useState(false);
    const [isCardModalOpen, setIsCardModalOpen] = useState(false);
    const [isStaffFormOpen, setIsStaffFormOpen] = useState(false);
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
    const [indicators, setIndicators] = useState<AdminIndicators | null>(null);
    const [loadingIndicators, setLoadingIndicators] = useState(true);
    const profileMenuRef = useRef<HTMLDivElement>(null);

    const {
        businessId,
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

    useEffect(() => {
        getIndicatorsAction().then((data) => {
            if (data) setIndicators(data);
            setLoadingIndicators(false);
        });
    }, []);

    const staffRows = (indicators?.staff?.length ? indicators.staff : [
        { name: 'Carlos Mendoza', stampsGiven: 48, pointsGiven: 125.50 },
        { name: 'María García', stampsGiven: 32, pointsGiven: 89.00 },
        { name: 'José Rivera', stampsGiven: 15, pointsGiven: 42.75 },
    ]);

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

            <AdminDashboardHeader
                isDarkMode={isDarkMode}
                isProfileMenuOpen={isProfileMenuOpen}
                profileMenuRef={profileMenuRef}
                activeTab={activeTab}
                onTabChange={setActiveTab}
                onToggleDarkMode={() => setIsDarkMode((current) => !current)}
                onToggleProfileMenu={() => setIsProfileMenuOpen((prev) => !prev)}
                onLogout={() => { setIsProfileMenuOpen(false); logout(); }}
            />

            <div className="relative z-10 mx-auto flex min-h-0 w-full max-w-7xl flex-1 flex-col mt-4 pb-4">
                {activeTab === 'inicio' && (
                    <section className="grid min-h-0 flex-1 gap-6 lg:grid-cols-[0.85fr_1.15fr] lg:items-stretch">
                        <div className="grid min-h-0 gap-6 lg:grid-rows-[minmax(0,0.85fr)_minmax(0,1.15fr)]">
                            <AdminCardSection
                                businessName={businessName}
                                logoPreview={logoPreview}
                                cardColor={cardColor}
                                slug={slug}
                                isCardFlipped={isCardFlipped}
                                onToggleFlip={() => setIsCardFlipped((prev) => !prev)}
                                onOpenEditor={() => setIsCardModalOpen(true)}
                                onQrClick={() => setIsQrModalOpen(true)}
                            />

                            <AdminKpiSection indicators={indicators} loading={loadingIndicators} />
                        </div>

                        <div className="grid min-h-0 flex-1 grid-rows-2 gap-6">
                            <div className="min-h-0">
                                <RecentScansTable items={recentScanRows} />
                            </div>
                            <AdminStaffSection
                                staffRows={staffRows}
                                loading={loadingIndicators}
                                onOpenAddStaff={() => setIsStaffFormOpen(true)}
                            />
                        </div>
                    </section>
                )}

                {activeTab === 'programa' && (
                    <section className="flex min-h-0 flex-1 flex-col">
                        <AdminProgramSection businessId={businessId} />
                    </section>
                )}
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
                <ModalBackdrop open={isStaffFormOpen} onClose={() => setIsStaffFormOpen(false)}>
                    <AdminAddStaffForm />
                </ModalBackdrop>
            )}
        </main>
    );
}
