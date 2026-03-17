'use client';

import { useTheme } from 'next-themes';
import { Sun, Moon } from 'lucide-react';
import { useEffect, useState } from 'react';

export function ThemeSwitch() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);
  if (!mounted) return <div className="w-[60px] h-8" />;

  const isDark = theme === 'dark';

  return (
    <div
      className="flex items-center gap-0.5 rounded-full p-[3px]"
      style={{ background: 'var(--gs-border-mid)' }}
    >
      <button
        onClick={() => setTheme('dark')}
        aria-label="Dark mode"
        className="w-7 h-7 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110"
        style={{
          background: isDark ? 'var(--gs-card2)' : 'transparent',
          boxShadow: isDark ? '0 1px 4px rgba(0,0,0,0.25)' : 'none',
        }}
      >
        <Moon
          size={13}
          style={{ color: isDark ? 'var(--gs-accent)' : 'var(--gs-text-faint)' }}
        />
      </button>

      <button
        onClick={() => setTheme('light')}
        aria-label="Light mode"
        className="w-7 h-7 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110"
        style={{
          background: !isDark ? 'var(--gs-card2)' : 'transparent',
          boxShadow: !isDark ? '0 1px 4px rgba(0,0,0,0.15)' : 'none',
        }}
      >
        <Sun
          size={13}
          style={{ color: !isDark ? '#F59E0B' : 'var(--gs-text-faint)' }}
        />
      </button>
    </div>
  );
}
