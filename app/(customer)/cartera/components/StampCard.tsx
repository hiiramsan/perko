import Image from 'next/image';
import { ArrowUpRight, BadgeCheck } from 'lucide-react';

type StampCardProps = {
  businessName: string;
  linkLabel: string;
  href: string;
  logoSrc: string;
  cardColor: string;
  stampsFilled: number;
  rewardText: string;
};

const TOTAL_STAMPS = 10;

type CardPalette = {
  titleColor: string;
  linkColor: string;
  stampFilledColor: string;
  stampEmptyColor: string;
  stampIconColor: string;
  rewardColor: string;
};

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function hexToRgb(hex: string) {
  const normalized = hex.replace('#', '').trim();
  const expanded =
    normalized.length === 3
      ? normalized
          .split('')
          .map((c) => c + c)
          .join('')
      : normalized;
  const parsed = Number.parseInt(expanded, 16);
  return {
    red: (parsed >> 16) & 255,
    green: (parsed >> 8) & 255,
    blue: parsed & 255,
  };
}

function rgbToHex(red: number, green: number, blue: number) {
  return `#${[red, green, blue]
    .map((ch) => clamp(Math.round(ch), 0, 255).toString(16).padStart(2, '0'))
    .join('')}`;
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
  const toLinear = (ch: number) => {
    const n = ch / 255;
    return n <= 0.03928 ? n / 12.92 : ((n + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * toLinear(red) + 0.7152 * toLinear(green) + 0.0722 * toLinear(blue);
}

function getCardPalette(cardColor: string): CardPalette {
  const isLight = getRelativeLuminance(cardColor) > 0.58;
  return {
    titleColor: isLight ? '#0f172a' : '#f8fbfd',
    linkColor: isLight ? 'rgba(15,23,42,0.78)' : 'rgba(255,255,255,0.78)',
    stampFilledColor: mixColors(cardColor, '#0f172a', isLight ? 0.28 : 0.2),
    stampEmptyColor: mixColors(cardColor, '#ffffff', isLight ? 0.34 : 0.42),
    stampIconColor: mixColors(cardColor, '#ffffff', isLight ? 0.7 : 0.5),
    rewardColor: isLight ? 'rgba(15,23,42,0.82)' : 'rgba(255,255,255,0.9)',
  };
}

export default function StampCard({
  businessName,
  linkLabel,
  href,
  logoSrc,
  cardColor,
  stampsFilled,
  rewardText,
}: StampCardProps) {
  const palette = getCardPalette(cardColor);
  const stamps = Array.from({ length: TOTAL_STAMPS }, (_, i) => i);

  return (
    <article
      className="overflow-hidden rounded-[1.75rem] px-4 pb-4 pt-4 shadow-[0_22px_45px_-28px_rgba(15,23,42,0.55)] ring-1 ring-white/20 sm:px-5 sm:pb-5 sm:pt-5"
      style={{ backgroundColor: cardColor }}
    >
      <div className="flex items-start gap-3 mb-4">
        <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-full border border-white/20 bg-white/15 shadow-[0_8px_20px_-16px_rgba(15,23,42,0.8)] sm:h-13 sm:w-13">
          <Image
            src={logoSrc}
            alt={`${businessName} logo`}
            fill
            className="object-cover"
            sizes="52px"
          />
        </div>

        <div className="min-w-0 flex-1">
          <h2
            className="truncate text-[1.04rem] font-semibold leading-tight sm:text-[1.08rem]"
            style={{ color: palette.titleColor }}
          >
            {businessName}
          </h2>
          <a
            href={href}
            className="mt-0.5 inline-flex items-center gap-1 text-[0.8rem] font-medium transition-opacity hover:opacity-80"
            style={{ color: palette.linkColor }}
          >
            <span className="truncate">{linkLabel}</span>
            <ArrowUpRight size={14} strokeWidth={2.2} />
          </a>
        </div>
      </div>

      <div className="grid grid-cols-5 gap-2 sm:gap-2.5">
        {stamps.map((i) => {
          const filled = i < stampsFilled;
          return (
            <div
              key={`${businessName}-stamp-${i}`}
              className="flex h-9 w-9 items-center justify-center rounded-full sm:h-10 sm:w-10"
              style={{
                backgroundColor: filled ? palette.stampFilledColor : palette.stampEmptyColor,
              }}
            >
              {filled ? (
                <BadgeCheck size={22} color={palette.stampIconColor} strokeWidth={2} />
              ) : null}
            </div>
          );
        })}
      </div>

      <div className="mt-3 flex items-center justify-center sm:mt-4">
        <p className="text-[0.78rem] font-medium" style={{ color: palette.rewardColor }}>
          {rewardText}
        </p>
      </div>
    </article>
  );
}2