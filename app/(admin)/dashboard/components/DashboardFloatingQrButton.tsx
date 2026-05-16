'use client';

import { QrCode } from 'lucide-react';

type DashboardFloatingQrButtonProps = {
	onClick: () => void;
};

export function DashboardFloatingQrButton({ onClick }: DashboardFloatingQrButtonProps) {
	return (
		<button
			type="button"
			onClick={onClick}
			className="fixed bottom-6 right-6 z-30 inline-flex items-center gap-2 rounded-full border border-[#dbe4ec] bg-white px-4 py-3 text-sm font-semibold text-[#0f172a] shadow-[0_14px_35px_-18px_rgba(15,23,42,0.45)] transition hover:-translate-y-0.5 hover:border-[#05668D] hover:text-[#05668D] focus:outline-none focus:ring-2 focus:ring-[#05668D] focus:ring-offset-2"
		>
			<QrCode size={16} />
			QR
		</button>
	);
}