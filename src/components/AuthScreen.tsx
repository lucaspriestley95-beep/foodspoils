import React, { useState } from 'react';
import { supabase } from '../lib/supabase';

interface AuthScreenProps {
  onSuccess: () => void;
  initialMode?: 'login' | 'signup' | 'reset';
}

export function AuthScreen({ onSuccess, initialMode = 'login' }: AuthScreenProps) {
  const [mode, setMode] = useState<'login' | 'signup' | 'reset'>(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      if (mode === 'signup') {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        setMessage('Registration successful! Please check your email for verification.');
      } else if (mode === 'login') {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        onSuccess();
      } else if (mode === 'reset') {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: window.location.origin,
        });
        if (error) throw error;
        setMessage('Password reset link sent to your email.');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred during authentication.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-6 min-h-[400px] animate-fade-in">
      <div className="w-full max-w-sm space-y-8 bg-gray-800 p-8 rounded-2xl shadow-xl border border-gray-700">
        <div className="text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-fresh-950/30 text-3xl mb-4">
            {mode === 'signup' ? '🌱' : mode === 'login' ? '🔐' : '🔑'}
          </div>
          <h2 className="text-2xl font-extrabold text-gray-100">
            {mode === 'signup' ? 'Create Account' : mode === 'login' ? 'Welcome Back' : 'Reset Password'}
          </h2>
          <p className="mt-2 text-sm text-gray-400">
            {mode === 'signup' 
              ? 'Join FoodSpoils to sync your pantry across devices.' 
              : mode === 'login' 
                ? 'Sign in to access your synced pantry.' 
                : 'Enter your email to receive a reset link.'}
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleAuth}>
          <div className="space-y-4 rounded-md">
            <div>
              <label htmlFor="email-address" className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">
                Email Address
              </label>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="relative block w-full rounded-sm border border-gray-700 bg-gray-900 px-3 py-3 text-sm text-gray-100 placeholder-gray-400 focus:z-10 focus:border-fresh-500 focus:ring-1 focus:ring-fresh-500 outline-none transition-all"
                placeholder="you@example.com"
              />
            </div>
            {mode !== 'reset' && (
              <div>
                <label htmlFor="password" className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="relative block w-full rounded-sm border border-gray-700 bg-gray-900 px-3 py-3 text-sm text-gray-100 placeholder-gray-400 focus:z-10 focus:border-fresh-500 focus:ring-1 focus:ring-fresh-500 outline-none transition-all"
                  placeholder="••••••••"
                />
              </div>
            )}
          </div>

          {error && (
            <div className="rounded-md bg-red-950/30 p-3 text-xs text-red-600 font-medium border border-red-900/50 animate-shake">
              {error}
            </div>
          )}

          {message && (
            <div className="rounded-md bg-green-950/30 p-3 text-xs text-green-600 font-medium border border-green-900/50">
              {message}
            </div>
          )}

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative flex w-full justify-center rounded-sm bg-fresh-500 px-3 py-3 text-sm font-bold text-white hover:bg-fresh-600 focus:outline-none focus:ring-2 focus:ring-fresh-500 focus:ring-offset-2 transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <svg className="h-5 w-5 animate-spin text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.062 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : mode === 'signup' ? (
                'Create Account'
              ) : mode === 'login' ? (
                'Sign In'
              ) : (
                'Send Reset Link'
              )}
            </button>
          </div>
        </form>

        <div className="text-center space-y-2">
          {mode === 'login' ? (
            <>
              <button
                onClick={() => setMode('signup')}
                className="text-xs font-semibold text-fresh-400 hover:text-fresh-500"
              >
                Don't have an account? Sign Up
              </button>
              <br />
              <button
                onClick={() => setMode('reset')}
                className="text-xs font-semibold text-gray-400 hover:text-gray-400"
              >
                Forgot your password?
              </button>
            </>
          ) : (
            <button
              onClick={() => setMode('login')}
              className="text-xs font-semibold text-fresh-400 hover:text-fresh-500"
            >
              Already have an account? Sign In
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
