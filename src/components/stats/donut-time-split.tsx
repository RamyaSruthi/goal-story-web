'use client';

import { useMemo } from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { JournalEntry, Goal } from '@/types';
import { timePerGoal, fmtHours } from '@/lib/chart-utils';
import { useTheme } from 'next-themes';

interface Props {
  journals: JournalEntry[];
  goals: Goal[];
  palette: string[];
}

export function DonutTimeSplit({ journals, goals, palette }: Props) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const tooltipBg = isDark ? '#161616' : '#ffffff';
  const tooltipBorder = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)';

  const data = useMemo(() => timePerGoal(journals, goals, palette), [journals, goals, palette]);
  const totalMins = useMemo(() => data.reduce((s, g) => s + g.mins, 0), [data]);

  return (
    <div className="rounded-2xl border p-6" style={{ background: 'var(--gs-card)', borderColor: 'var(--gs-border)' }}>
      <p className="text-sm font-semibold mb-5" style={{ color: 'var(--gs-text)' }}>Time Split</p>

      {data.length === 0 ? (
        <div className="h-[180px] flex items-center justify-center text-sm" style={{ color: 'var(--gs-text-faint)' }}>
          No data yet
        </div>
      ) : (
        <>
          <div className="relative">
            <ResponsiveContainer width="100%" height={180}>
              <PieChart>
                <Pie data={data} dataKey="mins" nameKey="name" innerRadius="55%" outerRadius="80%" paddingAngle={3} strokeWidth={0}>
                  {data.map((entry) => (
                    <Cell key={entry.id} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  content={({ active, payload }) => {
                    if (!active || !payload?.length) return null;
                    const d = payload[0].payload;
                    return (
                      <div className="rounded-xl px-3 py-2 text-xs shadow-lg" style={{ background: tooltipBg, border: `1px solid ${tooltipBorder}` }}>
                        <p style={{ color: 'var(--gs-text-dim)' }}>{d.emoji} {d.name}</p>
                        <p className="font-semibold mt-0.5" style={{ color: 'var(--gs-text)' }}>{fmtHours(d.mins)}</p>
                      </div>
                    );
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="text-center">
                <p className="text-xl font-bold" style={{ color: 'var(--gs-text)' }}>{fmtHours(totalMins)}</p>
                <p className="text-[10px]" style={{ color: 'var(--gs-text-dim)' }}>total</p>
              </div>
            </div>
          </div>

          <div className="mt-4 space-y-2">
            {data.map((g) => (
              <div key={g.id} className="flex items-center gap-2 text-xs">
                <div className="w-2.5 h-2.5 rounded-sm shrink-0" style={{ background: g.color }} />
                <span style={{ color: 'var(--gs-text-dim)' }}>{g.emoji} {g.name}</span>
                <span className="ml-auto font-medium" style={{ color: 'var(--gs-text)' }}>{fmtHours(g.mins)}</span>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
