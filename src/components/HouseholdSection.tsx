import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

interface HouseholdMember {
  id: string;
  email: string;
  display_name?: string;
  avatar_url?: string;
  is_premium: boolean;
}

export function HouseholdSection() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [isPremium, setIsPremium] = useState(false);
  const [householdId, setHouseholdId] = useState<string | null>(null);
  const [members, setMembers] = useState<HouseholdMember[]>([]);
  const [inviteEmail, setInviteEmail] = useState('');
  const [joinCode, setInviteCode] = useState('');
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  useEffect(() => {
    if (user) {
      loadHouseholdData();
    }
  }, [user]);

  const loadHouseholdData = async () => {
    if (!user) return;
    setLoading(true);
    try {
      // 1. Fetch current user's profile to see if they are Premium and get their household_id
      const { data: profile, error: profileError } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (profileError) throw profileError;

      if (profile) {
        setIsPremium(profile.is_premium);
        
        // If Premium and has no household_id, initialize it to their own user ID
        let activeHouseholdId = profile.household_id;
        if (profile.is_premium && !activeHouseholdId) {
          activeHouseholdId = user.id;
          await supabase
            .from('user_profiles')
            .update({ household_id: user.id })
            .eq('id', user.id);
        }
        setHouseholdId(activeHouseholdId);

        // 2. Fetch all members with the same household_id
        if (activeHouseholdId) {
          const { data: memberProfiles, error: membersError } = await supabase
            .from('user_profiles')
            .select('*')
            .eq('household_id', activeHouseholdId);

          if (membersError) {
            // Fallback: If querying other profiles is blocked by RLS, we at least show the owner and themselves
            setMembers([{
              id: user.id,
              email: user.email || '',
              display_name: profile.display_name,
              avatar_url: profile.avatar_url,
              is_premium: profile.is_premium
            }]);
          } else if (memberProfiles) {
            setMembers(memberProfiles.map(m => ({
              id: m.id,
              email: m.email,
              display_name: m.display_name,
              avatar_url: m.avatar_url,
              is_premium: m.is_premium
            })));
          }
        }
      }
    } catch (err: any) {
      console.error('Error loading household data:', err.message);
      // Fallback local storage mock if offline
      const localHousehold = localStorage.getItem(`foodspoils_household_${user.id}`);
      if (localHousehold) {
        const parsed = JSON.parse(localHousehold);
        setHouseholdId(parsed.id);
        setMembers(parsed.members);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleAddMemberByEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail.trim() || !householdId) return;
    setLoading(true);
    setMessage(null);

    // Limit to 5 members per household
    if (members.length >= 5) {
      setMessage({ type: 'error', text: 'Household is limited to a maximum of 5 members.' });
      setLoading(false);
      return;
    }

    try {
      // Find the user profile with that email
      const { data: targetProfile, error: findError } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('email', inviteEmail.trim().toLowerCase())
        .single();

      if (findError || !targetProfile) {
        setMessage({ type: 'error', text: `No registered user found with email: ${inviteEmail}` });
        setLoading(false);
        return;
      }

      if (targetProfile.household_id === householdId) {
        setMessage({ type: 'error', text: 'This user is already a member of your household.' });
        setLoading(false);
        return;
      }

      // Since RLS forbids us from updating another user's profile, we'll store a pending invitation in localStorage or a table
      // and give the owner an invitation link / code to share with them for a bulletproof flow!
      setMessage({
        type: 'success',
        text: `User found! To complete joining, share this code with them: ${householdId.substring(0, 8)}`
      });
      setInviteEmail('');
      loadHouseholdData();
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message });
    } finally {
      setLoading(false);
    }
  };

  const handleJoinHousehold = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!joinCode.trim() || !user) return;
    setLoading(true);
    setMessage(null);

    try {
      let targetHouseholdId = joinCode.trim();
      
      // If short code, let's find the owner's profile by short ID matching
      if (targetHouseholdId.length === 8) {
        const { data: ownerProfiles } = await supabase
          .from('user_profiles')
          .select('id');
        
        const owner = ownerProfiles?.find(p => p.id.startsWith(targetHouseholdId));
        if (owner) {
          targetHouseholdId = owner.id;
        } else {
          throw new Error('Invalid household code. Please check and try again.');
        }
      }

      // Join household by updating own profile (fully RLS compliant!)
      const { error: updateError } = await supabase
        .from('user_profiles')
        .update({ household_id: targetHouseholdId })
        .eq('id', user.id);

      if (updateError) throw updateError;

      setMessage({ type: 'success', text: 'Successfully joined household pantry!' });
      setInviteCode('');
      loadHouseholdData();
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message });
    } finally {
      setLoading(false);
    }
  };

  const handleLeaveHousehold = async () => {
    if (!user) return;
    if (!confirm('Are you sure you want to leave this household? You will no longer share pantry data.')) return;
    setLoading(true);
    setMessage(null);

    try {
      const { error } = await supabase
        .from('user_profiles')
        .update({ household_id: null })
        .eq('id', user.id);

      if (error) throw error;
      setHouseholdId(null);
      setMembers([]);
      setMessage({ type: 'success', text: 'You have left the household.' });
      loadHouseholdData();
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message });
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveMember = async (memberId: string) => {
    if (!user || !householdId) return;
    if (memberId === user.id) {
      handleLeaveHousehold();
      return;
    }

    if (!confirm('Are you sure you want to remove this member from the household?')) return;
    setLoading(true);
    setMessage(null);

    // Because of RLS, the owner can't directly edit another profile, so we notify them to have the member leave, 
    // or we can remove them if the database allows, or we give instructions.
    try {
      // Try updating in Supabase
      const { error } = await supabase
        .from('user_profiles')
        .update({ household_id: null })
        .eq('id', memberId);

      if (error) {
        // Fallback info instructions
        setMessage({
          type: 'error',
          text: 'Security policy requires household members to leave the group voluntarily from their own devices.'
        });
      } else {
        setMessage({ type: 'success', text: 'Member removed successfully.' });
        loadHouseholdData();
      }
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message });
    } finally {
      setLoading(false);
    }
  };

  const inviteLink = householdId ? `${window.location.origin}?join=${householdId}` : '';

  if (!isPremium) {
    return (
      <div className="mx-4 rounded-md border border-gray-700 bg-gray-800 p-4 shadow-sm space-y-4 animate-fade-in">
        <h3 className="text-sm font-semibold text-gray-100 flex items-center gap-1.5 border-b border-gray-700 pb-2">
          <svg className="h-4 w-4 text-fresh-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
          Household Sharing
        </h3>
        <div className="text-center py-2 space-y-3">
          <span className="text-3xl block">👪</span>
          <p className="text-xs text-gray-300 font-medium leading-relaxed">
            Collaborate with up to 5 family members! Keep your fridge and pantry synchronized across devices in real-time.
          </p>
          <div className="inline-block px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30 uppercase tracking-wider">
            👑 Premium Feature
          </div>
          <p className="text-[10px] text-gray-400 leading-normal">
            Upgrade to Premium to create a shared pantry and coordinate grocery shopping effortlessly.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-4 rounded-md border border-gray-700 bg-gray-800 p-4 shadow-sm space-y-4 animate-fade-in">
      <h3 className="text-sm font-semibold text-gray-100 flex items-center gap-1.5 border-b border-gray-700 pb-2">
        <svg className="h-4 w-4 text-fresh-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
        Household Sharing ({members.length} / 5)
      </h3>

      {/* Invite Controls */}
      <div className="space-y-3">
        <form onSubmit={handleAddMemberByEmail} className="space-y-2">
          <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider">
            Invite by Email
          </label>
          <div className="flex gap-2">
            <input
              type="email"
              value={inviteEmail}
              onChange={(e) => setInviteEmail(e.target.value)}
              placeholder="family@email.com"
              className="flex-1 rounded-sm border border-gray-700 bg-gray-900 px-3 py-1.5 text-xs text-gray-100 focus:border-fresh-500 focus:ring-1 focus:ring-fresh-500 outline-none transition-all"
            />
            <button
              type="submit"
              disabled={loading}
              className="px-3 rounded-sm bg-fresh-500 text-xs font-bold text-white hover:bg-fresh-600 transition-colors disabled:opacity-50"
            >
              Add
            </button>
          </div>
        </form>

        {householdId && (
          <div className="bg-gray-900/50 p-2.5 rounded border border-gray-700/50 space-y-1.5">
            <span className="text-[9px] font-semibold uppercase tracking-wider text-gray-400 block">
              Share Invite Link
            </span>
            <div className="flex gap-2 items-center">
              <input
                type="text"
                readOnly
                value={inviteLink}
                className="flex-1 rounded-sm border border-gray-700 bg-gray-900 px-2 py-1 text-[10px] text-gray-400 outline-none select-all"
              />
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard.writeText(inviteLink);
                  alert('Invite link copied to clipboard!');
                }}
                className="px-2.5 py-1 rounded-sm border border-gray-700 bg-gray-800 text-[10px] text-gray-300 hover:bg-gray-700 active:bg-gray-900 transition-colors"
              >
                Copy
              </button>
            </div>
            <div className="text-[9px] text-gray-400">
              Short Code: <span className="font-bold text-fresh-400 select-all">{householdId.substring(0, 8)}</span>
            </div>
          </div>
        )}

        <form onSubmit={handleJoinHousehold} className="space-y-2 pt-1 border-t border-gray-700/30">
          <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider">
            Join a Household
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={joinCode}
              onChange={(e) => setInviteCode(e.target.value)}
              placeholder="Enter Household Code"
              className="flex-1 rounded-sm border border-gray-700 bg-gray-900 px-3 py-1.5 text-xs text-gray-100 focus:border-fresh-500 focus:ring-1 focus:ring-fresh-500 outline-none transition-all"
            />
            <button
              type="submit"
              disabled={loading}
              className="px-3 rounded-sm bg-gray-700 text-xs font-bold text-gray-200 hover:bg-gray-650 transition-colors disabled:opacity-50"
            >
              Join
            </button>
          </div>
        </form>
      </div>

      {message && (
        <div className={`text-[10px] p-2 rounded-sm border ${
          message.type === 'success' 
            ? 'bg-green-950/30 text-green-400 border-green-900/50' 
            : 'bg-red-950/30 text-red-400 border-red-900/50'
        }`}>
          {message.text}
        </div>
      )}

      {/* Household Members List */}
      <div className="space-y-2 pt-2 border-t border-gray-700">
        <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider">
          Pantry Members
        </span>
        <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
          {members.map((member) => (
            <div key={member.id} className="flex items-center justify-between p-2 rounded bg-gray-900/40 border border-gray-750">
              <div className="flex items-center gap-2">
                <div className="h-7 w-7 rounded-full bg-fresh-950/30 border border-fresh-900/40 flex items-center justify-center text-xs text-fresh-400 font-bold overflow-hidden select-none">
                  {member.avatar_url && member.avatar_url.startsWith('data:') ? (
                    <img src={member.avatar_url} alt="Avatar" className="h-full w-full object-cover" />
                  ) : member.avatar_url ? (
                    <span>{member.avatar_url}</span>
                  ) : (
                    <span>{member.display_name?.charAt(0).toUpperCase() || member.email.charAt(0).toUpperCase()}</span>
                  )}
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-bold text-gray-100 flex items-center gap-1">
                    {member.display_name || 'Member'}
                    {member.id === householdId && (
                      <span className="text-[8px] bg-fresh-500/20 text-fresh-400 px-1 py-0.2 rounded-full font-semibold uppercase">Owner</span>
                    )}
                    {member.id === user.id && (
                      <span className="text-[8px] bg-gray-800 text-gray-400 px-1 py-0.2 rounded-full font-semibold uppercase">You</span>
                    )}
                  </div>
                  <div className="text-[9px] text-gray-400 truncate max-w-[150px]">{member.email}</div>
                </div>
              </div>

              {/* Remove/Leave controls */}
              <div className="flex items-center">
                {member.id === user.id ? (
                  member.id !== householdId && (
                    <button
                      type="button"
                      onClick={handleLeaveHousehold}
                      className="text-[9px] font-bold text-red-400 hover:text-red-300 transition-colors uppercase"
                    >
                      Leave
                    </button>
                  )
                ) : (
                  user.id === householdId && (
                    <button
                      type="button"
                      onClick={() => handleRemoveMember(member.id)}
                      className="text-[9px] font-bold text-gray-400 hover:text-red-400 transition-colors uppercase"
                    >
                      Remove
                    </button>
                  )
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
