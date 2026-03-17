'use client';

import { useStore } from '@/store/use-store';
import { todayStr, fmtMins } from '@/lib/utils';
import { Clock, Target, CheckSquare } from 'lucide-react';

export function TodaySummary() {
  const { journals, goals } = useStore();
  const today = todayStr();
  const todayJournals = journals.filter((j) => j.date === today);
  const totalMins = todayJournals.reduce((sum, j) => sum + j.minutesSpent, 0);
  const activeGoals = goals.filter((g) => !g.achieved).length;
  const doneTasks = goals.flatMap((g) => g.tasks).filter((t) => t.done).length;
  const totalTasks = goals.flatMap((g) => g.tasks).length;

  return (
    <div className="grid grid-cols-3 gap-3">
      {/* Focused time — accent card */}
      <div
        className="rounded-2xl p-4 border relative overflow-hidden"
        style={{
          background: 'var(--gs-accent-bg)',
          borderColor: 'var(--gs-accent-border)',
          boxShadow: '0 0 24px rgba(129,140,248,0.12)',
        }}
      >
        <div className="flex items-center gap-2 mb-3">
          <Clock size={13} style={{ color: 'var(--gs-accent)' }} />
          <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--gs-accent)' }}>Today</span>
        </div>
        <p className="text-3xl font-black tracking-tight" style={{ color: 'var(--gs-accent)', letterSpacing: '-0.02em' }}>
          {fmtMins(totalMins)}
        </p>
        <p className="text-xs mt-1" style={{ color: 'var(--gs-accent)', opacity: 0.6 }}>focused</p>
      </div>

      {/* Active goals */}
      <div className="rounded-2xl p-4 border" style={{ background: 'var(--gs-card)', borderColor: 'var(--gs-border)' }}>
        <div className="flex items-center gap-2 mb-3">
          <Target size={13} style={{ color: 'var(--gs-text-dim)' }} />
          <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--gs-text-dim)' }}>Goals</span>
        </div>
        <p className="text-3xl font-black tracking-tight" style={{ color: 'var(--gs-text)', letterSpacing: '-0.02em' }}>{activeGoals}</p>
        <p className="text-xs mt-1" style={{ color: 'var(--gs-text-dim)' }}>active</p>
      </div>

      {/* Tasks */}
      <div className="rounded-2xl p-4 border" style={{ background: 'var(--gs-card)', borderColor: 'var(--gs-border)' }}>
        <div className="flex items-center gap-2 mb-3">
          <CheckSquare size={13} style={{ color: 'var(--gs-text-dim)' }} />
          <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--gs-text-dim)' }}>Tasks</span>
        </div>
        <p className="text-3xl font-black tracking-tight" style={{ color: 'var(--gs-text)', letterSpacing: '-0.02em' }}>{doneTasks}</p>
        <p className="text-xs mt-1" style={{ color: 'var(--gs-text-dim)' }}>of {totalTasks} done</p>
      </div>
    </div>
  );
}
