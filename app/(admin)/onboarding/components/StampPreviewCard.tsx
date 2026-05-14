'use client';

import { useEffect, useMemo, useState } from 'react';
import { BadgeCheck } from 'lucide-react';

type StampPreviewCardProps = {
  businessName: string;
  logoPreview: string;
};

const TOTAL_STAMPS = 10;

export default function StampPreviewCard({ businessName, logoPreview }: StampPreviewCardProps) {
  const [filledCount, setFilledCount] = useState(0);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setFilledCount((current) => (current >= TOTAL_STAMPS ? 0 : current + 1));
    }, 420);

    return () => window.clearInterval(interval);
  }, []);

  const stamps = useMemo(() => Array.from({ length: TOTAL_STAMPS }, (_, index) => index), []);

  return (
    <div className="h-full w-full rounded-2xl bg-[#4f7a35] p-3 shadow-[0_18px_40px_-20px_rgba(16,40,16,0.5)] sm:p-5">
      <div className="mb-2 flex items-center justify-center sm:mb-3">
        {logoPreview ? (
          <img src={logoPreview} className="h-8 w-8 rounded-full sm:h-10 sm:w-10" />
        ) : null}
      </div>
      <p className="mb-3 text-center text-sm font-semibold text-[#f2f6ef] sm:mb-4">
        {businessName}
      </p>

      <div className="grid grid-cols-5 gap-1.5 justify-items-center sm:gap-2">
        {stamps.map((stampIndex) => (
          <div
            key={`perko-stamp-${stampIndex}`}
            className={`flex h-7 w-7 items-center justify-center rounded-full sm:h-8 sm:w-8 ${stampIndex < filledCount ? 'bg-[#425E31]' : 'bg-[#8bb277]'}`}
          >
            {stampIndex < filledCount ? (
              <span className="text-[9px] font-semibold text-[#e9f2e3] sm:text-[10px]">
                <BadgeCheck color="#8bb277" />
              </span>
            ) : null}
          </div>
        ))}
      </div>
    </div>
  );
}
