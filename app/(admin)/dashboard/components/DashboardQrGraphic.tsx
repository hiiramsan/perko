'use client';
import { QRCodeSVG } from 'qrcode.react';

type DashboardQrGraphicProps = {
	slug: string;
	logoUrl?: string;
	className?: string;
	logoSize?: number;
};

export function DashboardQrGraphic({ slug, logoUrl, className, logoSize = 64 }: DashboardQrGraphicProps) {
	// En desarrollo apunta a localhost, en producción usará dominio real de forma automática
	const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
	const clientJoinUrl = `${baseUrl}/join/${slug}`;
	return (
		<div className={className ?? 'flex h-full w-full items-center justify-center p-2 bg-white rounded-xl shadow-inner'}>
			<div className="relative flex h-full w-full max-h-full max-w-full items-center justify-center">
				<QRCodeSVG
					value={clientJoinUrl}
					size={256} 
					bgColor="#ffffff"
					fgColor="#0f172a" 
					level="M" // Nivel de tolerancia a errores medio
					includeMargin={false}
					className="h-full w-full max-h-full max-w-full"
					imageSettings={
						logoUrl
							? {
									src: 'data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==',
									x: undefined,
									y: undefined,
									height: logoSize + 15,
									width: logoSize + 15,
									excavate: true, 
							  }
							: undefined
					}
				/>
				{logoUrl && (
					<svg
						viewBox="0 0 256 256"
						className="absolute inset-0 h-full w-full max-h-full max-w-full pointer-events-none"
					>
						{/* La imagen superpuesta en su tamaño exacto */}
						<image
							href={logoUrl}
							x={128 - logoSize / 2}
							y={128 - logoSize / 2}
							width={logoSize}
							height={logoSize}
							preserveAspectRatio="xMidYMid slice"
						/>
					</svg>
				)}
			</div>
		</div>
	);
}