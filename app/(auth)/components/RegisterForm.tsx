'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import FormField from './FormField';
import PasswordField from './PasswordField';
import PrimaryAuthButton from './PrimaryAuthButton';
import { registerAction } from '@/app/actions/auth';

export type RegisterRole = 'admin' | 'customer';

type RegisterFormProps = {
  role: RegisterRole;
  joinSlug?: string;
};

export default function RegisterForm({ role, joinSlug }: RegisterFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

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
      // Redirect to the verify page with the email in query for UX
      router.push(`/verify-email?email=${encodeURIComponent(email)}`);
    } catch (err: any) {
      setLoading(false);
      setErrorMsg(err.message || 'Hubo un error en el registro.');
    }
  };


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
        href={`/login?role=${role}${joinSlug ? `&join=${joinSlug}` : ''}`}
        className="block w-full rounded-lg border border-[#9da5af] bg-white py-3 text-center text-sm font-bold uppercase tracking-wider text-[#0f172a] transition hover:border-[#7a838f] hover:text-[#1f2a44]"
      >
        Inicia sesión
      </Link>
    </form>
  );
}