import { useState } from 'react';

export function ReferralSection() {
  const [copied, setCopied] = useState(false);
  
  const shareData = {
    title: 'FoodSpoils',
    text: 'Stop throwing away food! Track expiry dates with FoodSpoils 🥬',
    url: 'https://88476682d9d0ed97846165675f29d710.ctonew.app',
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.log('Error sharing:', err);
      }
    } else {
      // Fallback: Copy to clipboard
      try {
        await navigator.clipboard.writeText(`${shareData.text} ${shareData.url}`);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error('Failed to copy: ', err);
      }
    }
  };

  return (
    <div className="mx-4 mb-4 rounded-md border border-fresh-900/50 bg-gray-800 p-4 shadow-sm space-y-3">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-fresh-950/30 text-xl" aria-hidden="true">
          📢
        </div>
        <div>
          <h3 className="text-sm font-bold text-gray-100">Invite Friends</h3>
          <p className="text-xs text-gray-400">Help others reduce food waste!</p>
        </div>
      </div>
      
      <p className="text-xs text-gray-300 leading-relaxed">
        Share FoodSpoils with your friends and family. Every item saved is money kept in your pocket!
      </p>

      <button
        onClick={handleShare}
        className={`w-full flex items-center justify-center gap-2 rounded-sm py-2.5 text-xs font-bold transition-all ${
          copied 
            ? 'bg-fresh-100 text-fresh-400 border border-fresh-200' 
            : 'bg-fresh-500 text-white hover:bg-fresh-600 shadow-sm'
        }`}
      >
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          {copied ? (
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          ) : (
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
          )}
        </svg>
        {copied ? 'Link Copied!' : 'Share FoodSpoils'}
      </button>
      
      <div className="pt-1 text-center">
        <span className="text-[10px] text-gray-400 font-medium">Use code: <span className="text-gray-300 font-bold">FRESH2026</span></span>
      </div>
    </div>
  );
}
