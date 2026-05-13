'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, BadgeCheck } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    router.push('/onboarding');
  };

  return (
    <main className="relative min-h-screen w-full overflow-hidden bg-[#f7f8fa]">
      {/* Fondo con patrón de puntos */}
      <div
        className="absolute inset-0 z-0"
        style={{
          background: '#ffffff',
          backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(0, 0, 0, 0.35) 1px, transparent 0)',
          backgroundSize: '20px 20px',
        }}
      />

      {/* Blobs de fondo */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-1/2 -left-1/4 h-130 w-130 rounded-full bg-[#d8e6df] blur-[130px]" />
        <div className="absolute -bottom-1/2 -right-1/4 h-110 w-110 rounded-full bg-[#e6ece9] blur-[120px]" />
        <div className="absolute right-1/4 top-1/4 h-50 w-50 rounded-full bg-[#eef2f1] blur-[70px]" />
      </div>

      {/* Contenedor del formulario */}
      <div className="relative z-10 flex items-center justify-center min-h-screen px-4 py-8">
        <div className="w-full max-w-md">
          {/* Card principal */}
          <div className="bg-white rounded-3xl shadow-lg p-8 sm:p-10 border border-[#e2e8f0]">
            {/* Sticker con palomita (igual que las tarjetas en la página principal) */}
            <div className="flex justify-center mb-6">
              <div className="h-14 w-14 flex items-center justify-center rounded-full bg-[#2A9D8F] border-2 border-[#2A9D8F] shadow-lg">
                <BadgeCheck color="#ffffff" size={28} />
              </div>
            </div>

            {/* Título */}
            <h1 className="text-center text-2xl sm:text-3xl font-bold text-[#0f172a] mb-2">
              INICIA SESIÓN
            </h1>

            {/* Subtítulo */}
            <p className="text-center text-sm text-[#64748b] mb-8">
              INGRESA TUS CREDENCIALES
            </p>

            {/* Señal de continuación social */}
            <p className="text-center text-sm text-gray-600 mb-4">
              con
            </p>

            {/* Botón social principal */}
            <div className="mb-6">
              <button
                type="button"
                className="w-full border-2 border-[#e2e8f0] text-[#0f172a] font-semibold py-3 rounded-full hover:bg-[#f8fafc] transition flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC04"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                GOOGLE
              </button>
            </div>

            {/* Separador */}
            <div className="my-6 flex items-center gap-4">
              <div className="flex-1 h-px bg-gray-300" />
              <span className="text-sm text-gray-500 font-semibold">O</span>
              <div className="flex-1 h-px bg-gray-300" />
            </div>

            {/* Formulario */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email */}
              <div className="space-y-2">
                <label htmlFor="email" className="block text-xs font-medium text-[#475569]">
                  Correo
                </label>
                <input
                  id="email"
                  type="email"
                  placeholder="tu@correo.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 border border-[#e2e8f0] rounded-full focus:outline-none focus:ring-2 focus:ring-[#2A9D8F] focus:border-transparent transition"
                  required
                />
              </div>

              {/* Password */}
              <div className="space-y-2">
                <label htmlFor="password" className="block text-xs font-medium text-[#475569]">
                  Contraseña
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Ingresa tu contraseña"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3 border border-[#e2e8f0] rounded-full focus:outline-none focus:ring-2 focus:ring-[#2A9D8F] focus:border-transparent transition pr-12"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-[#2A9D8F] text-white p-1.5 rounded-full hover:bg-[#1f8a7a] transition"
                  >
                    {showPassword ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>
                </div>
              </div>

              {/* Remember me & Forgot password */}
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded border-[#e2e8f0] text-[#2A9D8F] focus:ring-[#2A9D8F]"
                  />
                  <span className="text-sm text-[#475569]">Recuérdame</span>
                </label>
                <a href="#" className="text-sm font-medium text-[#2A9D8F] hover:text-[#1f8a7a] transition">
                  ¿Olvidé mi contraseña?
                </a>
              </div>

              {/* Sign in button */}
              <button
                type="submit"
                className="w-full bg-[#2A9D8F] text-white font-bold py-3 rounded-full hover:bg-[#1f8a7a] transition uppercase tracking-wider"
              >
                Inicia Sesión
              </button>
            </form>

            {/* Link sign up */}
            <p className="text-center mt-8 text-sm text-[#475569]">
              ¿No tienes cuenta?{' '}
              <a href="/register" className="font-bold text-[#2A9D8F] transition hover:text-[#1f8a7a]">
                Crear una
              </a>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
