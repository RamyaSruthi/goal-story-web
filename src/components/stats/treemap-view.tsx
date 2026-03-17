'use client';

import { useMemo } from 'react';
import { Treemap, ResponsiveContainer } from 'recharts';
import { JournalEntry, Goal } from '@/types';
import { timePerGoal, fmtHours } from '@/lib/chart-utils';

interface Props {
  journals: JournalEntry[];
  goals: Goal[];
  palette: string[];
}

function CustomContent(props: {
  x?: number; y?: number; width?: number; height?: number;
  name?: string; emoji?: string; color?: string; mins?: number;
}) {
  const { x = 0, y = 0, width = 0, height = 0, name, emoji, color, mins } = props;
  if (width < 4 || height < 4) return <g />;

  const showFull = width > 80 && height > 60;
  const showEmoji = width > 30 && height > 30;

  return (
    <g>
      <rect x={x + 1} y={y + 1} width={width - 2} height={height - 2} fill={color} rx={8} />
      {showFull && (
        <>
          <text x={x + width / 2} y={y + height / 2 - 14} textAnchor="middle" fill="rgba(255,255,255,0.95)" fontSize={20}>{emoji}</text>
          <text x={x + width / 2} y={y + height / 2 + 4} textAnchor="middle" fill="rgba(255,255,255,0.95)" fontSize={11} fontWeight="600">{name}</text>
          <text x={x + width / 2} y={y + height / 2 + 18} textAnchor="middle" fill="rgba(255,255,255,0.65)" fontSize={10}>{fmtHours(mins ?? 0)}</text>
        </>
      )}
      {!showFull && showEmoji && (
        <text x={x + width / 2} y={y + height / 2} textAnchor="middle" dominantBaseline="middle" fill="rgba(255,255,255,0.95)" fontSize={16}>{emoji}</text>
      )}
    </g>
  );
}

export function TreemapView({ journals, goals, palette }: Props) {
  const data = useMemo(() => timePerGoal(journals, goals, palette), [journals, goals, palette]);

  return (
    <div className="rounded-2xl border p-6" style={{ background: 'var(--gs-card)', borderColor: 'var(--gs-border)' }}>
      <p className="text-sm font-semibold mb-5" style={{ color: 'var(--gs-text)' }}>Time Distribution</p>

      {data.length === 0 ? (
        <div className="h-[260px] flex items-center justify-center text-sm" style={{ color: 'var(--gs-text-faint)' }}>
          No data yet
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={260}>
          <Treemap
            data={data.map((g) => ({ ...g, value: g.mins }))}
            dataKey="value"
            aspectRatio={4 / 3}
            content={<CustomContent />}
          />
        </ResponsiveContainer>
      )}
    </div>
  );
}
