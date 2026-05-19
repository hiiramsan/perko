'use client';

import { useEffect, useMemo, useState } from 'react';
import { BadgeCheck, Sparkles } from 'lucide-react';

type StampPreviewCardProps = {
	businessName: string;
	logoPreview: string;
	cardColor?: string;
	compact?: boolean;
};

const TOTAL_STAMPS = 10;

type CardPalette = {
	titleColor: string;
	logoBorderColor: string;
	logoTextColor: string;
	filledStickerColor: string;
	emptyStickerColor: string;
	badgeColor: string;
};

function clamp(value: number, min: number, max: number) {
	return Math.min(max, Math.max(min, value));
}

function hexToRgb(hex: string) {
	const normalized = hex.replace('#', '').trim();
	const expanded = normalized.length === 3 ? normalized.split('').map((character) => character + character).join('') : normalized;
	const parsed = Number.parseInt(expanded, 16);

	return {
		red: (parsed >> 16) & 255,
		green: (parsed >> 8) & 255,
		blue: parsed & 255,
	};
}

function rgbToHex(red: number, green: number, blue: number) {
	return `#${[red, green, blue].map((channel) => clamp(Math.round(channel), 0, 255).toString(16).padStart(2, '0')).join('')}`;
}

function mixColors(baseColor: string, targetColor: string, amount: number) {
	const from = hexToRgb(baseColor);
	const to = hexToRgb(targetColor);

	return rgbToHex(
		from.red + (to.red - from.red) * amount,
		from.green + (to.green - from.green) * amount,
		from.blue + (to.blue - from.blue) * amount,
	);
}

function getRelativeLuminance(hex: string) {
	const { red, green, blue } = hexToRgb(hex);

	const channelToLinear = (channel: number) => {
		const normalized = channel / 255;
		return normalized <= 0.03928 ? normalized / 12.92 : ((normalized + 0.055) / 1.055) ** 2.4;
	};

	return 0.2126 * channelToLinear(red) + 0.7152 * channelToLinear(green) + 0.0722 * channelToLinear(blue);
}

function getCardPalette(cardColor: string): CardPalette {
	const isLightColor = getRelativeLuminance(cardColor) > 0.62;

	return {
		titleColor: isLightColor ? '#0f172a' : '#f8fbfd',
		logoBorderColor: isLightColor ? 'rgba(15, 23, 42, 0.20)' : 'rgba(255, 255, 255, 0.32)',
		logoTextColor: isLightColor ? 'rgba(15, 23, 42, 0.78)' : 'rgba(255, 255, 255, 0.88)',
		filledStickerColor: mixColors(cardColor, '#0f172a', isLightColor ? 0.28 : 0.22),
		emptyStickerColor: mixColors(cardColor, '#ffffff', isLightColor ? 0.34 : 0.48),
		badgeColor: mixColors(cardColor, '#ffffff', isLightColor ? 0.68 : 0.48),
	};
}

export default function StampPreviewCard({ businessName, logoPreview, cardColor = '#4f7a35', compact = false }: StampPreviewCardProps) {
	const [filledCount, setFilledCount] = useState(0);
	const palette = useMemo(() => getCardPalette(cardColor), [cardColor]);

	useEffect(() => {
		const interval = window.setInterval(() => {
			setFilledCount((current) => (current >= TOTAL_STAMPS ? 0 : current + 1));
		}, 420);

		return () => window.clearInterval(interval);
	}, []);

	const stamps = useMemo(() => Array.from({ length: TOTAL_STAMPS }, (_, index) => index), []);

	return (
		<div
			className={`h-full w-full rounded-2xl shadow-[0_18px_40px_-20px_rgba(16,40,16,0.5)] ${compact ? 'px-4 pt-3 pb-6 sm:px-5 sm:pt-3 sm:pb-7' : 'px-3 pt-3 pb-12 sm:px-5 sm:pt-5 sm:pb-14'}`}
			style={{ backgroundColor: cardColor }}
		>
			<div className={`flex items-center justify-center ${compact ? 'mb-1.5 sm:mb-2' : 'mb-2 sm:mb-3'}`}>
				{logoPreview ? (
					<img src={logoPreview} alt="Logo del negocio" className={`${compact ? 'h-7 w-7 sm:h-8 sm:w-8' : 'h-8 w-8 sm:h-10 sm:w-10'} rounded-full object-cover`} />
				) : (
					<div
						className={`flex items-center justify-center rounded-full border ${compact ? 'h-7 w-7 sm:h-8 sm:w-8' : 'h-8 w-8 sm:h-10 sm:w-10'}`}
						style={{ borderColor: palette.logoBorderColor, color: palette.logoTextColor, backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
					>
						<Sparkles size={compact ? 12 : 14} strokeWidth={2.4} />
					</div>
				)}
			</div>

			<p className={`text-center font-semibold ${compact ? 'mb-2 text-sm sm:mb-2.5' : 'mb-3 text-sm sm:mb-4'}`} style={{ color: palette.titleColor }}>
				{businessName || 'Tu negocio'}
			</p>

			<div className={`grid grid-cols-5 justify-items-center ${compact ? 'gap-2 sm:gap-2.5' : 'gap-2.5 sm:gap-3'}`}>
				{stamps.map((stampIndex) => {
					const isFilled = stampIndex < filledCount;

					return (
						<div
							key={`perko-stamp-${stampIndex}`}
							className={`flex items-center justify-center rounded-full ${compact ? 'h-7 w-7 sm:h-8 sm:w-8' : 'h-8 w-8 sm:h-9 sm:w-9'}`}
							style={{ backgroundColor: isFilled ? palette.filledStickerColor : palette.emptyStickerColor }}
						>
							{isFilled ? <BadgeCheck size={compact ? 18 : 22} color={palette.badgeColor} strokeWidth={2.6} /> : null}
						</div>
					);
				})}
			</div>
		</div>
	);
}