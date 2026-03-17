'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

export default function ResetPasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirm) {
      toast.error('Passwords do not match');
      return;
    }
    setLoading(true);
    const supabase = createClient();
    const { error } = await supabase.auth.updateUser({ password });
    setLoading(false);
    if (error) {
      toast.error(error.message);
    } else {
      toast.success('Password updated!');
      router.push('/app/today');
    }
  };

  return (
    <div>
      <div className="mb-8">
        <div className="text-2xl mb-1" style={{ color: 'var(--gs-text)' }}>🔒 New password</div>
        <p className="text-sm" style={{ color: 'var(--gs-text-dim)' }}>
          Choose a new password for your account
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1.5">
          <Label style={{ color: 'var(--gs-text-sub)' }}>New password</Label>
          <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
            minLength={6}
            autoFocus
            className="border-0"
            style={{ background: 'var(--gs-input-bg)', color: 'var(--gs-text)' }}
          />
        </div>
        <div className="space-y-1.5">
          <Label style={{ color: 'var(--gs-text-sub)' }}>Confirm password</Label>
          <Input
            type="password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            placeholder="••••••••"
            required
            minLength={6}
            className="border-0"
            style={{ background: 'var(--gs-input-bg)', color: 'var(--gs-text)' }}
          />
        </div>
        <Button
          type="submit"
          disabled={loading || !password || !confirm}
          className="w-full font-semibold"
          style={{ background: 'var(--gs-accent)', color: '#fff' }}
        >
          {loading ? 'Updating…' : 'Update password'}
        </Button>
      </form>
    </div>
  );
}
