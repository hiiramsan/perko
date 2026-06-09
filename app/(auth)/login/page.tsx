'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/app/context/AuthContext';
import FormField from '../components/FormField';
import PasswordField from '../components/PasswordField';
import PrimaryAuthButton from '../components/PrimaryAuthButton';
import AuthPageShell from '../components/AuthPageShell';
import { loginAction } from '@/app/actions/auth';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { refreshSession } = useAuth();
  
  const urlRole = searchParams.get('role') === 'admin' ? 'admin' : 'customer';

  const [rememberMe, setRememberMe] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const errorParam = searchParams.get('error');
    if (errorParam === 'invalid-token') setErrorMsg('El enlace de validación es inválido.');
    if (errorParam === 'expired-token') setErrorMsg('Tu enlace de validación expiró. Regístrate otra vez.');
    if (errorParam === 'already-registered') setErrorMsg('El correo ya fue registrado, por favor inicia sesión.');
    if (errorParam === 'session-expired') setErrorMsg('Tu sesión ha expirado, inicia sesión de nuevo.');
    if (errorParam === 'auth-failed') setErrorMsg('Error al autenticar con Google. Intenta de nuevo o usa correo y contraseña.');
    if (errorParam === 'no-code') setErrorMsg('No se recibió el código de autenticación. Intenta de nuevo.');
    if (errorParam === 'db-error') setErrorMsg('Error interno del servidor. Intenta más tarde.');
    if (errorParam === 'unknown') setErrorMsg('Ocurrió un error inesperado. Intenta de nuevo.');
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setLoading(true);

    try {
      const result = await loginAction(email, password, rememberMe);
      setLoading(false);

      await refreshSession();

      if (result.role === 'customer') {
        router.push('/cartera');
      } else {
        router.push('/dashboard');
      }
    } catch (err: any) {
      setLoading(false);
      setErrorMsg(err.message || 'No pudimos iniciar sesión.');
    }
  };

  return (
    <AuthPageShell
      title="INICIA SESIÓN"
      subtitle={urlRole === 'admin' ? 'PANEL DE NEGOCIOS' : 'CLUB DE RECOMPENSAS'}
      footerText="¿No tienes cuenta?"
      footerHref={urlRole === 'admin' ? '/register?role=admin' : '/register?role=customer'}
      footerLinkLabel="CREAR UNA"
      googleIntent="login"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {errorMsg && (
          <div className="bg-red-50 text-red-600 p-3 text-sm font-semibold border-l-4 border-red-500">
            {errorMsg}
          </div>
        )}
        {successMsg && (
          <div className="bg-green-50 text-green-700 p-3 text-sm font-semibold border-l-4 border-green-500">
            {successMsg}
          </div>
        )}

        <FormField
          id="email"
          label="Correo electrónico"
          type="email"
          placeholder="tu@correo.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
          required
        />

        <PasswordField
          id="password"
          label="Contraseña"
          placeholder="Ingresa tu contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="current-password"
          required
        />

        <div className="flex items-center justify-between">
          <label className="flex cursor-pointer items-center gap-2">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="h-4 w-4 rounded border-gray-300 text-[#2A9D8F] focus:ring-[#2A9D8F] accent-[#05668D] cursor-pointer"
            />
            <span className="text-sm text-gray-600">Recuérdame</span>
          </label>
        </div>

        <PrimaryAuthButton label={loading ? 'Procesando...' : 'Inicia sesión'} disabled={loading} />
      </form>
    </AuthPageShell>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="flex h-screen items-center justify-center">Cargando...</div>}>
      <LoginForm />
    </Suspense>
  );
}