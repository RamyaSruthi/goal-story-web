'use client';

import { Goal } from '@/types';

interface Props {
  goals: Goal[];
  palette: string[];
}

export function ProgressBars({ goals, palette }: Props) {
  if (goals.length === 0) return null;

  return (
    <div className="rounded-2xl border p-6" style={{ background: 'var(--gs-card)', borderColor: 'var(--gs-border)' }}>
      <p className="text-sm font-semibold mb-5" style={{ color: 'var(--gs-text)' }}>Progress Bars</p>
      <div className="space-y-4">
        {goals.map((g, i) => {
          const total = g.tasks.length;
          const done = g.tasks.filter((t) => t.done).length;
          const pct = total > 0 ? (done / total) * 100 : 0;
          const color = palette[i % palette.length];

          return (
            <div key={g.id}>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-sm" style={{ color: 'var(--gs-text)' }}>
                  {g.emoji} {g.title}
                </span>
                <span className="text-xs font-medium" style={{ color: 'var(--gs-text-dim)' }}>
                  {done}/{total} tasks
                </span>
              </div>
              <div className="h-2 rounded-full overflow-hidden" style={{ background: 'var(--gs-border-mid)' }}>
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{ width: `${pct}%`, background: color }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
