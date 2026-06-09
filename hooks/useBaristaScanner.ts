import { useEffect, useState, useRef, useCallback } from 'react';
import type { Html5Qrcode as Html5QrcodeType } from 'html5-qrcode';
import { processCustomerScanAction } from '@/app/actions/scan';

export type ScanResultData = {
  success: boolean;
  buyerName?: string;
  movement?: string;
  message?: string;
  error?: string;
};

let Html5QrcodeClass: typeof Html5QrcodeType | null = null;

async function getHtml5Qrcode(): Promise<typeof Html5QrcodeType> {
  if (!Html5QrcodeClass) {
    const mod = await import('html5-qrcode');
    Html5QrcodeClass = mod.Html5Qrcode;
  }
  return Html5QrcodeClass!;
}

export function useBaristaScanner() {
  const [amount, setAmount] = useState<string>('1');
  const [description, setDescription] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [cameraActive, setCameraActive] = useState(false);
  const [scanResult, setScanResult] = useState<ScanResultData | null>(null);

  const qrRegionId = 'html5-qrcode-viewfinder';
  const html5QrcodeRef = useRef<Html5QrcodeType | null>(null);

  const stopScanner = useCallback(async () => {
    if (html5QrcodeRef.current && html5QrcodeRef.current.isScanning) {
      try {
        await html5QrcodeRef.current.stop();
      } catch (err) {
        console.error('Error al apagar el escáner:', err);
      }
    }
    setCameraActive(false);
  }, []);

  const handleQrDecoded = useCallback(async (rawCardCode: string) => {
    await stopScanner();
    setLoading(true);

    const numericAmount = Number.parseFloat(amount) || 1;
    const res = await processCustomerScanAction(rawCardCode, numericAmount, description || undefined);

    setLoading(false);

    if (res.success && res.data) {
      setScanResult({
        success: true,
        buyerName: res.data.buyerName,
        movement: res.data.movement,
        message: res.message,
      });
    } else {
      setScanResult({
        success: false,
        error: res.error || 'Ocurrió un error desconocido al procesar el beneficio.',
      });
    }

    setDescription('');
  }, [amount, description, stopScanner]);

  const startScanner = useCallback(async () => {
    try {
      setScanResult(null);
      if (!html5QrcodeRef.current) {
        const Html5Qrcode = await getHtml5Qrcode();
        html5QrcodeRef.current = new Html5Qrcode(qrRegionId);
      }

      setCameraActive(true);

      await html5QrcodeRef.current.start(
        { facingMode: 'environment' },
        {
          fps: 10,
          qrbox: (width, height) => {
            const size = Math.min(width, height) * 0.75;
            return { width: size, height: size };
          },
        },
        async (decodedText) => {
          await handleQrDecoded(decodedText);
        },
        () => {},
      );
    } catch (err) {
      console.error('Error al encender la cámara:', err);
      setCameraActive(false);
      alert('No se pudo acceder a la cámara. Asegúrate de dar los permisos en el navegador.');
    }
  }, [handleQrDecoded]);

  useEffect(() => {
    return () => {
      if (html5QrcodeRef.current && html5QrcodeRef.current.isScanning) {
        html5QrcodeRef.current.stop().catch(console.error);
      }
    };
  }, []);

  return {
    amount,
    setAmount,
    description,
    setDescription,
    loading,
    cameraActive,
    scanResult,
    qrRegionId,
    startScanner,
    stopScanner,
    setScanResult,
  };
}