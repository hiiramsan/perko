'use client';

import { useState } from 'react';
import FormField from '../components/FormField';
import PasswordField from '../components/PasswordField';
import PrimaryAuthButton from '../components/PrimaryAuthButton';
import AuthPageShell from '../components/AuthPageShell';

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [acceptTerms, setAcceptTerms] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log({ email, password, confirmPassword, businessName, acceptTerms });
  };

  return (
    <AuthPageShell
      title="CREA TU CUENTA"
      subtitle="REGÍSTRATE PARA EMPEZAR A USAR PERKO"
      footerText="¿Ya tienes cuenta?"
      footerHref="/login"
      footerLinkLabel="INICIA SESIÓN"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <FormField
          id="businessName"
          label="Nombre completo"
          type="text"
          placeholder="Tu nombre"
          value={businessName}
          onChange={(e) => setBusinessName(e.target.value)}
          autoComplete="organization"
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

        <PrimaryAuthButton label="Crear cuenta" />
      </form>
    </AuthPageShell>
  );
}
