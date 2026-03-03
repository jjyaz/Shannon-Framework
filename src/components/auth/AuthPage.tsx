import { useState } from 'react';
import { GlowButton, Input, LoadingSpinner } from '../ui';
import { supabase } from '../../lib/supabase';

interface AuthPageProps {
  onAuthSuccess: () => void;
}

export function AuthPage({ onAuthSuccess }: AuthPageProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isLogin) {
        const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
        if (signInError) throw signInError;
      } else {
        const { error: signUpError } = await supabase.auth.signUp({ email, password });
        if (signUpError) throw signUpError;
      }
      onAuthSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 grid-bg">
      <div className="scanline-overlay" />
      <div className="noise-overlay" />

      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-neon-orange/[0.03] rounded-full blur-[100px] pointer-events-none" />

      <div className="w-full max-w-sm relative z-10">
        <div className="text-center mb-6">
          <h1 className="font-mono text-3xl font-bold text-neon-orange tracking-[0.15em] text-shadow-neon-strong animate-glow-pulse mb-1">
            SHANNON
          </h1>
          <p className="font-mono text-[11px] text-neon-orange/30 uppercase tracking-widest">
            AI Penetration Testing Framework
          </p>
        </div>

        <div className="terminal-panel rounded-sm">
          <div className="terminal-header">
            {isLogin ? 'auth.login' : 'auth.register'}
          </div>
          <div className="p-4">
            {error && (
              <div className="mb-4 p-2 border border-terminal-red/20 bg-terminal-red/5">
                <span className="font-mono text-xs text-terminal-red">[ERROR] {error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-3">
              <Input
                type="email"
                label="Email"
                placeholder="operator@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />

              <Input
                type="password"
                label="Password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />

              <GlowButton type="submit" className="w-full" disabled={loading}>
                {loading ? (
                  <LoadingSpinner size="sm" text={isLogin ? 'Authenticating...' : 'Creating...'} />
                ) : (
                  <span>{isLogin ? 'Authenticate' : 'Create Account'}</span>
                )}
              </GlowButton>
            </form>

            <div className="mt-4 text-center">
              <button
                onClick={() => { setIsLogin(!isLogin); setError(''); }}
                className="font-mono text-[11px] text-neon-orange/25 hover:text-neon-orange/50 transition-colors"
              >
                {isLogin ? '> create new account' : '> sign in to existing account'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
