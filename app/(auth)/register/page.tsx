'use client';

import { useState } from 'react';
import { BadgeCheck, Eye, EyeOff } from 'lucide-react';

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
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
    <main className="relative min-h-screen w-full overflow-hidden bg-[#f7f8fa]">
      <div
        className="absolute inset-0 z-0"
        style={{
          background: '#ffffff',
          backgroundImage:
            'radial-gradient(circle at 1px 1px, rgba(0, 0, 0, 0.35) 1px, transparent 0)',
          backgroundSize: '20px 20px',
        }}
      />

      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-1/2 -left-1/4 h-130 w-130 rounded-full bg-[#d8e6df] blur-[130px]" />
        <div className="absolute -bottom-1/2 -right-1/4 h-110 w-110 rounded-full bg-[#e6ece9] blur-[120px]" />
        <div className="absolute right-1/4 top-1/4 h-50 w-50 rounded-full bg-[#eef2f1] blur-[70px]" />
      </div>

      <div className="relative z-10 flex min-h-screen items-center justify-center px-4 py-8">
        <div className="w-full max-w-md">
          <div className="rounded-none border border-black border-r-4 border-b-4 bg-white p-8 shadow-[6px_6px_0_0_rgba(0,0,0,0.95)] sm:p-10">
            <div className="mb-6 flex justify-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-full border-2 border-black bg-[#425E31] shadow-sm">
                <BadgeCheck color="#ffffff" size={28} />
              </div>
            </div>

            <h1 className="mb-2 text-center text-2xl font-bold text-[#0f172a] sm:text-3xl">
              CREA TU CUENTA
            </h1>

            <p className="mb-8 text-center text-sm text-gray-600">
              REGÍSTRATE PARA EMPEZAR A USAR PERKO
            </p>

            <p className="text-center text-sm text-gray-600 mb-4">
              con
            </p>

            <div className="mb-6">
              <button
                type="button"
                className="flex w-full items-center justify-center gap-2 rounded-lg border-2 border-gray-300 py-3 font-bold uppercase tracking-wider text-[#0f172a] transition hover:bg-gray-50"
              >
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#0f172a" />
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#0f172a" />
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#0f172a" />
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#0f172a" />
                </svg>
                GOOGLE
              </button>
            </div>

            <div className="my-6 flex items-center gap-4">
              <div className="h-px flex-1 bg-gray-300" />
              <span className="text-sm font-semibold text-gray-500">O</span>
              <div className="h-px flex-1 bg-gray-300" />
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label htmlFor="businessName" className="block text-xs font-semibold uppercase text-[#0f172a]">
                  Nombre completo
                </label>
                <input
                  id="businessName"
                  type="text"
                  placeholder="Tu nombre"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 transition focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[#2f6a4f]"
                  required
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="email" className="block text-xs font-semibold uppercase text-[#0f172a]">
                  Correo
                </label>
                <input
                  id="email"
                  type="email"
                  placeholder="tu@correo.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 transition focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[#2f6a4f]"
                  required
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="password" className="block text-xs font-semibold uppercase text-[#0f172a]">
                  Contraseña
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Crea una contraseña"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 pr-12 transition focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[#2f6a4f]"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded bg-[#0f172a] p-1.5 text-white transition hover:bg-[#1a1f3a]"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="confirmPassword" className="block text-xs font-semibold uppercase text-[#0f172a]">
                  Confirmar contraseña
                </label>
                <div className="relative">
                  <input
                    id="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="Repite tu contraseña"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 pr-12 transition focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[#2f6a4f]"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded bg-[#0f172a] p-1.5 text-white transition hover:bg-[#1a1f3a]"
                  >
                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <label className="flex cursor-pointer items-start gap-2">
                <input
                  type="checkbox"
                  checked={acceptTerms}
                  onChange={(e) => setAcceptTerms(e.target.checked)}
                  className="mt-1 h-4 w-4 rounded border-gray-300 text-[#2f6a4f] focus:ring-[#2f6a4f]"
                  required
                />
                <span className="text-sm text-gray-600">
                  Acepto los términos y condiciones y la política de privacidad.
                </span>
              </label>

              <button
                type="submit"
                className="w-full rounded-lg bg-[#0f172a] py-3 font-bold uppercase tracking-wider text-white transition hover:bg-[#1a1f3a]"
              >
                Crear cuenta
              </button>
            </form>

            <p className="mt-8 text-center text-sm text-gray-600">
              ¿Ya tienes cuenta?{' '}
              <a href="/login" className="font-bold text-[#2f6a4f] transition hover:text-[#1f4a2f]">
                INICIA SESIÓN
              </a>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
