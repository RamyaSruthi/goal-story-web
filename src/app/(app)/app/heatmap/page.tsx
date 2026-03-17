'use client';

import { useMemo } from 'react';
import { useStore } from '@/store/use-store';
import { ActivityHeatmap } from '@/components/heatmap/activity-heatmap';
import { resolveGoalColor } from '@/lib/utils';
import { useTheme } from 'next-themes';

export default function HeatmapPage() {
  const { journals, goals } = useStore();
  const { theme } = useTheme();

  const goalSections = useMemo(() =>
    goals.map((goal) => ({
      goal,
      journals: journals.filter((j) => j.goalId === goal.id),
      color: resolveGoalColor(goal.color, theme ?? 'dark'),
    })),
    [goals, journals, theme]
  );

  return (
    <div className="px-4 py-6 md:px-8 md:py-8 animate-fade-in space-y-12">
      <div>
        <h1 className="font-black tracking-tight" style={{ fontSize: 36, letterSpacing: '-0.03em', color: 'var(--gs-text)' }}>Heatmap</h1>
        <p className="text-sm mt-1" style={{ color: 'var(--gs-text-sub)' }}>Daily activity by year</p>
      </div>

      {goalSections.map(({ goal, journals: gj, color }) => (
        <section key={goal.id} className="space-y-4">
          <h2 className="text-lg font-semibold flex items-center gap-2" style={{ color: 'var(--gs-text)' }}>
            <span>{goal.emoji}</span>
            <span>{goal.title}</span>
          </h2>
          <ActivityHeatmap journals={gj} color={color} />
        </section>
      ))}
    </div>
  );
}
