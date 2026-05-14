import type { ReactNode } from 'react';
import Link from 'next/link';
import { BadgeCheck } from 'lucide-react';
import GoogleAuthButton from './GoogleAuthButton';
import AuthDivider from './AuthDivider';

type AuthPageShellProps = {
  title: string;
  subtitle: string;
  footerText: string;
  footerHref: string;
  footerLinkLabel: string;
  children: ReactNode;
};

export default function AuthPageShell({
  title,
  subtitle,
  footerText,
  footerHref,
  footerLinkLabel,
  children,
}: AuthPageShellProps) {
  return (
    <main className="relative min-h-screen w-full overflow-hidden bg-[#f7f8fa]">
      <div
        className="absolute inset-0 z-0"
        style={{
          background: '#ffffff',
          backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(0, 0, 0, 0.35) 1px, transparent 0)',
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

            <h1 className="mb-2 text-center text-2xl font-bold text-[#0f172a] sm:text-3xl">{title}</h1>
            <p className="mb-8 text-center text-sm text-gray-600">{subtitle}</p>

            <p className="mb-4 text-center text-sm text-gray-600">con</p>
            <div className="mb-6">
              <GoogleAuthButton />
            </div>

            <AuthDivider />

            {children}

            <p className="mt-8 text-center text-sm text-gray-600">
              {footerText}{' '}
              <Link href={footerHref} className="font-bold text-[#2f6a4f] transition hover:text-[#1f4a2f]">
                {footerLinkLabel}
              </Link>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
