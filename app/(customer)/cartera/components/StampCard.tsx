'use client';

import { useLayoutEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { ArrowUpRight, BadgeCheck } from 'lucide-react';

type StampCardProps = {
  businessName: string;
  linkLabel: string;
  logoSrc: string;
  cardColor: string;
  stampsFilled: number;
  rewardText: string;
  programType?: 'rewards' | 'points';
  currentPoints?: number;
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
      ? normalized.split('').map((c) => c + c).join('')
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
  logoSrc,
  cardColor,
  stampsFilled,
  rewardText,
  programType = 'rewards',
  currentPoints = 0,
}: StampCardProps) {
  const palette = getCardPalette(cardColor);
  const stamps = Array.from({ length: TOTAL_STAMPS }, (_, i) => i);

  const prevFilledRef = useRef(stampsFilled);
  const [animating, setAnimating] = useState<Set<number>>(new Set());

  useLayoutEffect(() => {
    if (stampsFilled > prevFilledRef.current) {
      const newIndices = new Set<number>();
      for (let i = prevFilledRef.current; i < stampsFilled; i++) {
        newIndices.add(i);
      }
      setAnimating(newIndices);
      const timer = setTimeout(() => setAnimating(new Set()), 800);
      prevFilledRef.current = stampsFilled;
      return () => clearTimeout(timer);
    }
    prevFilledRef.current = stampsFilled;
  }, [stampsFilled]);

  return (
    <article
      className="overflow-hidden rounded-[2rem] px-5 pb-5 pt-5 shadow-[0_22px_50px_-20px_rgba(15,23,42,0.6)] ring-1 ring-white/20 sm:px-6 sm:pb-6 sm:pt-5"
      style={{ backgroundColor: cardColor }}
    >
      <div className="flex items-start gap-3.5 mb-5 sm:gap-4 sm:mb-6">
        <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full border border-white/20 bg-white/15 shadow-[0_8px_24px_-16px_rgba(15,23,42,0.8)] sm:h-14 sm:w-14">
          <Image
            src={logoSrc}
            alt={`${businessName} logo`}
            fill
            className="object-cover"
            sizes="56px"
          />
        </div>

        <div className="min-w-0 flex-1">
          <h2
            className="font-sans truncate text-[1.12rem] font-semibold tracking-[-0.025em] leading-tight sm:text-[1.22rem]"
            style={{ color: palette.titleColor }}
          >
            {businessName}
          </h2>
          <span
            className="mt-1 inline-flex items-center gap-1 text-[0.82rem] font-[475] tracking-[-0.01em]"
            style={{ color: palette.linkColor }}
          >
            <span className="truncate">{linkLabel}</span>
            <ArrowUpRight size={14} strokeWidth={2.4} />
          </span>
        </div>
      </div>

      {programType === 'rewards' ? (
        <div className="grid grid-cols-5 gap-2.5 sm:gap-3.5">
          {stamps.map((i) => {
            const filled = i < stampsFilled;
            return (
              <div
                key={`${businessName}-stamp-${i}`}
                className={`flex h-10 w-10 items-center justify-center rounded-full sm:h-12 sm:w-12 ${animating.has(i) ? 'animate-stamp-pop' : ''}`}
                style={{
                  backgroundColor: filled ? palette.stampFilledColor : palette.stampEmptyColor,
                  animationDelay: animating.has(i) ? `${(i - (stampsFilled - animating.size)) * 90}ms` : '0ms',
                }}
              >
                {filled ? (
                  <BadgeCheck size={24} color={palette.stampIconColor} strokeWidth={2} />
                ) : null}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="flex h-11 sm:h-12 items-center justify-between px-4 rounded-xl bg-black/15">
          <span className="font-sans text-[0.78rem] font-bold uppercase tracking-wider opacity-75" style={{ color: palette.titleColor }}>
            Saldo Monedero:
          </span>
          <span className="font-sans text-xl font-black tracking-[-0.03em]" style={{ color: palette.titleColor }}>
            {currentPoints.toFixed(2)} Pts
          </span>
        </div>
      )}

      <div className="mt-4 flex items-center justify-center sm:mt-5">
        <p className="font-sans text-[0.82rem] font-[500] tracking-[-0.01em] sm:text-[0.85rem]" style={{ color: palette.rewardColor }}>
          {rewardText}
        </p>
      </div>
    </article>
  );
}