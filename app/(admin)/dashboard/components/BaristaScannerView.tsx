'use client';

import { Camera, Loader2, CheckCircle2, XCircle, RefreshCw, LogOut } from 'lucide-react';
import { useAuth } from '@/app/context/AuthContext';
import { useBaristaScanner } from '@/hooks/useBaristaScanner';

type BaristaScannerViewProps = {
  businessId: number;
  baristaName: string;
};

export function BaristaScannerView({ businessId, baristaName }: BaristaScannerViewProps) {
  const { logout } = useAuth();
  const {
    amount, setAmount,
    loading, cameraActive, scanResult,
    qrRegionId,
    startScanner, stopScanner,
  } = useBaristaScanner();

  return (
    <div className="min-h-screen w-full bg-[#f8fafc] font-sans text-[#0f172a] p-4 md:p-8 flex flex-col items-center">
      
      {/* TOP BAR: Info del Barista */}
      <header className="w-full max-w-md bg-white border border-[#e2e8f0] rounded-2xl p-4 flex items-center justify-between shadow-sm mb-6">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-slate-400">Estación de Caja</span>
          <h2 className="text-sm font-black text-slate-800 uppercase mt-0.5">☕ {baristaName}</h2>
        </div>
        <button 
          onClick={logout} 
          className="p-2.5 rounded-full bg-red-50 text-red-500 hover:bg-red-100 transition duration-200 cursor-pointer"
          title="Cerrar sesión de caja"
        >
          <LogOut size={16} />
        </button>
      </header>

      {/* FORMULARIO: Valores de la Transacción */}
      <main className="w-full max-w-md space-y-5">
        
        <div className="bg-white border border-[#e2e8f0] rounded-[1.75rem] p-5 shadow-sm space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">Datos del consumo</h3>
          
          {/* Input del Monto de Compra */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700">Monto del Ticket o Cantidad</label>
            <div className="relative">
              <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">$</div>
              <input
                type="number"
                inputMode="decimal"
                value={amount}
                disabled={cameraActive || loading}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Ej: 150.00 o 1"
                className="h-11 w-full rounded-xl border border-[#cbd5e1] bg-[#f8fafc] pl-8 pr-4 text-sm font-semibold outline-none focus:border-[#0f172a] focus:bg-white transition disabled:opacity-60"
              />
            </div>
            <p className="text-[10px] font-medium text-slate-400 leading-tight">
              * Para <strong>Timbres</strong> introduce 1. Para <strong>Monedero</strong> introduce el total de la cuenta.
            </p>
          </div>
        </div>

        {/* VISOR: Contenedor de la cámara */}
        <div className="bg-white border border-[#e2e8f0] rounded-[2rem] p-4 shadow-sm flex flex-col items-center justify-center min-h-[320px] relative overflow-hidden">
          
          {/* Región donde html5-qrcode inyecta el video tag de forma nativa */}
          <div 
            id={qrRegionId} 
            className={`w-full aspect-square max-w-[280px] rounded-2xl overflow-hidden transition-all duration-300 ${cameraActive ? 'block' : 'hidden'}`}
          />

          {/* Pantalla de Reposo (Antes de encender la cámara) */}
          {!cameraActive && !loading && !scanResult && (
            <div className="flex flex-col items-center text-center p-6 space-y-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-50 text-slate-400 border border-dashed border-slate-200">
                <Camera size={26} />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-800">Lector de tarjetas listo</h4>
                <p className="text-xs text-slate-400 mt-1 max-w-[220px]">Coloca el monto arriba y enciende la cámara para escanear el QR del cliente.</p>
              </div>
              <button
                type="button"
                onClick={startScanner}
                className="inline-flex h-11 items-center justify-center rounded-xl bg-[#0f172a] px-6 text-xs font-bold uppercase tracking-wider text-white shadow-md hover:bg-slate-800 transition active:scale-95 cursor-pointer"
              >
                Encender Cámara
              </button>
            </div>
          )}

          {/* Efecto láser animado mientras escanea */}
          {cameraActive && (
            <div className="absolute top-[40%] left-0 right-0 h-0.5 bg-red-500 shadow-[0_0_12px_2px_rgba(239,68,68,0.8)] animate-bounce pointer-events-none" />
          )}

          {/* Estado de carga procesando el beneficio */}
          {loading && (
            <div className="absolute inset-0 bg-white/90 backdrop-blur-sm flex flex-col items-center justify-center space-y-3">
              <Loader2 className="h-8 w-8 animate-spin text-[#05668D]" />
              <p className="text-xs font-bold uppercase tracking-widest text-slate-500">Asentando puntos...</p>
            </div>
          )}

          {/* MODAL DE RESULTADO INTERNO */}
          {scanResult && (
            <div className="absolute inset-0 bg-white p-6 flex flex-col items-center justify-center text-center space-y-4 animate-fade-in">
              {scanResult.success ? (
                <>
                  <div className="text-emerald-500"><CheckCircle2 size={56} strokeWidth={1.5} /></div>
                  <div>
                    <h3 className="text-base font-black uppercase text-emerald-600 tracking-tight">{scanResult.movement}</h3>
                    <p className="text-sm font-bold text-slate-800 mt-1">{scanResult.buyerName}</p>
                    <p className="text-xs text-slate-400 mt-1 max-w-[220px] leading-relaxed">{scanResult.message}</p>
                  </div>
                </>
              ) : (
                <>
                  <div className="text-red-500"><XCircle size={56} strokeWidth={1.5} /></div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-800">Transacción Fallida</h3>
                    <p className="text-xs text-red-500 font-semibold mt-1.5 max-w-[240px] leading-relaxed bg-red-50 border border-red-100 p-2 rounded-xl">
                      {scanResult.error}
                    </p>
                  </div>
                </>
              )}

              <button
                type="button"
                onClick={startScanner}
                className="mt-2 inline-flex h-10 items-center gap-2 rounded-xl bg-slate-100 px-5 text-xs font-bold text-slate-600 hover:bg-slate-200 transition cursor-pointer"
              >
                <RefreshCw size={12} />
                <span>Siguiente Cliente</span>
              </button>
            </div>
          )}
        </div>
        
        {/* Botón para cancelar el escaneo en vivo */}
        {cameraActive && (
          <button
            type="button"
            onClick={stopScanner}
            className="w-full text-center text-xs font-bold uppercase tracking-wider text-slate-400 hover:text-slate-600 transition cursor-pointer"
          >
            Cancelar Escaneo
          </button>
        )}
      </main>
    </div>
  );
}