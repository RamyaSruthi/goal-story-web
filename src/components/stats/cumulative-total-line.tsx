'use client';

import { useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { JournalEntry } from '@/types';
import { cumulativeTotal } from '@/lib/chart-utils';
import { useTheme } from 'next-themes';

interface Props {
  journals: JournalEntry[];
  color: string;
}

function fmtDateLabel(dateStr: string) {
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export function CumulativeTotalLine({ journals, color }: Props) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const gridColor = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.07)';
  const tickColor = isDark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.35)';
  const tooltipBg = isDark ? '#161616' : '#ffffff';
  const tooltipBorder = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)';

  const data = useMemo(() => cumulativeTotal(journals), [journals]);

  return (
    <div className="rounded-2xl border p-6" style={{ background: 'var(--gs-card)', borderColor: 'var(--gs-border)' }}>
      <p className="text-sm font-semibold mb-5" style={{ color: 'var(--gs-text)' }}>Cumulative Hours</p>

      {data.length === 0 ? (
        <div className="h-[180px] flex items-center justify-center text-sm" style={{ color: 'var(--gs-text-faint)' }}>
          No data yet
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={180}>
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
                  <div className="rounded-xl px-3 py-2 text-xs shadow-lg" style={{ background: tooltipBg, border: `1px solid ${tooltipBorder}` }}>
                    <p style={{ color: 'var(--gs-text-dim)' }}>{fmtDateLabel(label as string)}</p>
                    <p className="font-semibold mt-0.5" style={{ color: 'var(--gs-text)' }}>{payload[0].value}h total</p>
                  </div>
                );
              }}
            />
            <Line type="monotone" dataKey="hours" stroke={color} strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
