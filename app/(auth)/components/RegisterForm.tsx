'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import FormField from './FormField';
import PasswordField from './PasswordField';
import PrimaryAuthButton from './PrimaryAuthButton';

export type RegisterRole = 'admin' | 'customer';

type RegisterFormProps = {
  role: RegisterRole;
  successRedirect: string;
};

export default function RegisterForm({ role, successRedirect }: RegisterFormProps) {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (password !== confirmPassword) {
      setErrorMsg('Las contrasenas no coinciden.');
      return;
    }

    setLoading(true);

    const response = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email,
        password,
        fullName,
        role,
      }),
    });

    const result = await response.json();
    setLoading(false);

    if (!response.ok) {
      setErrorMsg(result.error || 'Hubo un error en el registro.');
      return;
    }

    setIsSuccess(true);
  };

  if (isSuccess) {
    return (
      <div className="flex flex-col items-center justify-center space-y-4 rounded-xl bg-green-50 p-8 text-center border border-green-200">
        <svg className="h-16 w-16 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 19v-8.93a2 2 0 01.89-1.664l7-4.666a2 2 0 012.22 0l7 4.666A2 2 0 0121 10.07V19M3 19a2 2 0 002 2h14a2 2 0 002-2M3 19l6.75-4.5M21 19l-6.75-4.5M3 10l6.75 4.5M21 10l-6.75 4.5m0 0l-1.14.76a2 2 0 01-2.22 0l-1.14-.76" />
        </svg>
        <h3 className="text-xl font-bold text-green-900">¡Revisa tu correo!</h3>
        <p className="text-green-800">
          Hemos enviado un enlace de confirmación a <strong>{email}</strong>. Haz clic en el enlace para activar tu cuenta.
        </p>
        <Link href="/login" className="mt-4 text-sm font-semibold text-green-700 hover:text-green-900 underline">
          Volver al inicio de sesión
        </Link>
      </div>
    );
  }

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
        label="Contrasena"
        placeholder="Crea una contrasena"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        autoComplete="new-password"
        required
      />

      <PasswordField
        id="confirmPassword"
        label="Confirmar contrasena"
        placeholder="Repite tu contrasena"
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
          Acepto los terminos y condiciones y la politica de privacidad.
        </span>
      </label>

      <PrimaryAuthButton label={loading ? 'Procesando...' : 'Crear cuenta'} disabled={loading} />

      <Link
        href="/login"
        className="block w-full rounded-lg border border-[#9da5af] bg-white py-3 text-center text-sm font-bold uppercase tracking-wider text-[#0f172a] transition hover:border-[#7a838f] hover:text-[#1f2a44]"
      >
        Inicia sesion
      </Link>
    </form>
  );
}
