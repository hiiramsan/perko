"use client"

import { useAuth } from '@/app/context/AuthContext';
import WalletShowcase, { type WalletCard } from './components/WalletShowcase';

const walletCards: WalletCard[] = [
  {
    businessName: 'Borcelle Car Wash',
    linkLabel: 'BorcelleCarWash.com',
    href: '#Borcelle-Car-Wash',
    logoSrc: '/borcelle.png',
    cardColor: '#05668D',
    stampsFilled: 6,
    rewardText: 'Buy 4 more to get a free wash',
    cardCode: '5555 1234 5678 9012',
  },
  {
    businessName: 'Gurú Studio',
    linkLabel: 'GuruStudio.com',
    href: '#GuruStudio',
    logoSrc: '/guru.png',
    cardColor: '#ef4f2f',
    stampsFilled: 8,
    rewardText: 'Buy 2 more to get 1 free pass',
    cardCode: '5555 9876 5432 1098',
  },
  {
    businessName: 'Matcha House',
    linkLabel: 'matchahouse.com',
    href: '#matchas',
    logoSrc: '/matcha.png',
    cardColor: '#4f7a35',
    stampsFilled: 4,
    rewardText: 'Buy 6 more to unlock a reward',
    cardCode: '5555 1111 2222 3333',
  },
];

export default function CardsPage() {

  const { user, loading, logout } = useAuth()

  if (loading) return <p>Cargando sesión...</p>;
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
        <WalletShowcase walletCards={walletCards} />
      </main>
    </>
  );
}