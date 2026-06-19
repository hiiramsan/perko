'use client';

import { UserPen } from 'lucide-react';

type AdminStaffEditModalProps = {
  name: string;
  password: string;
  onNameChange: (val: string) => void;
  onPasswordChange: (val: string) => void;
  onSave: () => void;
  onDelete: () => void;
  onClose: () => void;
};

export function AdminStaffEditModal({
  name,
  password,
  onNameChange,
  onPasswordChange,
  onSave,
  onDelete,
  onClose,
}: AdminStaffEditModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm">
      <div className="relative w-full max-w-sm border border-slate-200 bg-white p-5 rounded-2xl shadow-sm">
        <button
          type="button"
          onClick={onClose}
          className="absolute -right-2 -top-2 z-10 flex h-7 w-7 items-center justify-center rounded-full border border-slate-200 bg-white text-xs font-bold text-slate-500 shadow-sm hover:bg-slate-100 cursor-pointer"
        >
          ✕
        </button>
        <div className="flex items-center gap-2 mb-4">
          <UserPen size={16} className="text-[#05668D]" />
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-700">Editar Barista</h3>
        </div>
        <form className="space-y-3.5">
          <div>
            <label className="text-[11px] font-bold text-slate-500 uppercase">Nombre Completo</label>
            <input
              type="text"
              value={name}
              onChange={(e) => onNameChange(e.target.value)}
              className="mt-1 h-9 w-full rounded-lg border border-slate-200 px-3 text-xs outline-none focus:border-slate-950 transition"
            />
          </div>
          <div>
            <label className="text-[11px] font-bold text-slate-500 uppercase">Nueva Contraseña</label>
            <input
              type="text"
              value={password}
              onChange={(e) => onPasswordChange(e.target.value)}
              placeholder="Dejar vacío para no cambiar"
              className="mt-1 h-9 w-full rounded-lg border border-slate-200 px-3 text-xs font-mono outline-none focus:border-slate-950 transition"
            />
          </div>
          <button
            type="submit"
            onClick={(e) => { e.preventDefault(); onSave(); }}
            className="h-9 w-full rounded-lg bg-slate-950 text-xs font-bold text-white hover:bg-slate-800 transition cursor-pointer"
          >
            Guardar cambios
          </button>
          <button
            type="button"
            onClick={onDelete}
            className="h-9 w-full rounded-lg bg-red-50 text-xs font-bold text-red-600 hover:bg-red-100 transition cursor-pointer border border-red-200"
          >
            Eliminar cuenta
          </button>
        </form>
      </div>
    </div>
  );
}
