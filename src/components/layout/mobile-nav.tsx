'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { CalendarDays, Target, BookOpen, LayoutGrid, BarChart2, Archive, Settings } from 'lucide-react';

const NAV_ITEMS = [
  { href: '/app/today',    label: 'Today',    icon: CalendarDays },
  { href: '/app/goals',    label: 'Goals',    icon: Target },
  { href: '/app/journal',  label: 'Journal',  icon: BookOpen },
  { href: '/app/stats',    label: 'Stats',    icon: BarChart2 },
  { href: '/app/heatmap',  label: 'Heatmap',  icon: LayoutGrid },
  { href: '/app/archived', label: 'Archived', icon: Archive },
  { href: '/app/settings', label: 'Settings', icon: Settings },
];

export function MobileNav() {
  const pathname = usePathname();

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 md:hidden border-t overflow-x-auto"
      style={{ background: 'var(--gs-card)', borderColor: 'var(--gs-border)' }}
    >
      <div className="flex min-w-max">
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className="flex flex-col items-center justify-center gap-1 py-2.5 text-[10px] font-medium transition-colors"
              style={{
                color: active ? 'var(--gs-accent)' : 'var(--gs-text-faint)',
                minWidth: '64px',
                paddingLeft: '8px',
                paddingRight: '8px',
              }}
            >
              <Icon size={20} strokeWidth={active ? 2.5 : 1.8} />
              {label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
