'use client';

import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import AuthPageShell from '../components/AuthPageShell';
import RegisterForm from '../components/RegisterForm';

function RegisterPageContent() {
  const searchParams = useSearchParams();
  
  // Si la URL dice ?role=admin se registra como negocio, si no, por defecto es cliente
  const role = searchParams.get('role') === 'admin' ? 'admin' : 'customer';
  const joinSlug = searchParams.get('join');

  // Set the join slug cookie so /api/auth/verify can auto-affiliate after email verification
  useEffect(() => {
    if (joinSlug) {
      document.cookie = `perko_join_business_slug=${joinSlug}; path=/; max-age=600; samesite=lax`;
    }
  }, [joinSlug]);

  return (
    <AuthPageShell
      title={role === 'admin' ? 'CREA TU CUENTA DE NEGOCIO' : 'ÚNETE AL CLUB'}
      subtitle={role === 'admin' ? 'Empieza a diseñar tu sistema de lealtad' : 'Regístrate para obtener tu tarjeta digital'}
      footerText="¿Ya tienes cuenta?"
      footerHref={`/login?role=${role}${joinSlug ? `&join=${joinSlug}` : ''}`}
      footerLinkLabel="INICIA SESIÓN"
      googleIntent="register"
      googleRole={role}
    >
      <RegisterForm role={role} joinSlug={joinSlug || undefined} />
    </AuthPageShell>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={<div className="flex h-screen items-center justify-center">Cargando...</div>}>
      <RegisterPageContent />
    </Suspense>
  );
}