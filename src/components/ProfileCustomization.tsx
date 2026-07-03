import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

export function ProfileCustomization() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [displayName, setDisplayName] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (user) {
      fetchProfile();
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
      }
    } catch (error: any) {
      console.error('Error fetching profile:', error.message);
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

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      // First check if avatar_url column exists by trying to select it
      // If it doesn't exist, we'll get an error, but we're ignoring it for the update
      // Supabase handles this gracefully by just not updating missing columns if we use upsert
      // But we know avatar_url might be large if base64, so we need to be careful
      
      const { error } = await supabase
        .from('user_profiles')
        .update({
          display_name: displayName,
          avatar_url: avatarUrl,
        })
        .eq('id', user?.id);

      if (error) {
        // If there's an error, it might be because avatar_url doesn't exist in schema
        if (error.message.includes('avatar_url')) {
           // Fallback to just updating display name
           const { error: fallbackError } = await supabase
            .from('user_profiles')
            .update({
              display_name: displayName,
            })
            .eq('id', user?.id);
            
           if (fallbackError) throw fallbackError;
           throw new Error('Name saved, but database does not support profile photos yet. (Requires avatar_url column)');
        }
        throw error;
      }
      
      setMessage({ type: 'success', text: 'Profile updated successfully!' });
      
      // Clear message after 3 seconds
      setTimeout(() => setMessage(null), 3000);
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message });
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <div className="mx-4 mb-4 rounded-md border border-gray-700 bg-gray-800 p-4 shadow-sm space-y-4 animate-fade-in">
      <h3 className="text-sm font-semibold text-gray-100 flex items-center gap-1.5">
        <svg className="h-4 w-4 text-fresh-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        Personalize Profile
      </h3>

      <form onSubmit={handleUpdateProfile} className="space-y-4">
        <div className="flex items-center gap-4">
          <div className="h-16 w-16 rounded-full bg-fresh-950/30 border-2 border-fresh-900/50 flex-shrink-0 overflow-hidden flex items-center justify-center text-2xl shadow-inner relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
            {avatarUrl ? (
              <img 
                src={avatarUrl} 
                alt="Avatar" 
                className="h-full w-full object-cover" 
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '';
                  (e.target as HTMLImageElement).onerror = null;
                }} 
              />
            ) : (
              <span className="text-fresh-400 font-bold">
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
              className="w-full rounded-sm border border-gray-700 bg-gray-900 px-3 py-2 text-sm focus:border-fresh-500 focus:ring-1 focus:ring-fresh-500 outline-none transition-all"
            />
          </div>
        </div>

        <div className="space-y-1">
          <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider">
            Profile Photo
          </label>
          <input
            type="file"
            accept="image/*"
            id="avatar-upload"
            ref={fileInputRef}
            onChange={handlePhotoUpload}
            className="hidden"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="w-full flex items-center justify-center gap-2 rounded-sm border border-gray-700 bg-gray-800 py-2 text-xs font-semibold text-gray-300 hover:bg-gray-900 active:bg-gray-700/40 transition-colors"
          >
            <span>📷</span> Choose Photo
          </button>
          {avatarUrl && (
            <button
              type="button"
              onClick={() => setAvatarUrl('')}
              className="w-full text-center text-[10px] text-red-500 hover:underline mt-1"
            >
              Remove Photo
            </button>
          )}
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
          className="w-full rounded-sm bg-fresh-500 py-2.5 text-xs font-bold text-white hover:bg-fresh-600 transition-colors shadow-sm disabled:opacity-50 active:scale-95 transition-transform"
        >
          {loading ? (
             <div className="flex items-center justify-center gap-2">
               <svg className="animate-spin h-3 w-3 text-white" viewBox="0 0 24 24">
                 <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                 <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.062 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
               </svg>
               Saving Changes...
             </div>
          ) : 'Save Profile Changes'}
        </button>
      </form>
    </div>
  );
}
