'use client';

import { useStore } from '@/store/use-store';
import { GoalCard } from '@/components/goals/goal-card';

export default function ArchivedPage() {
  const { goals, isLoading } = useStore();
  const archivedGoals = goals.filter((g) => g.archived);

  return (
    <div className="px-4 py-6 md:px-8 md:py-8 animate-fade-in">
      <div className="mb-8">
        <h1
          className="font-black tracking-tight"
          style={{ fontSize: 36, letterSpacing: '-0.03em', color: 'var(--gs-text)' }}
        >
          Archived
        </h1>
        <p className="text-sm mt-1" style={{ color: 'var(--gs-text-sub)' }}>
          Goals you&apos;ve paused — restore them anytime.
        </p>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {[1, 2].map((i) => (
            <div key={i} className="h-40 rounded-2xl animate-shimmer" style={{ background: 'var(--gs-card)' }} />
          ))}
        </div>
      ) : archivedGoals.length === 0 ? (
        <div
          className="rounded-2xl border p-16 text-center"
          style={{ background: 'var(--gs-card)', borderColor: 'var(--gs-border)', borderStyle: 'dashed' }}
        >
          <p className="text-4xl mb-4">📦</p>
          <p className="font-semibold text-lg mb-1" style={{ color: 'var(--gs-text)' }}>No archived goals</p>
          <p className="text-sm" style={{ color: 'var(--gs-text-dim)' }}>
            Archive a goal from the Goals page to pause it for a while.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
          {archivedGoals.map((goal) => (
            <div key={goal.id} className="space-y-2">
              {goal.archiveReason && (
                <div
                  className="flex items-start gap-2 px-3 py-2 rounded-xl text-xs"
                  style={{ background: 'var(--gs-accent-bg)', border: '1px solid var(--gs-accent-border)' }}
                >
                  <span style={{ color: 'var(--gs-accent)' }}>💬</span>
                  <p style={{ color: 'var(--gs-text-sub)' }}>
                    <span className="font-semibold" style={{ color: 'var(--gs-accent)' }}>Why you paused: </span>
                    {goal.archiveReason}
                  </p>
                </div>
              )}
              <div className="opacity-60">
                <GoalCard goal={goal} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
