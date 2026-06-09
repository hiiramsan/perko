'use client';

import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/context/AuthContext';
import { BaristaScannerView } from './components/BaristaScannerView';
import { AdminView } from './components/AdminView';

export default function DashboardPage() {
  const router = useRouter();
  const { user, loading } = useAuth();

  if (loading) {
    return <p className="p-6 text-xs font-bold uppercase tracking-widest text-slate-400">Cargando panel...</p>;
  }

  if (!user) {
    router.replace('/login');
    return null;
  }

  // Si es un empleado (staff)
  if (user.role === 'staff') {
    if (!user.businessId) {
      return (
        <div className="p-6 text-sm border-l-4 border-amber-500 bg-amber-50 text-amber-700 font-medium">
          	Tu cuenta no tiene asignada ninguna sucursal activa. Pídele al administrador del negocio que te registre en el sistema.
        </div>
      );
    }
    return <BaristaScannerView businessId={user.businessId} baristaName={user.name} />;
  }

  // Si es el dueño (admin), ve el panel completo
  return <AdminView />;
}