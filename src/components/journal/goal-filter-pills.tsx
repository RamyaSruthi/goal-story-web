'use client';

import { Goal } from '@/types';
import { resolveGoalColor } from '@/lib/utils';
import { useTheme } from 'next-themes';

interface Props {
  goals: Goal[];
  selectedId: string | null;
  onSelect: (id: string | null) => void;
}

export function GoalFilterPills({ goals, selectedId, onSelect }: Props) {
  const { theme } = useTheme();

  return (
    <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
      <button
        onClick={() => onSelect(null)}
        className="shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-colors"
        style={{
          background: selectedId === null ? 'var(--gs-accent)' : 'var(--gs-card)',
          color: selectedId === null ? '#fff' : 'var(--gs-text-sub)',
          border: `1px solid ${selectedId === null ? 'transparent' : 'var(--gs-border)'}`,
        }}
      >
        All
      </button>
      {goals.map((g) => {
        const color = resolveGoalColor(g.color, theme ?? 'dark');
        const active = selectedId === g.id;
        return (
          <button
            key={g.id}
            onClick={() => onSelect(g.id)}
            className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-colors"
            style={{
              background: active ? `${g.color}22` : 'var(--gs-card)',
              color: active ? color : 'var(--gs-text-sub)',
              border: `1px solid ${active ? `${g.color}44` : 'var(--gs-border)'}`,
            }}
          >
            <span>{g.emoji}</span>
            {g.title}
          </button>
        );
      })}
    </div>
  );
}
