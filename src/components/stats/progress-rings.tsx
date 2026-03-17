'use client';

import { Goal } from '@/types';

interface Props {
  goals: Goal[];
  palette: string[];
}

const SIZE = 88;
const CX = SIZE / 2;
const CY = SIZE / 2;
const R = 34;
const SW = 7;
const CIRCUMFERENCE = 2 * Math.PI * R;

function Ring({ goal, color }: { goal: Goal; color: string }) {
  const total = goal.tasks.length;
  const done = goal.tasks.filter((t) => t.done).length;
  const progress = total > 0 ? done / total : 0;
  const dashOffset = CIRCUMFERENCE * (1 - progress);

  return (
    <div className="flex flex-col items-center gap-2 p-4 rounded-2xl border"
      style={{ background: 'var(--gs-card2)', borderColor: 'var(--gs-border)' }}>
      <svg width={SIZE} height={SIZE} viewBox={`0 0 ${SIZE} ${SIZE}`}>
        {/* Track */}
        <circle cx={CX} cy={CY} r={R} fill="none" stroke="var(--gs-border-mid)" strokeWidth={SW} />
        {/* Progress */}
        <circle
          cx={CX} cy={CY} r={R} fill="none"
          stroke={color} strokeWidth={SW}
          strokeDasharray={CIRCUMFERENCE}
          strokeDashoffset={dashOffset}
          strokeLinecap="round"
          transform={`rotate(-90 ${CX} ${CY})`}
          style={{ transition: 'stroke-dashoffset 0.4s ease' }}
        />
        {/* Emoji */}
        <text x={CX} y={CY - 4} textAnchor="middle" dominantBaseline="middle" fontSize={22}>{goal.emoji}</text>
        {/* Percent */}
        <text x={CX} y={CY + 16} textAnchor="middle" fontSize={10} fontWeight={600} fill={color}>
          {Math.round(progress * 100)}%
        </text>
      </svg>
      <p className="text-xs font-medium text-center leading-tight" style={{ color: 'var(--gs-text)' }}>{goal.title}</p>
      <p className="text-[10px]" style={{ color: 'var(--gs-text-dim)' }}>{done} / {total} tasks</p>
    </div>
  );
}

export function ProgressRings({ goals, palette }: Props) {
  if (goals.length === 0) {
    return (
      <div className="rounded-2xl border p-6" style={{ background: 'var(--gs-card)', borderColor: 'var(--gs-border)' }}>
        <p className="text-sm font-semibold mb-2" style={{ color: 'var(--gs-text)' }}>Task Completion</p>
        <p className="text-sm" style={{ color: 'var(--gs-text-faint)' }}>No goals yet</p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border p-6" style={{ background: 'var(--gs-card)', borderColor: 'var(--gs-border)' }}>
      <p className="text-sm font-semibold mb-5" style={{ color: 'var(--gs-text)' }}>Task Completion</p>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
        {goals.map((g, i) => (
          <Ring key={g.id} goal={g} color={palette[i % palette.length]} />
        ))}
      </div>
    </div>
  );
}
