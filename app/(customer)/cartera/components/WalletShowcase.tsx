'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import Image from 'next/image';
import StampCard from './StampCard';
import { QRCodeSVG } from 'qrcode.react';

export type WalletCard = {
  businessName: string;
  linkLabel: string;
  logoSrc: string;
  cardColor: string;
  stampsFilled: number;
  rewardText: string;
  cardCode: string;
  qrValue: string;
  programType?: 'rewards' | 'points';
  currentPoints?: number;
};

type WalletShowcaseProps = {
  walletCards: WalletCard[];
  onRefresh?: () => void;
};

const CARD_HEIGHT = 264;
const PEEK_HEIGHT = 72;

export default function WalletShowcase({ walletCards, onRefresh }: WalletShowcaseProps) {
  const [order, setOrder] = useState<number[]>(() =>
    walletCards.map((_, index) => index),
  );
  const [sheetCardIdx, setSheetCardIdx] = useState<number | null>(null);
  const [sheetVisible, setSheetVisible] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const prevCardsRef = useRef(walletCards);

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

  useEffect(() => {
    if (sheetCardIdx === null) return;
    const interval = setInterval(() => onRefresh?.(), 3000);
    return () => clearInterval(interval);
  }, [sheetCardIdx, onRefresh]);

  useEffect(() => {
    if (sheetCardIdx !== null && walletCards !== prevCardsRef.current) {
      const prev = prevCardsRef.current[sheetCardIdx];
      const curr = walletCards[sheetCardIdx];
      if (
        prev && curr &&
        (prev.stampsFilled !== curr.stampsFilled ||
         prev.currentPoints !== curr.currentPoints)
      ) {
        closeSheet();
      }
    }
    prevCardsRef.current = walletCards;
  }, [walletCards, sheetCardIdx, closeSheet]);

  const stackHeight = (n - 1) * PEEK_HEIGHT + CARD_HEIGHT;
  const sheetCard = sheetCardIdx !== null ? walletCards[sheetCardIdx] : null;

  return (
    <>
      <div className="mt-8 flex justify-center md:hidden">
        <div className="relative w-full max-w-sm sm:max-w-md" style={{ height: stackHeight }}>
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
                className="absolute left-0 right-0 cursor-pointer origin-top overflow-hidden rounded-[2rem]"
                style={{
                  top,
                  zIndex: rank + 1,
                  transform: `scale(${scale})`,
                  transformOrigin: 'top center',
                  boxShadow: isActive
                    ? '0 22px 56px -16px rgba(15,23,42,0.5)'
                    : '0 4px 14px -8px rgba(15,23,42,0.28)',
                  transition:
                    'top 0.42s cubic-bezier(0.34,1.36,0.64,1), transform 0.42s cubic-bezier(0.34,1.36,0.64,1)',
                  pointerEvents: sheetCardIdx !== null ? 'none' : 'auto',
                }}
              >
                <StampCard
                  businessName={card.businessName}
                  linkLabel={card.linkLabel}
                  logoSrc={card.logoSrc}
                  cardColor={card.cardColor}
                  stampsFilled={card.stampsFilled}
                  rewardText={card.rewardText}
                  programType={card.programType}
                  currentPoints={card.currentPoints}
                />
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-10 hidden md:block">
        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-7 lg:grid-cols-3">
          {walletCards.map((card, cardIdx) => (
            <div
              key={`grid-${cardIdx}`}
              onClick={() => {
                if (sheetCardIdx !== null) return;
                openSheet(cardIdx);
              }}
              className="cursor-pointer rounded-[2rem] shadow-[0_18px_44px_-24px_rgba(15,23,42,0.3)] transition-transform hover:-translate-y-1.5"
              style={{ pointerEvents: sheetCardIdx !== null ? 'none' : 'auto' }}
            >
              <StampCard
                businessName={card.businessName}
                linkLabel={card.linkLabel}
                logoSrc={card.logoSrc}
                cardColor={card.cardColor}
                stampsFilled={card.stampsFilled}
                rewardText={card.rewardText}
                programType={card.programType}
                currentPoints={card.currentPoints}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Blur overlay */}
      {sheetCardIdx !== null && (
        <div
          onClick={closeSheet}
          className="fixed inset-0 z-40 bg-black/15 backdrop-blur-[6px] transition-opacity duration-300"
          style={{ opacity: sheetVisible ? 1 : 0 }}
        />
      )}

      {/* Bottom sheet */}
      {sheetCard && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Scan your card"
          className="fixed bottom-0 left-0 right-0 z-50 mx-auto max-w-lg rounded-t-[32px] bg-white pb-14 shadow-[0_-8px_40px_-12px_rgba(15,23,42,0.2)] transition-transform duration-380"
          style={{
            transform: sheetVisible ? 'translateY(0)' : 'translateY(100%)',
            transitionTimingFunction: 'cubic-bezier(0.34,1.2,0.64,1)',
          }}
        >
          {/* Drag handle */}
          <div className="mx-auto mt-3 h-1 w-9 rounded-full bg-slate-300" />

          {/* Close button */}
          <button
            type="button"
            aria-label="Cerrar QR"
            onClick={closeSheet}
            className="absolute cursor-pointer right-4 top-3.5 flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-400 text-[15px] leading-none hover:bg-slate-200 transition-colors"
          >
            ✕
          </button>

          {/* Title */}
          <p className="mt-6 text-center text-xl font-semibold tracking-tight text-slate-900">
            Escanea tu tarjeta
          </p>

          {/* Card mini-preview */}
          <div
            className="mx-auto mt-6 flex h-32 w-52 flex-col items-center justify-center gap-2 rounded-2xl"
            style={{
              backgroundColor: sheetCard.cardColor,
            }}
          >
            <div className="relative h-10 w-10 overflow-hidden rounded-full border border-white/30 bg-white/20">
              <Image
                src={sheetCard.logoSrc}
                alt={sheetCard.businessName}
                fill
                className="object-cover"
                sizes="40px"
              />
            </div>
            <p className="text-sm font-semibold tracking-tight text-white">
              {sheetCard.businessName}
            </p>
          </div>

          {/* QR code */}
          <div className="mx-auto mt-6 flex justify-center bg-white p-5 rounded-2xl shadow-inner border border-slate-100 w-68 sm:w-80">
            <QRCodeSVG
              value={sheetCard.qrValue}
              size={220}
              fgColor="#0f172a"
              bgColor="#ffffff"
              level="H"
            />
          </div>

          {/* Card identity */}
          <div className="mt-4 text-center">
            <p className="text-sm font-semibold tracking-tight text-slate-900">
              {sheetCard.businessName}
            </p>
            <p className="mt-0.5 text-[13px] font-[450] text-slate-400 tracking-tight">
              {sheetCard.cardCode}
            </p>
          </div>
        </div>
      )}
    </>
  );
}