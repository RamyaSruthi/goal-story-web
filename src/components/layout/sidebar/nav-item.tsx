'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

interface NavItemProps {
  href: string;
  label: string;
  children: React.ReactNode;
}

export function NavItem({ href, label, children }: NavItemProps) {
  const pathname = usePathname();
  const active = pathname === href;

  return (
    <Link
      href={href}
      className={cn(
        'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150',
        active
          ? 'text-[var(--gs-accent)]'
          : 'text-[var(--gs-text-dim)] hover:text-[var(--gs-text)] hover:bg-[var(--gs-card2)]'
      )}
      style={active ? {
        background: 'var(--gs-accent-bg)',
        boxShadow: 'inset 3px 0 0 var(--gs-accent), 0 0 16px var(--gs-accent-bg)',
      } : undefined}
    >
      <span className={cn('transition-colors', active ? 'text-[var(--gs-accent)]' : '')}>
        {children}
      </span>
      {label}
    </Link>
  );
}
