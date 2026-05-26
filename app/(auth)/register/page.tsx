'use client';

import { useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import FormField from '../components/FormField';
import PasswordField from '../components/PasswordField';
import PrimaryAuthButton from '../components/PrimaryAuthButton';
import AuthPageShell from '../components/AuthPageShell';

function RegisterForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  // Normalize flow to match our database ENUM values ('admin' or 'customer')
  const flowParam = searchParams?.get('flow');
  const assignedRole = flowParam === 'owner' ? 'admin' : 'customer';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

 const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setErrorMsg(null);

  if (password !== confirmPassword) {
    setErrorMsg('Las contraseñas no coinciden.');
    return;
  }

  setLoading(true);

  // Call YOUR OWN API route where you handle email saving and custom emailing
  const response = await fetch('/api/auth/custom-register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email,
      password,
      fullName,
      role: assignedRole // 'admin' or 'customer'
    }),
  });

  const result = await response.json();
  setLoading(false);

  if (!response.ok) {
    setErrorMsg(result.error || 'Hubo un error en el registro.');
    return;
  }

  // Route them based on the flow they selected
  if (assignedRole === 'admin') {
    router.push('/onboarding');
  } else {
    router.push('/cartera');
  }
};

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {errorMsg && (
        <div className="bg-red-50 text-red-600 p-3 text-sm font-semibold border-l-4 border-red-500">
          {errorMsg}
        </div>
      )}

      <FormField
        id="fullName"
        label="Nombre completo"
        type="text"
        placeholder="Tu nombre"
        value={fullName}
        onChange={(e) => setFullName(e.target.value)}
        autoComplete="name"
        required
      />

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
        label="Contraseña"
        placeholder="Crea una contraseña"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        autoComplete="new-password"
        required
      />

      <PasswordField
        id="confirmPassword"
        label="Confirmar contraseña"
        placeholder="Repite tu contraseña"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        autoComplete="new-password"
        required
      />

      <label className="flex cursor-pointer items-start gap-2">
        <input
          type="checkbox"
          checked={acceptTerms}
          onChange={(e) => setAcceptTerms(e.target.checked)}
          className="mt-1 h-4 w-4 rounded border-gray-300 text-[#2A9D8F] focus:ring-[#2A9D8F]"
          required
        />
        <span className="text-sm text-gray-600">
          Acepto los términos y condiciones y la política de privacidad.
        </span>
      </label>

      <PrimaryAuthButton 
        label={loading ? "Procesando..." : "Crear cuenta"} 
        disabled={loading} 
      />
    </form>
  );
}

export default function RegisterPage() {
  return (
    <AuthPageShell
      title="CREA TU CUENTA"
      subtitle="REGÍSTRATE PARA EMPEZAR A USAR PERKO"
      footerText="¿Ya tienes cuenta?"
      footerHref="/login"
      footerLinkLabel="INICIA SESIÓN"
    >
      <Suspense fallback={<div className="h-40 w-full animate-pulse bg-gray-100" />}>
        <RegisterForm />
      </Suspense>
    </AuthPageShell>
  );
}