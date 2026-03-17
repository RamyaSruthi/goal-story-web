'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { useStore } from '@/store/use-store';
import { LogOut, Sun, Moon } from 'lucide-react';
import { toast } from 'sonner';
import { useTheme } from 'next-themes';

export function UserFooter() {
  const router = useRouter();
  const clearData = useStore((s) => s.clearData);
  const [email, setEmail] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();
  const isDark = theme === 'dark';

  useEffect(() => {
    setMounted(true);
    createClient().auth.getUser().then(({ data: { user } }) => {
      setEmail(user?.email ?? null);
    });
  }, []);

  const signOut = async () => {
    await createClient().auth.signOut();
    clearData();
    router.push('/login');
    toast.success('Signed out');
  };

  const initials = email ? email.slice(0, 2).toUpperCase() : '??';

  return (
    <div
      className="m-2 rounded-xl p-3 flex items-center gap-3 border"
      style={{
        background: 'var(--gs-card2)',
        borderColor: 'var(--gs-border)',
      }}
    >
      <div
        className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold shrink-0"
        style={{ background: 'var(--gs-accent)', color: '#fff' }}
      >
        {initials}
      </div>
      <p className="text-xs truncate flex-1 min-w-0 font-medium" style={{ color: 'var(--gs-text-sub)' }}>
        {email ?? '…'}
      </p>
      <button
        onClick={() => setTheme(isDark ? 'light' : 'dark')}
        className="shrink-0 p-1 rounded-lg hover:bg-[var(--gs-card)] transition-colors"
        title="Toggle theme"
      >
        {mounted && (isDark
          ? <Sun  size={14} style={{ color: 'var(--gs-text-dim)' }} />
          : <Moon size={14} style={{ color: 'var(--gs-text-dim)' }} />
        )}
      </button>
      <button
        onClick={signOut}
        className="shrink-0 p-1 rounded-lg hover:bg-[var(--gs-card)] transition-colors"
        title="Sign out"
      >
        <LogOut size={14} style={{ color: 'var(--gs-text-dim)' }} />
      </button>
    </div>
  );
}
