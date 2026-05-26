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

    router.push(successRedirect);
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
