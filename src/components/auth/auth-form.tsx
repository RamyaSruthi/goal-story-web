'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

export function AuthForm() {
  const searchParams = useSearchParams();
  const [isSignUp, setIsSignUp] = useState(false);

  useEffect(() => {
    if (searchParams.get('error') === 'reset_failed') {
      toast.error('Reset link is invalid or expired. Please request a new one.');
    }
  }, [searchParams]);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const supabase = createClient();

    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        toast.success('Account created! Check your email to confirm.');
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        // Write session cookies server-side so they persist reliably across
        // browser restarts (avoids Safari ITP wiping JS-set cookies).
        if (data.session) {
          await fetch('/api/auth/set-session', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              access_token: data.session.access_token,
              refresh_token: data.session.refresh_token,
            }),
          });
        }
        // Full page navigation so the middleware sees the freshly-set cookies.
        window.location.href = '/app/today';
      }
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="mb-8">
        <div className="text-2xl mb-1" style={{ color: 'var(--gs-text)' }}>
          {isSignUp ? '✨ Create account' : '👋 Welcome back'}
        </div>
        <p className="text-sm" style={{ color: 'var(--gs-text-dim)' }}>
          {isSignUp ? 'Start tracking your goals' : 'Sign in to Goal Story'}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1.5">
          <Label style={{ color: 'var(--gs-text-sub)' }}>Email</Label>
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            required
            className="border-0"
            style={{
              background: 'var(--gs-input-bg)',
              color: 'var(--gs-text)',
            }}
          />
        </div>
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <Label style={{ color: 'var(--gs-text-sub)' }}>Password</Label>
            {!isSignUp && (
              <Link
                href="/forgot-password"
                className="text-xs underline"
                style={{ color: 'var(--gs-accent)' }}
              >
                Forgot password?
              </Link>
            )}
          </div>
          <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
            minLength={6}
            className="border-0"
            style={{
              background: 'var(--gs-input-bg)',
              color: 'var(--gs-text)',
            }}
          />
        </div>
        <Button
          type="submit"
          disabled={loading}
          className="w-full font-semibold mt-2"
          style={{ background: 'var(--gs-accent)', color: '#fff' }}
        >
          {loading ? 'Please wait…' : isSignUp ? 'Create account' : 'Sign in'}
        </Button>
      </form>

      <p className="text-center text-sm mt-6" style={{ color: 'var(--gs-text-dim)' }}>
        {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
        <button
          type="button"
          onClick={() => setIsSignUp(!isSignUp)}
          className="font-medium underline"
          style={{ color: 'var(--gs-accent)' }}
        >
          {isSignUp ? 'Sign in' : 'Sign up'}
        </button>
      </p>
    </div>
  );
}
