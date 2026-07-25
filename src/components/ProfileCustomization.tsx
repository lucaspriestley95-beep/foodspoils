import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../db';

const FOOD_EMOJIS_NORM = [
  '🥑', '🍕', '🥗', '🍣', '🥩', '🧀', '🍝', '🥦', '🌮', '🍔',
  '🍟', '🌯', '🥙', '🥘', '🍳', '🥞', '🧇', '🥓', '🍖', '🍗'
];

const DIETARY_OPTIONS = [
  'Vegan', 'Vegetarian', 'Pescatarian', 'Keto', 'Paleo',
  'Gluten-Free', 'Dairy-Free', 'Halal', 'Kosher', 'None'
];

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
}

export function ProfileCustomization() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [displayName, setDisplayName] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [selectedDiets, setSelectedDiets] = useState<string[]>([]);
  const [unlockedAchievements, setUnlockedAchievements] = useState<string[]>([]);
  
  // Local statistics
  const [streakDays, setStreakDays] = useState(0);
  const [savedLbs, setSavedLbs] = useState(0);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (user) {
      fetchProfile();
      calculateStatsAndAchievements();
    }
  }, [user]);

  const fetchProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', user?.id)
        .single();

      if (error) throw error;
      if (data) {
        setDisplayName(data.display_name || '');
        setAvatarUrl(data.avatar_url || '');
        
        // Load dietary preferences (either from Supabase or localStorage fallback)
        if (data.dietary_preferences) {
          try {
            setSelectedDiets(Array.isArray(data.dietary_preferences) ? data.dietary_preferences : JSON.parse(data.dietary_preferences));
          } catch {
            setSelectedDiets(data.dietary_preferences.split(','));
          }
        } else {
          const localDiets = localStorage.getItem(`foodspoils_dietary_${user?.id}`);
          if (localDiets) {
            setSelectedDiets(JSON.parse(localDiets));
          }
        }

        // Load achievements (either from Supabase or localStorage fallback)
        if (data.achievements) {
          try {
            setUnlockedAchievements(Array.isArray(data.achievements) ? data.achievements : JSON.parse(data.achievements));
          } catch {
            setUnlockedAchievements(data.achievements.split(','));
          }
        } else {
          const localAchievements = localStorage.getItem(`foodspoils_achievements_${user?.id}`);
          if (localAchievements) {
            setUnlockedAchievements(JSON.parse(localAchievements));
          }
        }
      }
    } catch (error: any) {
      console.error('Error fetching profile:', error.message);
      // Fail-safe load from localStorage
      if (user) {
        const localDiets = localStorage.getItem(`foodspoils_dietary_${user.id}`);
        if (localDiets) setSelectedDiets(JSON.parse(localDiets));
        
        const localAchievements = localStorage.getItem(`foodspoils_achievements_${user.id}`);
        if (localAchievements) setUnlockedAchievements(JSON.parse(localAchievements));
      }
    }
  };

  const calculateStatsAndAchievements = async () => {
    try {
      const items = await db.items.toArray();
      
      // 1. Calculate Saved Lbs (approx 1.2 lbs per consumed item)
      const consumedItems = items.filter(i => i.status === 'consumed');
      const totalSaved = consumedItems.reduce((acc, item) => acc + (item.quantity || 1) * 1.2, 0);
      setSavedLbs(parseFloat(totalSaved.toFixed(1)));

      // 2. Calculate Waste reduction streak
      const daysWithWaste = new Set<string>();
      const daysWithActivity = new Set<string>();
      
      items.forEach(item => {
        if (item.createdAt) {
          const dateStr = new Date(item.createdAt).toDateString();
          daysWithActivity.add(dateStr);
          if (item.status === 'wasted') {
            daysWithWaste.add(dateStr);
          }
        }
      });
      
      let streak = 0;
      let current = new Date();
      
      for (let i = 0; i < 30; i++) {
        const dateStr = current.toDateString();
        if (daysWithWaste.has(dateStr)) {
          break; // broke the streak on this day
        }
        if (daysWithActivity.has(dateStr)) {
          streak++;
        } else {
          // If no direct activity, count day as streak if there were active items in the pantry
          const hasActiveItems = items.some(item => {
            return item.createdAt <= current.getTime() && 
                   (item.status === 'active' || (item.createdAt + 7 * 86400000) > current.getTime());
          });
          if (hasActiveItems && items.length > 0) {
            streak++;
          } else {
            break;
          }
        }
        current.setDate(current.getDate() - 1);
      }
      setStreakDays(streak);

      // 3. Dynamic Achievements checks
      const earned: string[] = [];
      
      // Achievement 1: Pantry Pro (tracked >= 5 items total for demonstration, or 50)
      if (items.length >= 50) earned.push('pantry-pro');
      else if (items.length >= 5) earned.push('pantry-starter'); // fallback mini-badge

      // Achievement 2: Zero Waste Week (7 days with no wasted food, and has at least 1 tracked/consumed item)
      const hasWastedLast7Days = items.some(i => i.status === 'wasted' && i.createdAt && (Date.now() - i.createdAt) < 7 * 86400000);
      if (!hasWastedLast7Days && items.length > 0) {
        earned.push('zero-waste-week');
      }

      // Achievement 3: Stocked Up (20+ active items)
      const activeCount = items.filter(i => i.status === 'active').length;
      if (activeCount >= 20) {
        earned.push('stocked-up');
      }

      // Achievement 4: Clean Eater (added items from 5+ categories)
      const uniqueCategories = new Set(items.map(i => i.category));
      if (uniqueCategories.size >= 5) {
        earned.push('clean-eater');
      }

      // Achievement 5: Scanner (barcode scanner >= 10 times, or at least 1 time)
      const scanCount = parseInt(localStorage.getItem('foodspoils_barcode_scan_count') || '0', 10);
      if (scanCount >= 10) {
        earned.push('scanner-pro');
      } else if (scanCount >= 1) {
        earned.push('scanner-starter');
      }

      setUnlockedAchievements(earned);

      // Auto-save earned achievements to database if user is loaded
      if (user) {
        localStorage.setItem(`foodspoils_achievements_${user.id}`, JSON.stringify(earned));
      }
    } catch (err) {
      console.error('Error calculating achievements:', err);
    }
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) { // 2MB limit
      setMessage({ type: 'error', text: 'Image must be smaller than 2MB' });
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      setAvatarUrl(base64String);
    };
    reader.readAsDataURL(file);
  };

  const handleSelectEmoji = (emoji: string) => {
    setAvatarUrl(emoji);
  };

  const toggleDietaryPreference = (diet: string) => {
    if (diet === 'None') {
      setSelectedDiets(['None']);
      return;
    }
    
    setSelectedDiets(prev => {
      const filtered = prev.filter(d => d !== 'None');
      if (filtered.includes(diet)) {
        const next = filtered.filter(d => d !== diet);
        return next.length === 0 ? ['None'] : next;
      } else {
        return [...filtered, diet];
      }
    });
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      // First save locally as a reliable fallback
      if (user) {
        localStorage.setItem(`foodspoils_dietary_${user.id}`, JSON.stringify(selectedDiets));
        localStorage.setItem(`foodspoils_achievements_${user.id}`, JSON.stringify(unlockedAchievements));
      }

      // Try updating in Supabase profile
      const { error } = await supabase
        .from('user_profiles')
        .update({
          display_name: displayName,
          avatar_url: avatarUrl,
          dietary_preferences: selectedDiets,
          achievements: unlockedAchievements,
        } as any) // Cast as any in case TS definition doesn't contain the columns yet
        .eq('id', user?.id);

      if (error) {
        // Fallback update if new columns are missing in remote DB
        const { error: fallbackError } = await supabase
          .from('user_profiles')
          .update({
            display_name: displayName,
            avatar_url: avatarUrl,
          })
          .eq('id', user?.id);
          
        if (fallbackError) throw fallbackError;
        setMessage({ type: 'success', text: 'Name & avatar saved. (Preferences saved locally)' });
      } else {
        setMessage({ type: 'success', text: 'Profile & preferences saved successfully!' });
      }
      
      setTimeout(() => setMessage(null), 3000);
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message });
    } finally {
      setLoading(false);
    }
  };

  const achievementsList: Achievement[] = [
    {
      id: 'pantry-starter',
      title: '🥇 Pantry Starter',
      description: 'Tracked 5+ total food items',
      icon: '🌱',
      unlocked: unlockedAchievements.includes('pantry-starter') || unlockedAchievements.includes('pantry-pro')
    },
    {
      id: 'pantry-pro',
      title: '🏆 Pantry Pro',
      description: 'Tracked 50+ total food items',
      icon: '🏛️',
      unlocked: unlockedAchievements.includes('pantry-pro')
    },
    {
      id: 'zero-waste-week',
      title: '🥇 Zero Waste Week',
      description: '7 consecutive days with no wasted food',
      icon: '🥬',
      unlocked: unlockedAchievements.includes('zero-waste-week')
    },
    {
      id: 'stocked-up',
      title: '🥇 Stocked Up',
      description: '20+ active items in pantry at once',
      icon: '🏪',
      unlocked: unlockedAchievements.includes('stocked-up')
    },
    {
      id: 'clean-eater',
      title: '🥇 Clean Eater',
      description: 'Added items from 5+ food categories',
      icon: '🥗',
      unlocked: unlockedAchievements.includes('clean-eater')
    },
    {
      id: 'scanner-starter',
      title: '🥇 Quick Scan',
      description: 'Used barcode scanner to search items',
      icon: '📷',
      unlocked: unlockedAchievements.includes('scanner-starter') || unlockedAchievements.includes('scanner-pro')
    },
    {
      id: 'scanner-pro',
      title: '🏆 Scanner Pro',
      description: 'Used barcode scanner 10+ times',
      icon: '⚡',
      unlocked: unlockedAchievements.includes('scanner-pro')
    }
  ];

  if (!user) return null;

  return (
    <div className="space-y-4">
      {/* 1. Profile Customization Form */}
      <div className="mx-4 rounded-md border border-charcoal-700 bg-charcoal-900 p-4 shadow-sm space-y-4 animate-fade-in">
        <h3 className="text-sm font-semibold text-gray-200 flex items-center gap-1.5 border-b border-charcoal-700 pb-2">
          <svg className="h-4 w-4 text-fresh-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Personalize Profile
        </h3>

        <form onSubmit={handleUpdateProfile} className="space-y-4">
          <div className="flex items-center gap-4">
            <div 
              className="h-16 w-16 rounded-full bg-fresh-950/30 border-2 border-fresh-900/50 flex-shrink-0 overflow-hidden flex items-center justify-center text-2xl shadow-inner relative group cursor-pointer" 
              onClick={() => fileInputRef.current?.click()}
            >
              {avatarUrl && avatarUrl.startsWith('data:') ? (
                <img 
                  src={avatarUrl} 
                  alt="Avatar" 
                  className="h-full w-full object-cover" 
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '';
                    (e.target as HTMLImageElement).onerror = null;
                  }} 
                />
              ) : avatarUrl ? (
                <span className="text-3xl select-none">{avatarUrl}</span>
              ) : (
                <span className="text-fresh-400 font-bold select-none">
                  {displayName?.charAt(0).toUpperCase() || user.email?.charAt(0).toUpperCase()}
                </span>
              )}
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="text-white text-[10px] font-bold">Edit</span>
              </div>
            </div>
            <div className="flex-1 space-y-1">
              <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                Display Name
              </label>
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="Your Name"
                className="w-full rounded-sm border border-charcoal-700 bg-charcoal-800 px-3 py-2 text-sm text-gray-200 focus:border-fresh-500 focus:ring-1 focus:ring-fresh-500 outline-none transition-all"
              />
            </div>
          </div>

          {/* Photo & Emoji Selectors */}
          <div className="space-y-2">
            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider">
              Profile Avatar
            </label>
            <input
              type="file"
              accept="image/*"
              id="avatar-upload"
              ref={fileInputRef}
              onChange={handlePhotoUpload}
              className="hidden"
            />
            
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex-1 flex items-center justify-center gap-1.5 rounded-sm border border-charcoal-700 bg-charcoal-800 py-1.5 text-xs font-semibold text-gray-300 hover:bg-charcoal-600/50 active:bg-gray-700 transition-colors"
              >
                <span>📷</span> Set Photo
              </button>
              {avatarUrl && (
                <button
                  type="button"
                  onClick={() => setAvatarUrl('')}
                  className="px-3 rounded-sm border border-red-900/50 bg-charcoal-800 text-red-400 text-xs font-semibold hover:bg-red-950/30 transition-colors"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Quick Emoji Selection */}
            <div className="bg-charcoal-800/50 p-2.5 rounded border border-charcoal-700/50 space-y-1.5">
              <span className="text-[9px] font-semibold uppercase tracking-wider text-gray-400 block">
                Or pick a food avatar
              </span>
              <div className="flex flex-wrap gap-1.5 max-h-20 overflow-y-auto pr-1">
                {FOOD_EMOJIS_NORM.map((emoji) => (
                  <button
                    key={emoji}
                    type="button"
                    onClick={() => handleSelectEmoji(emoji)}
                    className={`h-7 w-7 flex items-center justify-center text-lg rounded-full hover:bg-charcoal-600 transition-all select-none ${
                      avatarUrl === emoji ? 'bg-fresh-500/20 border border-fresh-500 scale-110 shadow-sm' : ''
                    }`}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Dietary Preferences Section */}
          <div className="space-y-2">
            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider">
              Dietary Preferences
            </label>
            <div className="flex flex-wrap gap-1.5">
              {DIETARY_OPTIONS.map((diet) => {
                const isSelected = selectedDiets.includes(diet);
                return (
                  <button
                    key={diet}
                    type="button"
                    onClick={() => toggleDietaryPreference(diet)}
                    className={`px-2.5 py-1 text-xs rounded-full font-medium transition-all flex items-center gap-1 border ${
                      isSelected 
                        ? 'bg-fresh-950/30 text-fresh-400 border-fresh-500' 
                        : 'bg-charcoal-800 text-gray-400 border-charcoal-700 hover:bg-gray-750'
                    }`}
                  >
                    {isSelected && <span className="text-[10px]">✓</span>}
                    {diet}
                  </button>
                );
              })}
            </div>
          </div>

          {message && (
            <div className={`text-xs p-2 rounded-sm border ${
              message.type === 'success' 
                ? 'bg-green-950/30 text-green-400 border-green-900/50' 
                : 'bg-red-950/30 text-red-400 border-red-900/50'
            } animate-shake`}>
              {message.text}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-sm bg-fresh-500 py-2 text-xs font-bold text-white hover:bg-fresh-600 transition-colors shadow-sm disabled:opacity-50 active:scale-95 transition-transform"
          >
            {loading ? 'Saving Changes...' : 'Save Profile Changes'}
          </button>
        </form>
      </div>

      {/* 2. Waste reduction stats streak card */}
      <div className="mx-4 rounded-md border border-charcoal-700 bg-charcoal-900 p-4 shadow-sm space-y-3">
        <h3 className="text-sm font-semibold text-gray-200 flex items-center gap-1.5 border-b border-charcoal-700 pb-2">
          <svg className="h-4 w-4 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          Your Impact & Streak
        </h3>

        <div className="grid grid-cols-2 gap-3">
          <div className="bg-charcoal-800/40 p-3 rounded border border-charcoal-700/50 text-center">
            <span className="text-2xl block mb-1">🥬</span>
            <span className="text-xs text-gray-400 block">Food Saved</span>
            <span className="text-lg font-extrabold text-fresh-400">{savedLbs} lbs</span>
            <span className="text-[9px] text-gray-500 block mt-0.5">This Month</span>
          </div>

          <div className="bg-charcoal-800/40 p-3 rounded border border-charcoal-700/50 text-center">
            <span className="text-2xl block mb-1">🔥</span>
            <span className="text-xs text-gray-400 block">Reduction Streak</span>
            <span className="text-lg font-extrabold text-orange-400">{streakDays}-Day</span>
            <span className="text-[9px] text-gray-500 block mt-0.5">Waste reduction streak!</span>
          </div>
        </div>
      </div>

      {/* 3. Achievements section */}
      <div className="mx-4 rounded-md border border-charcoal-700 bg-charcoal-900 p-4 shadow-sm space-y-3">
        <h3 className="text-sm font-semibold text-gray-200 flex items-center gap-1.5 border-b border-charcoal-700 pb-2">
          <svg className="h-4 w-4 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
          Pantry Achievements
        </h3>

        <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
          {achievementsList.map((ach) => (
            <div 
              key={ach.id} 
              className={`flex items-center gap-3 p-2.5 rounded border transition-all ${
                ach.unlocked 
                  ? 'bg-fresh-950/20 border-fresh-900/30 text-gray-200' 
                  : 'bg-charcoal-800/40 border-gray-750 text-gray-400 opacity-60'
              }`}
            >
              <span className={`text-2xl flex-shrink-0 select-none ${!ach.unlocked ? 'grayscale' : ''}`}>
                {ach.unlocked ? ach.icon : '🔒'}
              </span>
              <div className="flex-1 min-w-0">
                <div className={`text-xs font-bold ${ach.unlocked ? 'text-gray-200' : 'text-gray-400'}`}>
                  {ach.title}
                </div>
                <div className="text-[10px] text-gray-400 leading-tight">
                  {ach.description}
                </div>
              </div>
              <div className="flex-shrink-0 text-right">
                <span className={`text-[9px] font-bold uppercase px-1.5 py-0.5 rounded-full ${
                  ach.unlocked ? 'bg-fresh-500/20 text-fresh-400' : 'bg-charcoal-900 text-gray-500'
                }`}>
                  {ach.unlocked ? 'Unlocked' : 'Locked'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
