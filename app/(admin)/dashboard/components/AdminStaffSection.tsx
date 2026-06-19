'use client';

import { useState } from 'react';
import { AdminStaffEditModal } from './AdminStaffEditModal';

type StaffRow = {
  name: string;
  stampsGiven: number;
  pointsGiven: number;
};

type AdminStaffSectionProps = {
  staffRows: StaffRow[];
  loading: boolean;
  onOpenAddStaff: () => void;
};

export function AdminStaffSection({ staffRows, loading, onOpenAddStaff }: AdminStaffSectionProps) {
  const [editingStaffIndex, setEditingStaffIndex] = useState<number | null>(null);
  const [editName, setEditName] = useState('');
  const [editPassword, setEditPassword] = useState('');

  return (
    <section className="flex h-full min-h-0 flex-col rounded-none border border-black bg-white p-5">
      <div className="mb-5 flex shrink-0 items-center justify-between gap-2">
        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#64748b]">Miembros del Staff</span>
        <button
          type="button"
          onClick={onOpenAddStaff}
          className="inline-flex h-8 items-center gap-1.5 rounded-full border border-[#dbe4ec] bg-white px-3.5 text-xs font-semibold text-[#0f172a] shadow-sm transition hover:border-[#94a3b8] hover:bg-white"
        >
          + Agregar
        </button>
      </div>

      {loading ? (
        <p className="text-xs text-[#64748b]">Cargando...</p>
      ) : (
        <div className="flex min-h-0 flex-1 overflow-hidden rounded-xl border border-[#edf2f7] bg-[#f9fcfb]">
          <div className="w-full overflow-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            <table className="w-full border-collapse text-left table-fixed">
              <thead className="bg-[#f3f7f8] text-[10px] font-bold uppercase tracking-[0.24em] text-[#64748b]">
                <tr>
                  <th className="px-4 py-2.5 w-[120px] whitespace-normal">Nombre del Barista</th>
                  <th className="px-4 py-2.5 text-center w-[100px] whitespace-normal">Timbres Dados Hoy</th>
                  <th className="px-4 py-2.5 text-center w-[100px] whitespace-normal">Puntos Dados Hoy</th>
                  <th className="px-4 py-2.5 text-center w-14"></th>
                </tr>
              </thead>
              <tbody>
                {staffRows.map((row, index) => (
                  <tr
                    key={row.name}
                    className="border-t border-[#edf2f7] bg-white/80 transition hover:bg-white"
                  >
                    <td className="px-4 py-3 align-top">
                      <p className="text-sm text-[#475569]">{row.name}</p>
                    </td>
                    <td className="px-4 py-3 align-top text-center text-sm text-[#475569]">
                      {row.stampsGiven}
                    </td>
                    <td className="px-4 py-3 align-top text-center text-sm text-[#475569]">
                      {row.pointsGiven.toFixed(2)}
                    </td>
                    <td className="px-4 py-3 align-top text-center">
                      <button
                        type="button"
                        onClick={() => {
                          setEditingStaffIndex(index);
                          setEditName(row.name);
                          setEditPassword('');
                        }}
                        className="text-[11px] font-semibold text-[#05668D] underline-offset-2 hover:underline cursor-pointer"
                      >
                        editar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {editingStaffIndex !== null && (
        <AdminStaffEditModal
          name={editName}
          password={editPassword}
          onNameChange={setEditName}
          onPasswordChange={setEditPassword}
          onSave={() => setEditingStaffIndex(null)}
          onDelete={() => setEditingStaffIndex(null)}
          onClose={() => setEditingStaffIndex(null)}
        />
      )}
    </section>
  );
}
