'use client';

import { useState } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const supabase = createClient();
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/callback?next=/reset-password`,
    });
    setLoading(false);
    if (error) {
      toast.error(error.message);
    } else {
      setSent(true);
    }
  };

  if (sent) {
    return (
      <div className="text-center space-y-3">
        <div className="text-3xl">📬</div>
        <p className="font-semibold" style={{ color: 'var(--gs-text)' }}>Check your email</p>
        <p className="text-sm" style={{ color: 'var(--gs-text-dim)' }}>
          We sent a password reset link to <strong>{email}</strong>
        </p>
        <Link
          href="/login"
          className="text-sm underline block mt-4"
          style={{ color: 'var(--gs-accent)' }}
        >
          Back to sign in
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <div className="text-2xl mb-1" style={{ color: 'var(--gs-text)' }}>🔑 Reset password</div>
        <p className="text-sm" style={{ color: 'var(--gs-text-dim)' }}>
          Enter your email and we&apos;ll send you a reset link
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
            autoFocus
            className="border-0"
            style={{ background: 'var(--gs-input-bg)', color: 'var(--gs-text)' }}
          />
        </div>
        <Button
          type="submit"
          disabled={loading}
          className="w-full font-semibold"
          style={{ background: 'var(--gs-accent)', color: '#fff' }}
        >
          {loading ? 'Sending…' : 'Send reset link'}
        </Button>
      </form>

      <p className="text-center text-sm mt-6" style={{ color: 'var(--gs-text-dim)' }}>
        <Link href="/login" className="underline" style={{ color: 'var(--gs-accent)' }}>
          Back to sign in
        </Link>
      </p>
    </div>
  );
}
