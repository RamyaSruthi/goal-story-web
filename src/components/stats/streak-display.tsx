'use client';

import { useMemo } from 'react';
import { JournalEntry, Goal } from '@/types';
import { computeStreak } from '@/lib/chart-utils';

interface Props {
  goals: Goal[];
  journals: JournalEntry[];
  palette: string[];
}

export function StreakDisplay({ goals, journals, palette }: Props) {
  const streaks = useMemo(() =>
    goals.map((g, i) => ({
      goal: g,
      streak: computeStreak(journals.filter((j) => j.goalId === g.id)),
      color: palette[i % palette.length],
    })),
    [goals, journals, palette]
  );

  if (goals.length === 0) return null;

  return (
    <div className="rounded-2xl border p-6" style={{ background: 'var(--gs-card)', borderColor: 'var(--gs-border)' }}>
      <p className="text-sm font-semibold mb-5" style={{ color: 'var(--gs-text)' }}>Current Streaks</p>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        {streaks.map(({ goal, streak, color }) => (
          <div key={goal.id} className="rounded-xl border p-4" style={{ background: 'var(--gs-card2)', borderColor: 'var(--gs-border)' }}>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-lg">{goal.emoji}</span>
              <span className="text-xs truncate" style={{ color: 'var(--gs-text-dim)' }}>{goal.title}</span>
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-bold" style={{ color }}>{streak}</span>
              <span className="text-xs" style={{ color: 'var(--gs-text-dim)' }}>day{streak !== 1 ? 's' : ''}</span>
            </div>
            {streak === 0 && (
              <p className="text-[10px] mt-1" style={{ color: 'var(--gs-text-faint)' }}>No active streak</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
