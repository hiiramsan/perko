'use client';

import { type ReactNode } from 'react';

type ModalBackdropProps = {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  className?: string;
};

export function ModalBackdrop({ open, onClose, children, className }: ModalBackdropProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm">
      <div className={className ?? 'relative'}>
        <button
          type="button"
          onClick={onClose}
          className="absolute -right-2 -top-2 z-10 flex h-7 w-7 items-center justify-center rounded-full border border-slate-200 bg-white text-xs font-bold text-slate-500 shadow-sm hover:bg-slate-100 cursor-pointer"
        >
          ✕
        </button>
        {children}
      </div>
    </div>
  );
}
