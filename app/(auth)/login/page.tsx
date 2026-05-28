'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import FormField from '../components/FormField';
import PasswordField from '../components/PasswordField';
import PrimaryAuthButton from '../components/PrimaryAuthButton';
import AuthPageShell from '../components/AuthPageShell';
import Link from 'next/link';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [rememberMe, setRememberMe] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showRegisterChoice, setShowRegisterChoice] = useState(false);

  // Leer los errores que llegan redirigidos desde el link mágico del correo
  useEffect(() => {
    const errorParam = searchParams.get('error');
    if (errorParam === 'invalid-token') setErrorMsg('El enlace de validación es inválido.');
    if (errorParam === 'expired-token') setErrorMsg('Tu enlace de validación expiró. Regístrate otra vez.');
    if (errorParam === 'already-registered') setErrorMsg('El correo ya fue registrado, por favor inicia sesión.');
    if (errorParam === 'session-expired') setErrorMsg('Tu sesión ha expirado, inicia sesión de nuevo.');
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setLoading(true);

    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, rememberMe }),
    });

    const result = await response.json();
    setLoading(false);

    if (!response.ok) {
      setErrorMsg(result.error || 'No pudimos iniciar sesion.');
      return;
    }

    if (result.role === 'customer') {
      router.push('/cartera');
    } else {
      router.push('/dashboard');
    }
  };

  return (
    <AuthPageShell
      title="INICIA SESION"
      subtitle="INGRESA TUS CREDENCIALES"
      footerText="¿No tienes cuenta?"
      footerHref="/register"
      footerLinkLabel="CREAR UNA"
      googleIntent="login"
      footerOnClick={() => setShowRegisterChoice(true)}
    >
      {showRegisterChoice ? (
        <div className="space-y-4">
          <p className="text-center text-sm text-gray-600">
            Elige el tipo de cuenta para registrarte.
          </p>
          <Link
            href="/business"
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#05668D] py-3 text-sm font-bold uppercase tracking-wider text-white transition hover:bg-[#045676]"
          >
            Soy negocio
          </Link>
          <Link
            href="/register"
            className="flex w-full items-center justify-center gap-2 rounded-lg border border-[#9da5af] bg-white py-3 text-sm font-bold uppercase tracking-wider text-[#0f172a] transition hover:border-[#7a838f]"
          >
            Soy cliente
          </Link>
          <button
            type="button"
            onClick={() => setShowRegisterChoice(false)}
            className="w-full text-sm font-semibold text-[#ef4f2f] transition hover:text-[#c94223]"
          >
            Volver a iniciar sesion
          </button>
        </div>
      ) : (
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
            label="Correo"
            type="email"
            placeholder="tu@correo.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            required
          />

          <PasswordField
            id="password"
            label="Contrasena"
            placeholder="Ingresa tu contrasena"
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
                className="h-4 w-4 rounded border-gray-300 text-[#2A9D8F] focus:ring-[#2A9D8F]"
              />
              <span className="text-sm text-gray-600">Recuerdame</span>
            </label>
            <a href="#" className="text-sm font-semibold text-[#ef4f2f] transition hover:text-[#c94223]">
              OLVIDE MI CONTRASENA
            </a>
          </div>

          <PrimaryAuthButton label={loading ? 'Procesando...' : 'Inicia sesion'} disabled={loading} />
        </form>
      )}
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
