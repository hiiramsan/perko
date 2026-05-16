'use client';

type DashboardQrGraphicProps = {
	className?: string;
};

export function DashboardQrGraphic({ className }: DashboardQrGraphicProps) {
	return (
		<svg viewBox="0 0 240 240" className={className ?? 'h-full w-full'} role="img" aria-label="QR del negocio">
			<rect width="240" height="240" rx="28" fill="#ffffff" />
			<rect x="18" y="18" width="204" height="204" rx="18" fill="#f8fbfd" />

			<rect x="36" y="36" width="48" height="48" rx="10" fill="#0f172a" />
			<rect x="48" y="48" width="24" height="24" rx="6" fill="#ffffff" />

			<rect x="156" y="36" width="48" height="48" rx="10" fill="#0f172a" />
			<rect x="168" y="48" width="24" height="24" rx="6" fill="#ffffff" />

			<rect x="36" y="156" width="48" height="48" rx="10" fill="#0f172a" />
			<rect x="48" y="168" width="24" height="24" rx="6" fill="#ffffff" />

			<g fill="#0f172a">
				<rect x="104" y="40" width="12" height="12" rx="3" />
				<rect x="128" y="40" width="12" height="12" rx="3" />
				<rect x="104" y="64" width="12" height="12" rx="3" />
				<rect x="128" y="64" width="12" height="12" rx="3" />
				<rect x="96" y="96" width="12" height="12" rx="3" />
				<rect x="120" y="96" width="12" height="12" rx="3" />
				<rect x="144" y="96" width="12" height="12" rx="3" />
				<rect x="96" y="120" width="12" height="12" rx="3" />
				<rect x="120" y="120" width="12" height="12" rx="3" />
				<rect x="144" y="120" width="12" height="12" rx="3" />
				<rect x="96" y="144" width="12" height="12" rx="3" />
				<rect x="120" y="144" width="12" height="12" rx="3" />
				<rect x="144" y="144" width="12" height="12" rx="3" />
				<rect x="176" y="104" width="12" height="12" rx="3" />
				<rect x="176" y="128" width="12" height="12" rx="3" />
				<rect x="176" y="152" width="12" height="12" rx="3" />
				<rect x="104" y="176" width="12" height="12" rx="3" />
				<rect x="128" y="176" width="12" height="12" rx="3" />
				<rect x="152" y="176" width="12" height="12" rx="3" />
				<rect x="64" y="104" width="12" height="12" rx="3" />
				<rect x="64" y="128" width="12" height="12" rx="3" />
				<rect x="64" y="152" width="12" height="12" rx="3" />
			</g>
		</svg>
	);
}