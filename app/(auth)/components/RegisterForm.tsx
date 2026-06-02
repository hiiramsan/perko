'use client';

import { useState } from 'react';
import Link from 'next/link';
import FormField from './FormField';
import PasswordField from './PasswordField';
import PrimaryAuthButton from './PrimaryAuthButton';
import { registerAction } from '@/app/actions/auth';

export type RegisterRole = 'admin' | 'customer';

type RegisterFormProps = {
  role: RegisterRole;
};

export default function RegisterForm({ role }: RegisterFormProps) {
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
      setErrorMsg('Las contraseñas no coinciden.');
      return;
    }

    setLoading(true);
    try {
      await registerAction(email, password, fullName, role, window.location.origin);
      setLoading(false);
      setIsSuccess(true);
    } catch (err: any) {
      setLoading(false);
      setErrorMsg(err.message || 'Hubo un error en el registro.');
    }
  };

  if (isSuccess) {
    return (
      <div className="flex flex-col items-center justify-center space-y-4 rounded-xl border border-green-200 bg-green-50 p-8 text-center">
        <svg className="h-16 w-16 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 19v-8.93a2 2 0 01.89-1.664l7-4.666a2 2 0 012.22 0l7 4.666A2 2 0 0121 10.07V19M3 19a2 2 0 002 2h14a2 2 0 002-2M3 19l6.75-4.5M21 19l-6.75-4.5M3 10l6.75 4.5M21 10l-6.75 4.5m0 0l-1.14.76a2 2 0 01-2.22 0l-1.14-.76" />
        </svg>
        <h3 className="text-xl font-bold text-green-900">¡Revisa tu correo!</h3>
        <p className="text-green-800">
          Hemos enviado un enlace de confirmación a <strong>{email}</strong>. Haz clic en el enlace para activar tu cuenta.
        </p>
        <Link href={`/login?role=${role}`} className="mt-4 text-sm font-semibold text-green-700 underline hover:text-green-900">
          Volver al inicio de sesión
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {errorMsg && (
        <div className="border-l-4 border-red-500 bg-red-50 p-3 text-sm font-semibold text-red-600">
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

      <PrimaryAuthButton label={loading ? 'Procesando...' : 'Crear cuenta'} disabled={loading} />

      <Link
        href={`/login?role=${role}`}
        className="block w-full rounded-lg border border-[#9da5af] bg-white py-3 text-center text-sm font-bold uppercase tracking-wider text-[#0f172a] transition hover:border-[#7a838f] hover:text-[#1f2a44]"
      >
        Inicia sesión
      </Link>
    </form>
  );
}