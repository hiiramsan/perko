"use client"

import { useEffect, useState } from 'react';
import { useAuth } from '@/app/context/AuthContext';
import WalletShowcase, { type WalletCard } from './components/WalletShowcase';
import { getCustomerWalletAction } from '@/app/actions/wallet';

export default function CardsPage() {
  const { user, loading, logout } = useAuth();
  const [walletCards, setWalletCards] = useState<WalletCard[]>([]);
  const [fetchingWallet, setFetchingWallet] = useState(true);

  useEffect(() => {
    if (user) {
      getCustomerWalletAction().then((res) => {
        if (res.success && res.cards) {
          setWalletCards(res.cards);
        }
        setFetchingWallet(false);
      });
    }
  }, [user]);

  if (loading || fetchingWallet) return <p>Cargando sesión...</p>;
  if (!user) return <p>No has iniciado sesión.</p>;

  return (
    <>
      <main className="min-h-screen overflow-hidden px-6 py-12 text-slate-950 sm:px-8">
        <div className="px-2 mt-2">
          <p>bienvenuto {user.name}!!!!!!!</p>
          <p>eres un {user.role}</p>
          <button onClick={logout}>CERRAS ZECION</button>
          <h1 className="text-2xl font-bold">Cartera</h1>
          <p className="mt-0.5 text-sm text-slate-500">Presiona una tarjeta para mostrar QR</p>
        </div>
        
        {walletCards.length === 0 ? (
          <p className="px-2 mt-6 text-sm text-slate-400">Aún no tienes tarjetas de lealtad en tu cartera.</p>
        ) : (
          <WalletShowcase walletCards={walletCards} />
        )}
      </main>
    </>
  );
}