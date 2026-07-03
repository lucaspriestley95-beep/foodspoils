import { useEffect, useRef, useState } from 'react';
import { Html5Qrcode, Html5QrcodeSupportedFormats } from 'html5-qrcode';

interface BarcodeScannerProps {
  onScan: (barcode: string) => void;
  onClose: () => void;
}

export function BarcodeScanner({ onScan, onClose }: BarcodeScannerProps) {
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    const startScanner = async () => {
      try {
        const html5QrCode = new Html5Qrcode("barcode-reader");
        scannerRef.current = html5QrCode;

        const config = {
          fps: 10,
          qrbox: { width: 280, height: 180 },
          formatsToSupport: [ 
            Html5QrcodeSupportedFormats.EAN_13, 
            Html5QrcodeSupportedFormats.EAN_8, 
            Html5QrcodeSupportedFormats.UPC_A, 
            Html5QrcodeSupportedFormats.UPC_E 
          ]
        };

        await html5QrCode.start(
          { facingMode: "environment" },
          config,
          (decodedText) => {
            onScan(decodedText);
            // The caller is responsible for closing/unmounting, 
            // but we stop scanning here to prevent multiple triggers.
            if (scannerRef.current && scannerRef.current.isScanning) {
              scannerRef.current.stop().catch(console.error);
            }
          },
          () => {
            // Ignore scan errors (just "no barcode in frame")
          }
        );
        setIsInitializing(false);
      } catch (err) {
        console.error("Failed to start scanner:", err);
        setError("Could not access camera. Please ensure you have given permission.");
        setIsInitializing(false);
      }
    };

    // Short delay to allow modal animation if any
    const timer = setTimeout(startScanner, 300);

    return () => {
      clearTimeout(timer);
      if (scannerRef.current && scannerRef.current.isScanning) {
        scannerRef.current.stop().catch(err => console.error("Error stopping scanner", err));
      }
    };
  }, [onScan]);

  return (
    <div className="fixed inset-0 z-[60] flex flex-col items-center justify-center bg-black">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 p-5 flex justify-between items-center bg-black/60 backdrop-blur-md z-20">
        <div className="flex flex-col">
          <h3 className="text-white font-bold text-lg">Scan Product Barcode</h3>
          <p className="text-white/60 text-xs">Point at the barcode on packaging</p>
        </div>
        <button 
          onClick={onClose}
          className="p-2.5 bg-gray-800/10 text-white hover:bg-gray-800/20 rounded-full transition-colors"
          aria-label="Close scanner"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Scanner Container */}
      <div className="relative w-full max-w-md aspect-[3/4] overflow-hidden bg-gray-900 shadow-2xl ring-1 ring-white/10">
        <div id="barcode-reader" className="w-full h-full"></div>
        
        {isInitializing && !error && (
          <div className="absolute inset-0 flex items-center justify-center text-white/50 animate-pulse">
            <div className="flex flex-col items-center gap-3">
              <svg className="w-8 h-8 animate-spin" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>Starting camera...</span>
            </div>
          </div>
        )}

        {/* Scan Frame UI Overlay */}
        {!isInitializing && !error && (
          <div className="absolute inset-0 pointer-events-none border-[40px] border-black/40">
            <div className="w-full h-full relative">
              {/* Corner markers */}
              <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-fresh-500 rounded-tl-lg"></div>
              <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-fresh-500 rounded-tr-lg"></div>
              <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-fresh-500 rounded-bl-lg"></div>
              <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-fresh-500 rounded-br-lg"></div>
              
              {/* Animated laser line */}
              <div className="absolute top-1/2 left-4 right-4 h-0.5 bg-fresh-500/50 shadow-[0_0_8px_rgba(34,197,94,0.8)] animate-scan-line"></div>
            </div>
          </div>
        )}
      </div>

      {error && (
        <div className="mx-6 mt-6 p-4 bg-red-500/10 border border-red-500/50 rounded-xl text-red-200 text-center space-y-3">
          <p className="text-sm font-medium">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white text-xs font-bold rounded-lg transition-colors"
          >
            Retry / Refresh
          </button>
        </div>
      )}

      {/* Footer */}
      <div className="mt-8 text-center px-8 space-y-2">
        <p className="text-white/40 text-xs font-medium uppercase tracking-widest">Open Food Facts</p>
        <p className="text-white/60 text-sm italic">"Real-time food data for fresher homes"</p>
      </div>
      
      <style>{`
        @keyframes scan-line {
          0%, 100% { transform: translateY(-40px); }
          50% { transform: translateY(40px); }
        }
        .animate-scan-line {
          animation: scan-line 3s ease-in-out infinite;
        }
        #barcode-reader video {
          object-fit: cover !important;
          width: 100% !important;
          height: 100% !important;
        }
      `}</style>
    </div>
  );
}
