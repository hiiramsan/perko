'use client';

import { useState } from 'react';
import { createStaffAction } from '@/app/actions/staff';
import { UserPlus, Loader2 } from 'lucide-react';

export function AdminAddStaffForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [statusMsg, setStatusMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password) return;

    setLoading(true);
    setStatusMsg(null);

    const res = await createStaffAction({ name, email, passwordConfirm: password });
    setLoading(false);

    if (res.success) {
      setStatusMsg({ type: 'success', text: res.message || '' });
      // Limpiamos los campos para el siguiente registro
      setName('');
      setEmail('');
      setPassword('');
    } else {
      setStatusMsg({ type: 'error', text: res.error || '' });
    }
  };

  return (
    <div className="w-full max-w-sm border border-slate-200 bg-white p-5 rounded-2xl shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <UserPlus size={16} className="text-[#05668D]" />
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-700">Dar de alta Barista</h3>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3.5">
        <div>
          <label className="text-[11px] font-bold text-slate-500 uppercase">Nombre Completo</label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ej: Carlos Mendoza"
            className="mt-1 h-9 w-full rounded-lg border border-slate-200 px-3 text-xs outline-none focus:border-slate-950 transition"
          />
        </div>

        <div>
          <label className="text-[11px] font-bold text-slate-500 uppercase">Correo de Trabajo</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="carlos@tu-cafeteria.com"
            className="mt-1 h-9 w-full rounded-lg border border-slate-200 px-3 text-xs outline-none focus:border-slate-950 transition"
          />
        </div>

        <div>
          <label className="text-[11px] font-bold text-slate-500 uppercase">Contraseña Inicial</label>
          <input
            type="text" // Usamos text para que el admin pueda ver qué contraseña genérica le está inventando a su empleado
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Ej: CafeGdl2026"
            className="mt-1 h-9 w-full rounded-lg border border-slate-200 px-3 text-xs font-mono outline-none focus:border-slate-950 transition"
          />
        </div>

        {statusMsg && (
          <div className={`p-2.5 rounded-xl text-xs font-semibold border ${
            statusMsg.type === 'success' 
              ? 'bg-emerald-50 border-emerald-100 text-emerald-600' 
              : 'bg-red-50 border-red-100 text-red-600'
          }`}>
            {statusMsg.text}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="h-9 w-full rounded-lg bg-slate-950 text-xs font-bold text-white hover:bg-slate-800 transition flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
        >
          {loading ? <Loader2 size={12} className="animate-spin" /> : 'Registrar Empleado'}
        </button>
      </form>
    </div>
  );
}