'use client';

import { QrCode } from 'lucide-react';
import StampPreviewCard from '@/components/StampPreviewCard';

type AdminCardSectionProps = {
  businessName: string;
  logoPreview: string;
  cardColor: string;
  slug: string;
  isCardFlipped: boolean;
  onToggleFlip: () => void;
  onOpenEditor: () => void;
  onQrClick: () => void;
};

export function AdminCardSection({
  businessName,
  logoPreview,
  cardColor,
  slug,
  isCardFlipped,
  onToggleFlip,
  onOpenEditor,
  onQrClick,
}: AdminCardSectionProps) {
  return (
    <article className="flex flex-col overflow-hidden rounded-none border border-black bg-white">
      <div className="px-5 pt-4 pb-3 sm:px-6">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#64748b]">Mi tarjeta</span>
        </div>
      </div>

      <div className="flex flex-1 items-center justify-center gap-10 px-5 pb-5 sm:px-6">
        <div className="max-w-84 sm:max-w-88">
          <StampPreviewCard
            businessName={businessName}
            logoPreview={logoPreview}
            cardColor={cardColor}
            compact
            flipped={isCardFlipped}
            onQrClick={onQrClick}
            qrSlug={slug}
            qrLogoUrl={logoPreview}
          />
        </div>

        <div className="flex shrink-0 flex-col gap-3">
          <button
            type="button"
            onClick={onToggleFlip}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-[#05668D] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#045676]"
          >
            <QrCode size={16} />
            {isCardFlipped ? 'Ver frente' : 'Mostrar QR'}
          </button>
          <button
            type="button"
            onClick={onOpenEditor}
            className="inline-flex items-center justify-center rounded-full border border-[#dbe4ec] bg-white px-4 py-3 text-sm font-semibold text-[#0f172a] transition hover:border-[#94a3b8] hover:bg-[#f8fbfd]"
          >
            Editar tarjeta
          </button>
        </div>
      </div>
    </article>
  );
}
