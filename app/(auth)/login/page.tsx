'use client';

import { createClient } from '@/lib/supabase/client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import FormField from '../components/FormField';
import PasswordField from '../components/PasswordField';
import PrimaryAuthButton from '../components/PrimaryAuthButton';
import AuthPageShell from '../components/AuthPageShell';

export default function LoginPage() {
  const router = useRouter();
  const [rememberMe, setRememberMe] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    router.push('/onboarding');
  };

  return (
    <AuthPageShell
      title="INICIA SESIÓN"
      subtitle="INGRESA TUS CREDENCIALES"
      footerText="¿No tienes cuenta?"
      footerHref="/register"
      footerLinkLabel="CREAR UNA"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
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
              className="h-4 w-4 rounded border-gray-300 text-[#2A9D8F] focus:ring-[#2A9D8F]"
            />
            <span className="text-sm text-gray-600">Recuérdame</span>
          </label>
          <a href="#" className="text-sm font-semibold text-[#ef4f2f] transition hover:text-[#c94223]">
            OLVIDÉ MI CONTRASEÑA
          </a>
        </div>

        <PrimaryAuthButton label="Inicia Sesión" />
      </form>
    </AuthPageShell>
  );
}
