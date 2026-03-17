'use client';

import Link from 'next/link';
import { useStore } from '@/store/use-store';
import { TodaySummary } from '@/components/today/today-summary';
import { GoalSection } from '@/components/today/goal-section';

function greeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
}

export default function TodayPage() {
  const { goals, isLoading } = useStore();
  const activeGoals = goals.filter((g) => !g.achieved && !g.archived);
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });

  return (
    <div className="px-4 py-6 md:px-8 md:py-8 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between gap-6 mb-8">
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: 'var(--gs-text-dim)', letterSpacing: '0.1em' }}>
            {today}
          </p>
          <h1 className="font-black tracking-tight leading-tight" style={{ fontSize: 36, letterSpacing: '-0.03em', color: 'var(--gs-text)' }}>
            {greeting()}
          </h1>
          <p className="text-sm mt-1" style={{ color: 'var(--gs-text-sub)' }}>
            Here&apos;s what&apos;s on your plate today.
          </p>
        </div>

        <div className="shrink-0 hidden sm:block">
          <TodaySummary />
        </div>
      </div>

      {/* Summary on mobile (below heading) */}
      <div className="sm:hidden mb-8">
        <TodaySummary />
      </div>

      <div>
        {isLoading ? (
          <div className="space-y-3">
            {[1, 2].map((i) => (
              <div key={i} className="h-16 rounded-2xl animate-shimmer" style={{ background: 'var(--gs-card)' }} />
            ))}
          </div>
        ) : activeGoals.length === 0 ? (
          <div
            className="rounded-2xl border p-12 text-center max-w-md mx-auto"
            style={{ background: 'var(--gs-card)', borderColor: 'var(--gs-border)', borderStyle: 'dashed' }}
          >
            <p className="text-5xl mb-5">🎯</p>
            <p className="font-black text-xl mb-2 tracking-tight" style={{ fontSize: 22, letterSpacing: '-0.02em', color: 'var(--gs-text)' }}>
              Set your first goal
            </p>
            <p className="text-sm mb-6 leading-relaxed" style={{ color: 'var(--gs-text-dim)' }}>
              Goals keep you accountable. Add one now and start tracking your progress day by day.
            </p>
            <Link
              href="/app/goals"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-opacity hover:opacity-80"
              style={{ background: 'var(--gs-accent)', color: '#fff' }}
            >
              Create a goal →
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-3">
            {activeGoals.map((goal) => <GoalSection key={goal.id} goal={goal} />)}
          </div>
        )}
      </div>
    </div>
  );
}
