import { useState } from 'react';

interface ShareStatsSectionProps {
  activeItems: any[];
  historyItems: any[];
}

export function ShareStatsSection({ activeItems, historyItems }: ShareStatsSectionProps) {
  const [sharing, setSharing] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Dynamic calculations
  const totalWasted = historyItems.filter(i => i.status === 'wasted').length;
  const totalConsumed = historyItems.filter(i => i.status === 'consumed').length;
  const totalClosed = historyItems.length;
  const wasteRate = totalClosed > 0 ? Math.round((totalWasted / totalClosed) * 100) : 0;

  // 1. Saved weight calculation (e.g., average 1.5 lbs per item saved)
  const lbsSavedNum = totalConsumed > 0 ? totalConsumed * 1.5 : 12.0;
  const lbsSaved = lbsSavedNum.toFixed(1);

  // 2. Streak calculation (consecutive or unique days of activity, default fallback 5 days)
  const calculateStreak = () => {
    if (historyItems.length === 0) return 5;
    const uniqueDays = new Set(
      historyItems.map(item => new Date(item.createdAt || Date.now()).toDateString())
    );
    return Math.max(3, uniqueDays.size);
  };
  const streak = calculateStreak();

  // 3. Achievement calculation
  const getBestAchievement = () => {
    if (totalConsumed >= 10 && wasteRate <= 20) {
      return { name: 'Zero Waste Hero', icon: '🏆', desc: 'Eaten 10+ items with low waste' };
    }
    if (activeItems.length + totalConsumed >= 15) {
      return { name: 'Pantry Pro', icon: '🏆', desc: 'Tracked 15+ items total' };
    }
    if (activeItems.length >= 8) {
      return { name: 'Stocked Up', icon: '🏆', desc: 'Keeping a fully stocked pantry' };
    }
    return { name: 'Pantry Pro', icon: '🏆', desc: 'Reducing waste like a pro' };
  };
  const achievement = getBestAchievement();

  const handleShareStats = async () => {
    setSharing(true);
    setMessage(null);

    try {
      // 1. Create a canvas
      const canvas = document.createElement('canvas');
      canvas.width = 1200;
      canvas.height = 630;
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('Could not get canvas context');

      // 2. Background Gradient
      const bgGrad = ctx.createLinearGradient(0, 0, 1200, 630);
      bgGrad.addColorStop(0, '#041d0c'); // Very deep forest green
      bgGrad.addColorStop(1, '#0e131f'); // Deep slate charcoal
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, 1200, 630);

      // 3. Subtle Grid Lines (Modern tech dashboard look)
      ctx.strokeStyle = 'rgba(34, 197, 94, 0.04)';
      ctx.lineWidth = 1;
      for (let i = 40; i < 1200; i += 40) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i, 630);
        ctx.stroke();
      }
      for (let j = 40; j < 630; j += 40) {
        ctx.beginPath();
        ctx.moveTo(0, j);
        ctx.lineTo(1200, j);
        ctx.stroke();
      }

      // 4. Glowing Background Orbs
      // Top right glowing green orb
      const orbGreen = ctx.createRadialGradient(1000, 100, 50, 1000, 100, 350);
      orbGreen.addColorStop(0, 'rgba(34, 197, 94, 0.18)');
      orbGreen.addColorStop(1, 'rgba(34, 197, 94, 0)');
      ctx.fillStyle = orbGreen;
      ctx.fillRect(0, 0, 1200, 630);

      // Bottom left glowing coral orb
      const orbCoral = ctx.createRadialGradient(200, 530, 50, 200, 530, 300);
      orbCoral.addColorStop(0, 'rgba(255, 107, 53, 0.12)');
      orbCoral.addColorStop(1, 'rgba(255, 107, 53, 0)');
      ctx.fillStyle = orbCoral;
      ctx.fillRect(0, 0, 1200, 630);

      // 5. Card Border Frame (Double-ring layout for elegance)
      ctx.strokeStyle = 'rgba(34, 197, 94, 0.35)';
      ctx.lineWidth = 8;
      ctx.strokeRect(15, 15, 1170, 600);

      ctx.strokeStyle = 'rgba(34, 197, 94, 0.15)';
      ctx.lineWidth = 2;
      ctx.strokeRect(27, 27, 1146, 576);

      // 6. Draw Brand Logo/Header
      // Leaf emoji as logo icon
      ctx.font = '64px Inter, system-ui, -apple-system, sans-serif';
      ctx.textAlign = 'left';
      ctx.textBaseline = 'middle';
      ctx.fillText('🥬', 75, 95);

      // App Title
      ctx.font = 'bold 50px Inter, system-ui, -apple-system, sans-serif';
      ctx.fillStyle = '#ffffff';
      ctx.fillText('FoodSpoils', 150, 95);

      // Accent Dot in Coral
      const titleWidth = ctx.measureText('FoodSpoils').width;
      ctx.fillStyle = '#FF6B35'; // Coral brand accent
      ctx.fillText('.', 150 + titleWidth, 95);

      // Slogan
      ctx.font = '500 20px Inter, system-ui, -apple-system, sans-serif';
      ctx.fillStyle = '#a8e6b6'; // Light fresh green
      ctx.fillText('Track Freshness · Save Money · Reduce Waste', 150, 145);

      // Helper function to draw rounded rectangles
      const drawRoundedRect = (
        x: number,
        y: number,
        w: number,
        h: number,
        r: number,
        fill: string,
        stroke?: string,
        strokeW?: number
      ) => {
        ctx.beginPath();
        ctx.moveTo(x + r, y);
        ctx.lineTo(x + w - r, y);
        ctx.quadraticCurveTo(x + w, y, x + w, y + r);
        ctx.lineTo(x + w, y + h - r);
        ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
        ctx.lineTo(x + r, y + h);
        ctx.quadraticCurveTo(x, y + h, x, y + h - r);
        ctx.lineTo(x, y + r);
        ctx.quadraticCurveTo(x, y, x + r, y);
        ctx.closePath();
        if (fill) {
          ctx.fillStyle = fill;
          ctx.fill();
        }
        if (stroke && strokeW) {
          ctx.strokeStyle = stroke;
          ctx.lineWidth = strokeW;
          ctx.stroke();
        }
      };

      // 7. Render 3 Stats Cards
      const cardWidth = 320;
      const cardHeight = 280;
      const cardY = 210;
      const gap = 40;
      const startX = (1200 - (3 * cardWidth + 2 * gap)) / 2; // 80px

      // Stats Configuration
      const stats = [
        {
          emoji: '🥬',
          value: `${lbsSaved} lbs`,
          label: 'Food Saved',
          subtitle: 'Kept fresh & consumed',
          color: '#ffffff',
        },
        {
          emoji: '🔥',
          value: `${streak}-Day`,
          label: 'Saving Streak',
          subtitle: 'Building a green habit',
          color: '#FF6B35', // Highlight streak with Coral
        },
        {
          emoji: achievement.icon,
          value: achievement.name,
          label: 'Achievement Unlocked',
          subtitle: achievement.desc,
          color: '#ffffff',
        },
      ];

      stats.forEach((stat, idx) => {
        const x = startX + idx * (cardWidth + gap);

        // Draw Card Background
        drawRoundedRect(
          x,
          cardY,
          cardWidth,
          cardHeight,
          20,
          'rgba(31, 41, 55, 0.7)', // Sleek semitransparent gray-800
          'rgba(34, 197, 94, 0.25)', // Subtle green border
          1.5
        );

        // Card Top Glow Accent Line
        ctx.strokeStyle = idx === 1 ? '#FF6B35' : '#22C55E';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(x + 30, cardY);
        ctx.lineTo(x + cardWidth - 30, cardY);
        ctx.stroke();

        // 1. Emoji Icon
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.font = '54px Inter, system-ui, -apple-system, sans-serif';
        ctx.fillText(stat.emoji, x + cardWidth / 2, cardY + 65);

        // 2. Stat Big Number / Value
        ctx.font = stat.value.length > 12 
          ? 'bold 28px Inter, system-ui, -apple-system, sans-serif'
          : 'bold 38px Inter, system-ui, -apple-system, sans-serif';
        ctx.fillStyle = stat.color;
        ctx.fillText(stat.value, x + cardWidth / 2, cardY + 135);

        // 3. Label
        ctx.font = 'bold 16px Inter, system-ui, -apple-system, sans-serif';
        ctx.fillStyle = '#4ade80'; // fresh-400
        ctx.fillText(stat.label, x + cardWidth / 2, cardY + 195);

        // 4. Subtitle Description
        ctx.font = '13px Inter, system-ui, -apple-system, sans-serif';
        ctx.fillStyle = '#9ca3af'; // gray-400
        ctx.fillText(stat.subtitle, x + cardWidth / 2, cardY + 235);
      });

      // 8. Draw Footer Info
      ctx.textAlign = 'left';
      ctx.textBaseline = 'middle';
      ctx.font = 'bold 18px Inter, system-ui, -apple-system, sans-serif';
      ctx.fillStyle = '#a8e6b6'; // Light fresh green
      ctx.fillText('Join the movement to stop food waste!', 75, 550);

      ctx.textAlign = 'right';
      ctx.font = 'bold 18px Inter, system-ui, -apple-system, sans-serif';
      ctx.fillStyle = '#ffffff';
      ctx.fillText('foodspoils.app', 1125, 550);

      // 9. Convert Canvas to Blob & Share/Download
      const blob = await new Promise<Blob | null>(resolve => canvas.toBlob(resolve, 'image/png'));
      if (!blob) throw new Error('Could not generate image blob');

      const file = new File([blob], 'foodspoils-accomplishments.png', { type: 'image/png' });

      // Check for navigator.share file support
      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: 'My FoodSpoils Accomplishments',
          text: `Check out my food-saving progress! Saved ${lbsSaved} lbs of food, hit a ${streak}-day reduction streak, and unlocked ${achievement.name}! 🥬🔥🏆`,
        });
        setMessage({ type: 'success', text: 'Accomplishments shared successfully!' });
      } else {
        // Desktop / Unsupported Fallback: Trigger Download
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'foodspoils-stats.png';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        setMessage({ type: 'success', text: 'Stats card downloaded successfully!' });
      }

      // Clear message after 4 seconds
      setTimeout(() => setMessage(null), 4000);
    } catch (err: any) {
      console.error('Error sharing accomplishments:', err);
      setMessage({ type: 'error', text: err.message || 'Failed to share stats card.' });
    } finally {
      setSharing(false);
    }
  };

  return (
    <div className="mx-4 mb-4 rounded-md border border-gray-700 bg-gray-800 p-4 shadow-sm space-y-4 animate-fade-in">
      <div className="flex items-center gap-2">
        <span className="text-lg">✨</span>
        <h3 className="text-sm font-semibold text-gray-100">My Food-Saving Impact</h3>
      </div>

      {/* Grid preview of the stats inside the app */}
      <div className="grid grid-cols-3 gap-2">
        <div className="rounded border border-gray-700/50 bg-gray-900/40 p-2.5 text-center flex flex-col justify-between min-h-[110px]">
          <span className="text-xl">🥬</span>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mt-1">Food Saved</p>
          <p className="text-sm font-extrabold text-white mt-0.5">{lbsSaved} lbs</p>
          <p className="text-[8px] text-gray-500 mt-1 truncate">Eaten & kept fresh</p>
        </div>

        <div className="rounded border border-gray-700/50 bg-gray-900/40 p-2.5 text-center flex flex-col justify-between min-h-[110px]">
          <span className="text-xl">🔥</span>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mt-1">Daily Streak</p>
          <p className="text-sm font-extrabold text-coral-500 mt-0.5">{streak} Days</p>
          <p className="text-[8px] text-gray-500 mt-1 truncate">Reducing waste</p>
        </div>

        <div className="rounded border border-gray-700/50 bg-gray-900/40 p-2.5 text-center flex flex-col justify-between min-h-[110px]">
          <span className="text-xl">{achievement.icon}</span>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mt-1">Achievement</p>
          <p className="text-sm font-extrabold text-white mt-0.5 truncate">{achievement.name}</p>
          <p className="text-[8px] text-gray-500 mt-1 truncate">{achievement.desc}</p>
        </div>
      </div>

      {message && (
        <div
          className={`text-xs p-2 rounded-sm border ${
            message.type === 'success'
              ? 'bg-green-950/30 text-green-400 border-green-900/50'
              : 'bg-red-950/30 text-red-400 border-red-900/50'
          }`}
        >
          {message.text}
        </div>
      )}

      <button
        onClick={handleShareStats}
        disabled={sharing}
        className="w-full flex items-center justify-center gap-2 rounded-sm bg-coral-500 hover:bg-coral-600 text-white font-bold py-2.5 text-xs transition-colors shadow-sm disabled:opacity-50 active:scale-95 transition-transform"
      >
        {sharing ? (
          <div className="flex items-center justify-center gap-2">
            <svg className="animate-spin h-3.5 w-3.5 text-white" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.062 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            Generating Share Card...
          </div>
        ) : (
          <>
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
              />
            </svg>
            Share My Accomplishments
          </>
        )}
      </button>
    </div>
  );
}
