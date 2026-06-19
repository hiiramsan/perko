'use client';

import { Plus, StampIcon, Coins } from 'lucide-react';
import { useState } from 'react';

const AVAILABLE_SYSTEMS = [
  { id: 'rewards' as const, label: 'Recompensa por visitas', icon: StampIcon },
  { id: 'points' as const, label: 'Puntos por compra', icon: Coins },
];

type AddSystemPickerProps = {
  hasRewards: boolean;
  hasPoints: boolean;
  saving: boolean;
  onAdd: (systemId: 'rewards' | 'points') => void;
};

export function AddSystemPicker({ hasRewards, hasPoints, saving, onAdd }: AddSystemPickerProps) {
  const [open, setOpen] = useState(false);

  const available = AVAILABLE_SYSTEMS.filter(
    (s) => (s.id === 'rewards' && !hasRewards) || (s.id === 'points' && !hasPoints),
  );

  if (available.length === 0) {
    return <p className="text-[11px] font-medium text-[#2A9D8F]">Todos los sistemas están configurados.</p>;
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="inline-flex h-9 items-center gap-2 rounded-full border border-dashed border-[#c8d3de] bg-transparent px-5 text-xs font-semibold text-[#64748b] transition hover:border-[#2A9D8F] hover:text-[#2A9D8F]"
      >
        <Plus size={14} />
        Agregar sistema
      </button>

      {open && (
        <div className="mt-2 w-64 rounded-xl border border-[#edf2f7] bg-white p-2 shadow-lg">
          {available.map((sys) => {
            const Icon = sys.icon;
            return (
              <button
                key={sys.id}
                type="button"
                onClick={() => { onAdd(sys.id); setOpen(false); }}
                disabled={saving}
                className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-medium text-[#334155] transition hover:bg-[#f9fcfb] disabled:opacity-50"
              >
                <Icon size={16} className="text-[#05668D]" />
                {sys.label}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
