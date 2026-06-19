'use client';

import { Moon, Sun, Menu, BadgeCheck, LogOut, Home, Users, Gift, BarChart2 } from 'lucide-react';

export type AdminTab = 'inicio' | 'clientes' | 'programa' | 'analiticas';

const TABS: { id: AdminTab; name: string; icon: React.ComponentType<{ size?: number }> }[] = [
  { id: 'inicio', name: 'Inicio', icon: Home },
  { id: 'clientes', name: 'Clientes', icon: Users },
  { id: 'programa', name: 'Programa', icon: Gift },
  { id: 'analiticas', name: 'Analíticas', icon: BarChart2 },
];

type AdminDashboardHeaderProps = {
  isDarkMode: boolean;
  isProfileMenuOpen: boolean;
  profileMenuRef: React.RefObject<HTMLDivElement | null>;
  activeTab: AdminTab;
  onTabChange: (tab: AdminTab) => void;
  onToggleDarkMode: () => void;
  onToggleProfileMenu: () => void;
  onLogout: () => void;
};

export function AdminDashboardHeader({
  isDarkMode,
  isProfileMenuOpen,
  profileMenuRef,
  activeTab,
  onTabChange,
  onToggleDarkMode,
  onToggleProfileMenu,
  onLogout,
}: AdminDashboardHeaderProps) {
  return (
    <header className="relative z-50 w-full py-1">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center text-2xl font-bold tracking-tight text-[#0f172a]">
          Perk<BadgeCheck size={28} strokeWidth={3} className="-ml-px" />
        </div>

        <nav className="flex items-center gap-2 rounded-full border border-black bg-white/60 px-2 py-1 shadow-sm backdrop-blur">
          {TABS.map((tab) => {
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => onTabChange(tab.id)}
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
            onClick={onToggleDarkMode}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#dbe4ec] bg-white/60 text-[#334155] shadow-sm backdrop-blur transition hover:border-[#94a3b8] hover:bg-white"
            aria-label="Cambiar modo"
          >
            {isDarkMode ? <Moon size={18} /> : <Sun size={18} />}
          </button>

          <div className="relative" ref={profileMenuRef}>
            <button
              type="button"
              onClick={onToggleProfileMenu}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#dbe4ec] bg-white/60 text-[#334155] shadow-sm backdrop-blur transition hover:border-[#94a3b8] hover:bg-white"
              aria-label="Menú"
            >
              <Menu size={18} />
            </button>

            {isProfileMenuOpen && (
              <div className="absolute right-0 top-full mt-2 w-48 overflow-hidden rounded-xl border border-[#dbe4ec] bg-white py-1 shadow-lg shadow-black/5 z-50">
                <button
                  type="button"
                  onClick={onLogout}
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
  );
}
