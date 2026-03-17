'use client';

import { useState } from 'react';
import { useStore } from '@/store/use-store';
import { useTheme } from 'next-themes';
import { DARK_PALETTE, LIGHT_PALETTE } from '@/lib/theme';
import { resolveGoalColor } from '@/lib/utils';
import { TimeBarChart } from '@/components/stats/time-bar-chart';
import { StackedGoalsBar } from '@/components/stats/stacked-goals-bar';
import { DonutTimeSplit } from '@/components/stats/donut-time-split';
import { CumulativeTotalLine } from '@/components/stats/cumulative-total-line';
import { ProgressRings } from '@/components/stats/progress-rings';
import { ProgressBars } from '@/components/stats/progress-bars';
import { StreakDisplay } from '@/components/stats/streak-display';
import { CumulativeGoalLines } from '@/components/stats/cumulative-goal-lines';
import { TreemapView } from '@/components/stats/treemap-view';
import { CalendarMonth } from '@/components/stats/calendar-month';

const TABS = ['Time', 'Progress', 'Overview'] as const;
type Tab = typeof TABS[number];

export default function StatsPage() {
  const { journals, goals } = useStore();
  const { theme } = useTheme();
  const [tab, setTab] = useState<Tab>('Time');

  const palette = goals.map((g, i) =>
    resolveGoalColor(g.color, theme ?? 'dark') || (theme === 'dark' ? DARK_PALETTE : LIGHT_PALETTE)[i % 5]
  );
  const accentColor = theme === 'dark' ? '#818CF8' : '#5B52B0';

  return (
    <div className="px-4 py-6 md:px-8 md:py-8 animate-fade-in">
      <div className="mb-8">
        <h1 className="font-black tracking-tight" style={{ fontSize: 36, letterSpacing: '-0.03em', color: 'var(--gs-text)' }}>Stats</h1>
        <p className="text-sm mt-1" style={{ color: 'var(--gs-text-sub)' }}>Visual insights into your goals</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-8">
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className="px-4 py-2 rounded-xl text-sm font-medium transition-colors"
            style={{
              background: tab === t ? 'var(--gs-accent-bg)' : 'transparent',
              color: tab === t ? 'var(--gs-accent)' : 'var(--gs-text-dim)',
              border: `1px solid ${tab === t ? 'var(--gs-accent-border)' : 'transparent'}`,
            }}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === 'Time' && (
        <div className="space-y-6">
          <TimeBarChart journals={journals} color={accentColor} />
          <StackedGoalsBar journals={journals} goals={goals} palette={palette} />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <DonutTimeSplit journals={journals} goals={goals} palette={palette} />
            <CumulativeTotalLine journals={journals} color={accentColor} />
          </div>
        </div>
      )}

      {tab === 'Progress' && (
        <div className="space-y-6">
          <ProgressRings goals={goals} palette={palette} />
          <ProgressBars goals={goals} palette={palette} />
          <StreakDisplay goals={goals} journals={journals} palette={palette} />
          <CumulativeGoalLines journals={journals} goals={goals} palette={palette} />
        </div>
      )}

      {tab === 'Overview' && (
        <div className="space-y-6">
          <TreemapView journals={journals} goals={goals} palette={palette} />
          <CalendarMonth journals={journals} color={accentColor} />
        </div>
      )}
    </div>
  );
}
