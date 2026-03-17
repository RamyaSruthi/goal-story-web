'use client';

import { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { JournalEntry, Goal } from '@/types';
import { stackedWeeklyData, fmtHours } from '@/lib/chart-utils';
import { useTheme } from 'next-themes';

interface Props {
  journals: JournalEntry[];
  goals: Goal[];
  palette: string[];
}

export function StackedGoalsBar({ journals, goals, palette }: Props) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const gridColor = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.07)';
  const tickColor = isDark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.35)';
  const tooltipBg = isDark ? '#161616' : '#ffffff';
  const tooltipBorder = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)';

  const data = useMemo(() => stackedWeeklyData(journals).slice(-12), [journals]);

  return (
    <div className="rounded-2xl border p-6" style={{ background: 'var(--gs-card)', borderColor: 'var(--gs-border)' }}>
      <p className="text-sm font-semibold mb-5" style={{ color: 'var(--gs-text)' }}>Weekly Breakdown by Goal</p>

      {data.length === 0 ? (
        <div className="h-[200px] flex items-center justify-center text-sm" style={{ color: 'var(--gs-text-faint)' }}>
          No data yet
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={data} margin={{ top: 4, right: 4, left: -16, bottom: 0 }}>
            <CartesianGrid vertical={false} stroke={gridColor} />
            <XAxis dataKey="label" tick={{ fontSize: 10, fill: tickColor }} axisLine={false} tickLine={false} interval="preserveStartEnd" />
            <YAxis tick={{ fontSize: 10, fill: tickColor }} axisLine={false} tickLine={false} tickFormatter={(v) => v >= 60 ? `${Math.round(v / 60)}h` : `${v}m`} />
            <Tooltip
              cursor={{ fill: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)' }}
              content={({ active, payload, label }) => {
                if (!active || !payload?.length) return null;
                return (
                  <div className="rounded-xl px-3 py-2 text-xs shadow-lg space-y-1" style={{ background: tooltipBg, border: `1px solid ${tooltipBorder}` }}>
                    <p className="mb-1.5" style={{ color: 'var(--gs-text-dim)' }}>{label}</p>
                    {payload.map((p) => {
                      const goal = goals.find((g) => g.id === p.dataKey);
                      return (
                        <div key={p.dataKey as string} className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-sm shrink-0" style={{ background: p.fill as string }} />
                          <span style={{ color: 'var(--gs-text-dim)' }}>{goal?.emoji} {goal?.title}</span>
                          <span className="ml-auto font-semibold pl-3" style={{ color: 'var(--gs-text)' }}>{fmtHours(p.value as number)}</span>
                        </div>
                      );
                    })}
                  </div>
                );
              }}
            />
            {goals.map((g, i) => (
              <Bar key={g.id} dataKey={g.id} stackId="stack" fill={palette[i % palette.length]} maxBarSize={40}
                radius={i === goals.length - 1 ? [4, 4, 0, 0] : [0, 0, 0, 0]} />
            ))}
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
