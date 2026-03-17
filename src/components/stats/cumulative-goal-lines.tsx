'use client';

import { useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { JournalEntry, Goal } from '@/types';
import { cumulativePerGoal } from '@/lib/chart-utils';
import { useTheme } from 'next-themes';

interface Props {
  journals: JournalEntry[];
  goals: Goal[];
  palette: string[];
}

function fmtDateLabel(dateStr: string) {
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export function CumulativeGoalLines({ journals, goals, palette }: Props) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const gridColor = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.07)';
  const tickColor = isDark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.35)';
  const tooltipBg = isDark ? '#161616' : '#ffffff';
  const tooltipBorder = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)';

  const data = useMemo(() => cumulativePerGoal(journals, goals), [journals, goals]);

  return (
    <div className="rounded-2xl border p-6" style={{ background: 'var(--gs-card)', borderColor: 'var(--gs-border)' }}>
      <p className="text-sm font-semibold mb-5" style={{ color: 'var(--gs-text)' }}>Cumulative Hours per Goal</p>

      {data.length === 0 ? (
        <div className="h-[220px] flex items-center justify-center text-sm" style={{ color: 'var(--gs-text-faint)' }}>
          No data yet
        </div>
      ) : (
        <>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={data} margin={{ top: 4, right: 4, left: -16, bottom: 0 }}>
              <CartesianGrid stroke={gridColor} strokeDasharray="3 3" />
              <XAxis dataKey="date" tick={{ fontSize: 10, fill: tickColor }} axisLine={false} tickLine={false}
                interval="preserveStartEnd" tickFormatter={fmtDateLabel} />
              <YAxis tick={{ fontSize: 10, fill: tickColor }} axisLine={false} tickLine={false}
                tickFormatter={(v) => `${v}h`} />
              <Tooltip
                content={({ active, payload, label }) => {
                  if (!active || !payload?.length) return null;
                  return (
                    <div className="rounded-xl px-3 py-2 text-xs shadow-lg space-y-1" style={{ background: tooltipBg, border: `1px solid ${tooltipBorder}` }}>
                      <p className="mb-1.5" style={{ color: 'var(--gs-text-dim)' }}>{fmtDateLabel(label as string)}</p>
                      {payload.map((p) => {
                        const goal = goals.find((g) => g.id === p.dataKey);
                        return (
                          <div key={p.dataKey as string} className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-sm shrink-0" style={{ background: p.stroke as string }} />
                            <span style={{ color: 'var(--gs-text-dim)' }}>{goal?.emoji} {goal?.title}</span>
                            <span className="ml-auto font-semibold pl-3" style={{ color: 'var(--gs-text)' }}>{p.value}h</span>
                          </div>
                        );
                      })}
                    </div>
                  );
                }}
              />
              {goals.map((g, i) => (
                <Line key={g.id} type="monotone" dataKey={g.id} name={g.title}
                  stroke={palette[i % palette.length]} strokeWidth={2} dot={false} />
              ))}
            </LineChart>
          </ResponsiveContainer>

          {/* Legend */}
          <div className="flex flex-wrap gap-3 mt-4">
            {goals.map((g, i) => (
              <div key={g.id} className="flex items-center gap-1.5 text-xs">
                <div className="w-3 h-0.5 rounded-full" style={{ background: palette[i % palette.length] }} />
                <span style={{ color: 'var(--gs-text-dim)' }}>{g.emoji} {g.title}</span>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
