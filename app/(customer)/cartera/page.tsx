"use client"

import { useEffect, useState, useCallback } from 'react';
import { useAuth } from '@/app/context/AuthContext';
import WalletShowcase, { type WalletCard } from './components/WalletShowcase';
import GlassNavbar from './components/GlassNavbar';
import { getCustomerWalletAction } from '@/app/actions/wallet';

export default function CardsPage() {
  const { user, loading, logout } = useAuth();
  const [walletCards, setWalletCards] = useState<WalletCard[]>([]);
  const [fetchingWallet, setFetchingWallet] = useState(true);
  const [activeTab, setActiveTab] = useState('wallet');

  const fetchWalletData = useCallback(async () => {
    const res = await getCustomerWalletAction();
    if (res.success && res.cards) {
      setWalletCards(res.cards as WalletCard[]);
    }
    setFetchingWallet(false);
  }, []);

  useEffect(() => {
    if (user) {
      fetchWalletData();
    }
  }, [user, fetchWalletData]);

  // Refetch on window focus (user returns to tab)
  useEffect(() => {
    if (!user) return;
    const handleFocus = () => fetchWalletData();
    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, [user, fetchWalletData]);

  if (loading || fetchingWallet) return <p>Cargando sesión...</p>;
  if (!user) return <p>No has iniciado sesión.</p>;

  return (
    <>
      <main className="min-h-screen overflow-hidden px-6 py-12 text-slate-950 sm:px-8 pb-28">
        {activeTab === 'wallet' && (
          <>
            <div className="px-2 mt-2">
              <h1 className="text-2xl font-bold">Cartera</h1>
              <p className="mt-0.5 text-sm text-slate-500">Presiona una tarjeta para mostrar QR</p>
            </div>

            {walletCards.length === 0 ? (
              <p className="px-2 mt-6 text-sm text-slate-400">Aún no tienes tarjetas de lealtad en tu cartera.</p>
            ) : (
              <WalletShowcase walletCards={walletCards} />
            )}
          </>
        )}

        {activeTab === 'join' && (
          <div className="px-2 mt-2">
            <h1 className="text-2xl font-bold">Unirse a un negocio</h1>
            <p className="mt-0.5 text-sm text-slate-500">Escanea el código QR de un negocio para unirte</p>

            <div className="mt-8 flex flex-col items-center gap-4">
              <p className="text-sm text-slate-400 text-center max-w-xs">
                Pídele al negocio su código QR de afiliación y escanéalo con tu cámara, o ingresa el enlace que te compartieron.
              </p>
            </div>
          </div>
        )}

        {activeTab === 'profile' && (
          <div className="px-2 mt-2">
            <h1 className="text-2xl font-bold">Mi Perfil</h1>
            <div className="mt-6 space-y-4">
              <div>
                <p className="text-sm text-slate-500">Nombre</p>
                <p className="text-base font-medium">{user.name}</p>
              </div>
              <div>
                <p className="text-sm text-slate-500">Correo</p>
                <p className="text-base font-medium">{user.email}</p>
              </div>
              <div>
                <p className="text-sm text-slate-500">Rol</p>
                <p className="text-base font-medium capitalize">{user.role}</p>
              </div>
              <button
                onClick={logout}
                className="mt-6 w-full rounded-lg bg-red-500 py-3 text-sm font-bold text-white transition hover:bg-red-600"
              >
                Cerrar sesión
              </button>
            </div>
          </div>
        )}
      </main>

      <GlassNavbar activeTab={activeTab} onTabChange={setActiveTab} />
    </>
  );
}
