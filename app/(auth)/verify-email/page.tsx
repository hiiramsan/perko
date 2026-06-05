import Link from 'next/link';

export default function VerifyEmailPage({ searchParams }: { searchParams?: { email?: string } }) {
  const email = searchParams?.email || '';

  return (
    <main className="min-h-screen flex items-center justify-center bg-[#f7f8fa] p-6">
      <div className="w-full max-w-md">
        <div className="rounded-2xl border border-[#d5dde4] bg-white p-8 shadow-[0_18px_40px_-25px_rgba(15,23,42,0.35)] text-center">
          <svg className="mx-auto mb-4 h-14 w-14 text-[#2A9D8F]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10a1 1 0 011-1h3.28a2 2 0 001.94-1.38L10.9 3.1a1 1 0 011.8 0l1.68 4.52A2 2 0 0016.32 10H19a1 1 0 011 1v7a2 2 0 01-2 2H5a2 2 0 01-2-2v-7z" />
          </svg>

          <h1 className="mb-2 text-2xl font-bold text-[#0f172a]">Verifica tu correo</h1>
          <p className="mb-4 text-sm text-[#475569]">Hemos enviado un enlace de verificación a <strong>{email || 'tu correo'}</strong>. Abre el enlace para activar tu cuenta.</p>

          <div className="mt-6 flex flex-col gap-3">
            <Link href="/" className="inline-flex items-center justify-center rounded-full bg-[#0f172a] px-4 py-3 text-sm font-semibold text-white">Ir al inicio</Link>
            <Link href="/login" className="inline-flex items-center justify-center rounded-full border border-[#dbe4ec] bg-white px-4 py-3 text-sm font-semibold text-[#0f172a]">Iniciar sesión</Link>
          </div>
        </div>
      </div>
    </main>
  );
}
