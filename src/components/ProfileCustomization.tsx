import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

export function ProfileCustomization() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [displayName, setDisplayName] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

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

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const { error } = await supabase
        .from('user_profiles')
        .update({
          display_name: displayName,
          avatar_url: avatarUrl,
        })
        .eq('id', user?.id);

      if (error) throw error;
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
    <div className="mx-4 mb-4 rounded-md border border-gray-200 bg-white p-4 shadow-sm space-y-4 animate-fade-in">
      <h3 className="text-sm font-semibold text-gray-800 flex items-center gap-1.5">
        <svg className="h-4 w-4 text-fresh-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        Personalize Profile
      </h3>

      <form onSubmit={handleUpdateProfile} className="space-y-4">
        <div className="flex items-center gap-4">
          <div className="h-16 w-16 rounded-full bg-fresh-50 border-2 border-fresh-100 flex-shrink-0 overflow-hidden flex items-center justify-center text-2xl shadow-inner">
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
              <span className="text-fresh-600 font-bold">
                {displayName?.charAt(0).toUpperCase() || user.email?.charAt(0).toUpperCase()}
              </span>
            )}
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
              className="w-full rounded-sm border border-gray-200 bg-gray-50 px-3 py-2 text-sm focus:border-fresh-500 focus:ring-1 focus:ring-fresh-500 outline-none transition-all"
            />
          </div>
        </div>

        <div className="space-y-1">
          <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider">
            Avatar URL
          </label>
          <input
            type="url"
            value={avatarUrl}
            onChange={(e) => setAvatarUrl(e.target.value)}
            placeholder="https://example.com/photo.jpg"
            className="w-full rounded-sm border border-gray-200 bg-gray-50 px-3 py-2 text-sm focus:border-fresh-500 focus:ring-1 focus:ring-fresh-500 outline-none transition-all"
          />
        </div>

        {message && (
          <div className={`text-xs p-2 rounded-sm border ${
            message.type === 'success' 
              ? 'bg-green-50 text-green-700 border-green-100' 
              : 'bg-red-50 text-red-700 border-red-100'
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
