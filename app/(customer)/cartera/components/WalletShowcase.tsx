'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import Image from 'next/image';
import StampCard from './StampCard';

export type WalletCard = {
  businessName: string;
  linkLabel: string;
  href: string;
  logoSrc: string;
  cardColor: string;
  stampsFilled: number;
  rewardText: string;
  cardCode: string;
};

type WalletShowcaseProps = {
  walletCards: WalletCard[];
};

const CARD_HEIGHT = 196;
const PEEK_HEIGHT = 68;

export default function WalletShowcase({ walletCards }: WalletShowcaseProps) {
  const [order, setOrder] = useState<number[]>(() =>
    walletCards.map((_, index) => index),
  );
  const [sheetCardIdx, setSheetCardIdx] = useState<number | null>(null);
  const [sheetVisible, setSheetVisible] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const n = walletCards.length;

  const bringToActive = useCallback((cardIdx: number) => {
    setOrder((prev) => {
      if (prev[prev.length - 1] === cardIdx) return prev;
      return [...prev.filter((i) => i !== cardIdx), cardIdx];
    });
  }, []);

  const openSheet = useCallback((cardIdx: number) => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setSheetCardIdx(cardIdx);
    requestAnimationFrame(() => requestAnimationFrame(() => setSheetVisible(true)));
  }, []);

  const closeSheet = useCallback(() => {
    setSheetVisible(false);
    closeTimer.current = setTimeout(() => setSheetCardIdx(null), 380);
  }, []);

  useEffect(() => {
    if (sheetCardIdx === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeSheet();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [sheetCardIdx, closeSheet]);

  const stackHeight = (n - 1) * PEEK_HEIGHT + CARD_HEIGHT;
  const sheetCard = sheetCardIdx !== null ? walletCards[sheetCardIdx] : null;

  return (
    <>
      <div className="mt-8 flex justify-center md:hidden">
        <div className="relative w-72 sm:w-80" style={{ height: stackHeight }}>
          {walletCards.map((card, cardIdx) => {
            const rank = order.indexOf(cardIdx);
            const isActive = rank === n - 1;
            const top = rank * PEEK_HEIGHT;
            const scale = isActive ? 1 : 1 - (n - 1 - rank) * 0.018;

            return (
              <div
                key={cardIdx}
                onClick={() => {
                  if (sheetCardIdx !== null) return;
                  if (isActive) openSheet(cardIdx);
                  else bringToActive(cardIdx);
                }}
                className="absolute left-0 right-0 cursor-pointer origin-top overflow-hidden rounded-[1.75rem]"
                style={{
                  top,
                  zIndex: rank + 1,
                  transform: `scale(${scale})`,
                  transformOrigin: 'top center',
                  boxShadow: isActive
                    ? '0 18px 48px -12px rgba(15,23,42,0.45)'
                    : '0 4px 14px -8px rgba(15,23,42,0.28)',
                  transition:
                    'top 0.42s cubic-bezier(0.34,1.36,0.64,1), transform 0.42s cubic-bezier(0.34,1.36,0.64,1)',
                  pointerEvents: sheetCardIdx !== null ? 'none' : 'auto',
                }}
              >
                <StampCard
                  businessName={card.businessName}
                  linkLabel={card.linkLabel}
                  href={card.href}
                  logoSrc={card.logoSrc}
                  cardColor={card.cardColor}
                  stampsFilled={card.stampsFilled}
                  rewardText={card.rewardText}
                />
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-10 hidden md:block">
        <div className="mx-auto grid max-w-5xl grid-cols-2 gap-6 lg:grid-cols-3">
          {walletCards.map((card, cardIdx) => (
            <div
              key={`grid-${cardIdx}`}
              onClick={() => {
                if (sheetCardIdx !== null) return;
                openSheet(cardIdx);
              }}
              className="cursor-pointer rounded-[1.75rem] shadow-[0_18px_40px_-26px_rgba(15,23,42,0.25)] transition-transform hover:-translate-y-1"
              style={{ pointerEvents: sheetCardIdx !== null ? 'none' : 'auto' }}
            >
              <StampCard
                businessName={card.businessName}
                linkLabel={card.linkLabel}
                href={card.href}
                logoSrc={card.logoSrc}
                cardColor={card.cardColor}
                stampsFilled={card.stampsFilled}
                rewardText={card.rewardText}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Blur overlay */}
      {sheetCardIdx !== null && (
        <div
          onClick={closeSheet}
          className="fixed inset-0 z-40 bg-black/20 backdrop-blur-[3px] transition-opacity duration-300"
          style={{ opacity: sheetVisible ? 1 : 0 }}
        />
      )}

      {/* Bottom sheet */}
      {sheetCard && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Scan your card"
          className="fixed bottom-0 left-0 right-0 z-50 mx-auto max-w-105 rounded-t-[28px] bg-white pb-12 transition-transform duration-380"
          style={{
            transform: sheetVisible ? 'translateY(0)' : 'translateY(100%)',
            transitionTimingFunction: 'cubic-bezier(0.34,1.2,0.64,1)',
          }}
        >
          {/* Drag handle */}
          <div className="mx-auto mt-3 h-1 w-9 rounded-full bg-slate-200" />

          {/* Close button */}
          <button
            type="button"
            aria-label="Cerrar QR"
            onClick={closeSheet}
            className="absolute cursor-pointer right-4 top-3.5 flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200"
          >
            ✕
          </button>

          {/* Title */}
          <p className="mt-4 text-center font-roboto text-2xl font-normal text-slate-900">
            Scan your card
          </p>

          {/* Card mini-preview */}
          <div
            className="mx-auto mt-5 flex h-30 w-50 flex-col items-center justify-center gap-2 rounded-xl"
            style={{
              backgroundColor: sheetCard.cardColor,
            }}
          >
            <div className="relative h-9 w-9 overflow-hidden rounded-full border border-white/30 bg-white/20">
              <Image
                src={sheetCard.logoSrc}
                alt={sheetCard.businessName}
                fill
                className="object-cover"
                sizes="36px"
              />
            </div>
            <p className="text-[13px] font-semibold text-white">
              {sheetCard.businessName}
            </p>
          </div>

          {/* QR code */}
          <div className="mx-auto mt-6 w-64 sm:w-72">
            <Image
              src="/qrcode.svg"
              alt="QR code"
              width={288}
              height={80}
              className="w-full"
            />
          </div>

          {/* Card identity */}
          <div className="mt-3 text-center">
            <p className="text-[13px] font-semibold text-slate-900">
              {sheetCard.businessName}
            </p>
            <p className="mt-0.5 text-[12px] text-slate-500">
              {sheetCard.cardCode}
            </p>
          </div>
        </div>
      )}

    </>
  );
}
