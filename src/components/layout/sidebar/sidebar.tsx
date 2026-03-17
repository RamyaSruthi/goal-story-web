import { NavItem } from './nav-item';
import { UserFooter } from './user-footer';
import { CalendarDays, Target, BookOpen, LayoutGrid, BarChart2, Settings, Archive } from 'lucide-react';

export function Sidebar() {
  return (
    <aside
      className="w-[220px] shrink-0 flex flex-col h-screen border-r"
      style={{
        background: 'var(--gs-card)',
        borderColor: 'var(--gs-border)',
      }}
    >
      {/* Logo */}
      <div className="px-4 pt-6 pb-5">
        <span className="font-black tracking-tight" style={{ fontSize: 18, letterSpacing: '-0.03em' }}>
          <span className="text-gradient-white">Goal </span>
          <span className="text-gradient-purple">Story</span>
        </span>
      </div>

      {/* Section label */}
      <div className="px-4 mb-1">
        <p className="text-[10px] font-semibold uppercase tracking-widest" style={{ color: 'var(--gs-text-faint)' }}>
          Menu
        </p>
      </div>

      {/* Nav */}
      <nav className="flex flex-col gap-0.5 px-2 flex-1">
        <NavItem href="/app/today" label="Today">
          <CalendarDays size={16} />
        </NavItem>
        <NavItem href="/app/goals" label="Goals">
          <Target size={16} />
        </NavItem>
        <NavItem href="/app/journal" label="Journal">
          <BookOpen size={16} />
        </NavItem>
        <NavItem href="/app/heatmap" label="Heatmap">
          <LayoutGrid size={16} />
        </NavItem>
        <NavItem href="/app/stats" label="Stats">
          <BarChart2 size={16} />
        </NavItem>
        <NavItem href="/app/archived" label="Archived">
          <Archive size={16} />
        </NavItem>
        <NavItem href="/app/settings" label="Settings">
          <Settings size={16} />
        </NavItem>
      </nav>

      <UserFooter />
    </aside>
  );
}
