'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/app/context/AuthContext';
import { BaristaScannerView } from './components/BaristaScannerView';
import { AdminView } from './components/AdminView';
import { createClient } from '@/lib/supabase/client'; 

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const [businessId, setBusinessId] = useState<number | null>(null);
  const [loadingStaffInfo, setLoadingStaffInfo] = useState(false);
  const [staffChecked, setStaffChecked] = useState(false);

  useEffect(() => {
    if (user && user.role === 'staff') {
      setLoadingStaffInfo(true);
      const supabase = createClient();

      supabase
        .from('business_staff')
        .select('business_id')
        .eq('staff_id', user.id)
        .maybeSingle()
        .then(({ data, error }) => {
          if (data && !error) {
            setBusinessId(data.business_id);
          }
          setLoadingStaffInfo(false);
          setStaffChecked(true);
        });
    } else if (user) {
      setStaffChecked(true);
    }
  }, [user]);

  if (loading || loadingStaffInfo || !staffChecked) {
    return <p className="p-6 text-xs font-bold uppercase tracking-widest text-slate-400">Cargando panel...</p>;
  }

  if (!user) return <p className="p-6 text-sm text-red-500">No autorizado.</p>;

  // Si es un empleado (staff)
  if (user.role === 'staff') {
    if (!businessId) {
      return (
        <div className="p-6 text-sm border-l-4 border-amber-500 bg-amber-50 text-amber-700 font-medium">
          	Tu cuenta no tiene asignada ninguna sucursal activa. Pídele al administrador del negocio que te registre en el sistema.
        </div>
      );
    }
    // Le pasamos el businessId real recuperado de la tabla relacional
    return <BaristaScannerView businessId={businessId} baristaName={user.name} />;
  }

  // Si es el dueño (admin), ve el panel completo
  return <AdminView />;
}