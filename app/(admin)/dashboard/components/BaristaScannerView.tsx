'use client';

import { Camera, Loader2, CheckCircle2, XCircle, RefreshCw, LogOut, BadgeCheck, Scan } from 'lucide-react';
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
    startScanner, stopScanner, setScanResult,
  } = useBaristaScanner();

  return (
    <div className="relative flex min-h-screen w-full flex-col bg-[#f7f8fa] font-sans text-[#0f172a]">
      <div
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          background: '#ffffff',
          backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(0, 0, 0, 0.28) 1px, transparent 0)',
          backgroundSize: '20px 20px',
        }}
      />
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
        <div className="absolute -left-1/4 -top-1/2 h-130 w-130 rounded-full bg-[#d8e6df] blur-[130px]" />
        <div className="absolute -bottom-1/2 -right-1/4 h-110 w-110 rounded-full bg-[#e6ece9] blur-[120px]" />
      </div>

      <header className="relative z-10 mx-auto flex w-full max-w-3xl items-center justify-between px-4 pt-4 pb-3 sm:px-6 sm:pt-6">
        <div className="flex items-center gap-1 text-xl font-bold tracking-tight text-[#0f172a]">
          Perk<BadgeCheck size={22} strokeWidth={3} className="-ml-px" />
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#64748b]">Estación de Caja</p>
            <p className="text-sm font-semibold text-[#0f172a]">{baristaName}</p>
          </div>
          <button
            onClick={logout}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[#dbe4ec] bg-white text-[#64748b] transition hover:border-red-200 hover:bg-red-50 hover:text-red-500"
            title="Cerrar sesión"
          >
            <LogOut size={15} />
          </button>
        </div>
      </header>

      <main className="relative z-10 mx-auto flex w-full max-w-3xl flex-1 flex-col px-4 pb-4 sm:px-6 sm:pb-6 min-h-0">
        <div className="mb-3 flex items-center gap-3 rounded-2xl border border-[#dbe4ec] bg-white px-4 py-3 shadow-sm sm:px-5 sm:py-3.5">
          <div className="flex-1">
            <div className="relative">
              <div className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-bold text-[#64748b]">$</div>
              <input
                type="number"
                inputMode="decimal"
                value={amount}
                disabled={cameraActive || loading}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                className="h-10 w-full rounded-xl border border-[#dbe4ec] bg-[#f8fbfd] pl-8 pr-4 text-sm font-semibold text-[#0f172a] outline-none transition focus:border-[#05668D] focus:bg-white focus:ring-2 focus:ring-[#05668D]/20 disabled:opacity-50"
              />
            </div>
          </div>
          <button
            type="button"
            onClick={cameraActive ? stopScanner : startScanner}
            disabled={loading}
            className="flex h-10 shrink-0 items-center gap-2 rounded-full bg-[#05668D] px-5 text-xs font-bold uppercase tracking-wider text-white shadow-sm transition hover:bg-[#045676] active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {cameraActive ? (
              <>Cancelar</>
            ) : (
              <><Scan size={14} /> Escanear</>
            )}
          </button>
        </div>

        <style>{`
          #${qrRegionId} { height: 100% !important; width: 100% !important; }
          #${qrRegionId} > div { height: 100% !important; }
          #${qrRegionId} video {
            object-fit: cover !important;
            width: 100% !important;
            height: 100% !important;
          }
        `}</style>
        <div className={`relative min-h-[50vh] flex-1 overflow-hidden rounded-[2rem] border border-[#dbe4ec] shadow-sm ${cameraActive ? 'bg-black' : 'bg-white'}`}>
          <div
            id={qrRegionId}
            className={`absolute inset-0 ${cameraActive ? '' : 'hidden'}`}
          />

          {!cameraActive && !loading && !scanResult && (
            <div className="flex h-full w-full flex-col items-center justify-center p-8">
              <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full border-2 border-dashed border-[#dbe4ec] bg-[#f8fbfd] text-[#94a3b8]">
                <Camera size={36} />
              </div>
              <h3 className="mb-2 text-xl font-semibold text-[#0f172a]">Lector de tarjetas</h3>
              <p className="mb-8 max-w-sm text-center text-sm leading-relaxed text-[#475569]">
                Presiona <strong className="text-[#05668D]">Escanear</strong> para activar la cámara y leer el código QR del cliente.
              </p>
              <button
                type="button"
                onClick={startScanner}
                className="inline-flex h-12 items-center gap-2 rounded-full bg-[#0f172a] px-8 text-sm font-bold uppercase tracking-wider text-white shadow-sm transition hover:bg-[#1e293b] active:scale-[0.97]"
              >
                <Camera size={16} />
                Encender Cámara
              </button>
            </div>
          )}

          {cameraActive && (
            <div className="pointer-events-none absolute left-0 right-0 top-[40%] h-0.5 bg-red-500 shadow-[0_0_12px_2px_rgba(239,68,68,0.8)] animate-pulse" />
          )}

          {loading && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-white/90 backdrop-blur-sm">
              <Loader2 size={32} className="animate-spin text-[#05668D]" />
              <p className="text-xs font-bold uppercase tracking-widest text-[#64748b]">Procesando...</p>
            </div>
          )}

          {scanResult && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-white p-8">
              {scanResult.success ? (
                <>
                  <div className="mb-4 text-emerald-500">
                    <CheckCircle2 size={64} strokeWidth={1.5} />
                  </div>
                  <h3 className="mb-1 text-xl font-black uppercase tracking-tight text-emerald-700">
                    {scanResult.movement}
                  </h3>
                  <p className="mb-1 text-base font-semibold text-[#0f172a]">{scanResult.buyerName}</p>
                  <p className="mb-6 max-w-xs text-center text-sm leading-relaxed text-[#475569]">
                    {scanResult.message}
                  </p>
                </>
              ) : (
                <>
                  <div className="mb-4 text-red-500">
                    <XCircle size={64} strokeWidth={1.5} />
                  </div>
                  <h3 className="mb-3 text-base font-bold text-[#0f172a]">Transacción Fallida</h3>
                  <p className="mb-6 max-w-xs rounded-xl border border-red-100 bg-red-50 p-3 text-center text-xs font-semibold leading-relaxed text-red-600">
                    {scanResult.error}
                  </p>
                </>
              )}

              <button
                type="button"
                onClick={() => { setScanResult(null); startScanner(); }}
                className="inline-flex h-10 items-center gap-2 rounded-full bg-[#0f172a] px-5 text-xs font-bold uppercase tracking-wider text-white transition hover:bg-[#1e293b] active:scale-[0.97]"
              >
                <RefreshCw size={13} />
                Siguiente Cliente
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
