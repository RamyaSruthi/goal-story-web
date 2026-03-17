'use client';

import { useMemo, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { JournalEntry } from '@/types';
import { aggregateByPeriod, fmtHours } from '@/lib/chart-utils';
import { useTheme } from 'next-themes';

type Period = 'day' | 'week' | 'month';

interface Props {
  journals: JournalEntry[];
  color: string;
}

const LIMITS: Record<Period, number> = { day: 30, week: 16, month: 24 };

export function TimeBarChart({ journals, color }: Props) {
  const [period, setPeriod] = useState<Period>('week');
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const gridColor = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.07)';
  const tickColor = isDark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.35)';
  const tooltipBg = isDark ? '#161616' : '#ffffff';
  const tooltipBorder = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)';

  const data = useMemo(
    () => aggregateByPeriod(journals, period).slice(-LIMITS[period]),
    [journals, period]
  );

  return (
    <div className="rounded-2xl border p-6" style={{ background: 'var(--gs-card)', borderColor: 'var(--gs-border)' }}>
      <div className="flex items-center justify-between mb-5">
        <p className="text-sm font-semibold" style={{ color: 'var(--gs-text)' }}>Time Spent</p>
        <div className="flex gap-1">
          {(['day', 'week', 'month'] as Period[]).map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className="px-3 py-1 rounded-lg text-xs font-medium capitalize transition-colors"
              style={{
                background: period === p ? 'var(--gs-accent-bg)' : 'transparent',
                color: period === p ? 'var(--gs-accent)' : 'var(--gs-text-dim)',
                border: `1px solid ${period === p ? 'var(--gs-accent-border)' : 'transparent'}`,
              }}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

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
                  <div className="rounded-xl px-3 py-2 text-xs shadow-lg" style={{ background: tooltipBg, border: `1px solid ${tooltipBorder}` }}>
                    <p style={{ color: 'var(--gs-text-dim)' }}>{label}</p>
                    <p className="font-semibold mt-0.5" style={{ color: 'var(--gs-text)' }}>{fmtHours(payload[0].value as number)}</p>
                  </div>
                );
              }}
            />
            <Bar dataKey="mins" fill={color} radius={[4, 4, 0, 0]} maxBarSize={40} />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
