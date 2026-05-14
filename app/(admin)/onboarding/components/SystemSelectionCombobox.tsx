'use client';

import { useState } from 'react';
import { Check, ChevronDown, Info } from 'lucide-react';

export type SystemOption = {
  id: string;
  label: string;
  description: string;
  details: string;
  comingSoon?: boolean;
};

type SystemSelectionComboboxProps = {
  label: string;
  helperText?: string;
  options: SystemOption[];
  selectedIds: string[];
  onToggle: (id: string) => void;
};

export default function SystemSelectionCombobox({
  label,
  helperText,
  options,
  selectedIds,
  onToggle,
}: SystemSelectionComboboxProps) {
  const [open, setOpen] = useState(false);
  const [expandedInfoId, setExpandedInfoId] = useState<string | null>(null);

  return (
    <div className="space-y-3">
      <label className="block text-xs font-bold uppercase tracking-wide text-[#334155]">{label}</label>

      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="flex w-full items-center justify-between gap-4 rounded-2xl border border-[#dbe4ec] bg-[#f8fbfd] px-4 py-4 text-left transition hover:border-[#57b6d9]"
      >
        <div className="flex flex-1 flex-wrap gap-2">
          {selectedIds.length ? (
            selectedIds.map((id) => {
              const option = options.find((item) => item.id === id);
              if (!option) return null;

              return (
                <span
                  key={id}
                  className="inline-flex items-center rounded-full bg-[#0f172a] px-3 py-1 text-xs font-semibold text-white"
                >
                  {option.label}
                </span>
              );
            })
          ) : (
            <span className="text-sm text-[#64748b]">Selecciona uno o varios sistemas</span>
          )}
        </div>
        <ChevronDown size={18} className={`shrink-0 text-[#57b6d9] transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open ? (
        <div className="grid grid-cols-2 gap-3 rounded-2xl border border-[#dbe4ec] bg-white p-3 shadow-[0_12px_28px_-20px_rgba(15,23,42,0.45)]">
          {options.map((option) => {
            const selected = selectedIds.includes(option.id);
            const expanded = expandedInfoId === option.id;

            return (
              <div
                key={option.id}
                className={`rounded-2xl border p-4 transition ${selected ? 'border-[#2A9D8F] bg-[#eef8f6]' : 'border-[#e7edf2] bg-[#fbfdfe]'}`}
              >
                <div className="flex items-start gap-3">
                  <button
                    type="button"
                    onClick={() => onToggle(option.id)}
                    className={`mt-0.5 flex h-6 w-6 items-center justify-center rounded-full border transition ${selected ? 'border-[#2A9D8F] bg-[#2A9D8F] text-white' : 'border-[#cbd5e1] bg-white text-transparent'}`}
                    aria-label={selected ? `Quitar ${option.label}` : `Agregar ${option.label}`}
                  >
                    <Check size={14} />
                  </button>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-sm font-semibold text-[#0f172a]">{option.label}</p>
                      {option.comingSoon ? (
                        <span className="rounded-full bg-[#eef2f7] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-[#64748b]">
                          Próximamente
                        </span>
                      ) : null}
                    </div>
                    {expanded ? <p className="mt-2 text-sm text-[#334155]">{option.details}</p> : null}
                  </div>

                  <button
                    type="button"
                    onClick={() => setExpandedInfoId((prev) => (prev === option.id ? null : option.id))}
                    className="inline-flex shrink-0 items-center justify-center h-6 w-6 rounded-full border border-[#dbe4ec] bg-white text-[#334155] transition hover:border-[#57b6d9] hover:text-[#0f172a]"
                  >
                    <Info size={14} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
