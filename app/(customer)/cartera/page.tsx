"use client"

import { useEffect, useState, useCallback } from 'react';
import { useAuth } from '@/app/context/AuthContext';
import WalletShowcase, { type WalletCard } from './components/WalletShowcase';
import { getCustomerWalletAction } from '@/app/actions/wallet';
import { createClient } from '@/lib/supabase/client'; // 🔌 Cliente de Supabase para tiempo real

export default function CardsPage() {
  const { user, loading, logout } = useAuth();
  const [walletCards, setWalletCards] = useState<WalletCard[]>([]);
  const [fetchingWallet, setFetchingWallet] = useState(true);

  //  Encapsulamos la petición para poder llamarla tanto al montar como al recibir actualizaciones
  const fetchWalletData = useCallback(async () => {
    const res = await getCustomerWalletAction();
    if (res.success && res.cards) {
      setWalletCards(res.cards as WalletCard[]);
    }
    setFetchingWallet(false);
  }, []);

  // 1. Carga inicial de la cartera
  useEffect(() => {
    if (user) {
      fetchWalletData();
    }
  }, [user, fetchWalletData]);

  // 2. Suscripción en Tiempo Real vía WebSockets + polling de respaldo
  useEffect(() => {
    if (!user) return;

    const supabase = createClient();

    // Escuchamos cualquier actualización en los Timbres o Puntos en vivo
    const realtimeChannel = supabase
      .channel('wallet-realtime-changes')
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'customer_rewards_balances' },
        () => {
          fetchWalletData();
        }
      )
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'customer_points_balances' },
        () => {
          fetchWalletData();
        }
      )
      .subscribe();

    // Polling de respaldo cada 7s por si Realtime no captura cambios hechos con service role key
    const pollTimer = setInterval(() => {
      fetchWalletData();
    }, 3000);

    return () => {
      supabase.removeChannel(realtimeChannel);
      clearInterval(pollTimer);
    };
  }, [user, fetchWalletData]);

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