'use client';

import { useState } from 'react';
import { useStore } from '@/store/use-store';
import { GoalCard } from '@/components/goals/goal-card';
import { AddGoalDialog } from '@/components/goals/add-goal-dialog';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

export default function GoalsPage() {
  const { goals, isLoading } = useStore();
  const [addOpen, setAddOpen] = useState(false);
  const activeGoals = goals.filter((g) => !g.achieved && !g.archived);
  const achievedGoals = goals.filter((g) => g.achieved && !g.archived);
  const archivedCount = goals.filter((g) => g.archived).length;

  return (
    <div className="px-4 py-6 md:px-8 md:py-8 animate-fade-in">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold" style={{ color: 'var(--gs-text)' }}>Goals</h1>
          <p className="text-sm mt-0.5" style={{ color: 'var(--gs-text-dim)' }}>
            {activeGoals.length} active
            {achievedGoals.length > 0 ? ` · ${achievedGoals.length} achieved` : ''}
            {archivedCount > 0 ? ` · ${archivedCount} archived` : ''}
          </p>
        </div>
        <Button
          onClick={() => setAddOpen(true)}
          size="sm"
          className="gap-2 font-semibold rounded-xl h-9 px-4"
          style={{ background: 'var(--gs-accent)', color: '#fff' }}
        >
          <Plus size={15} />
          New goal
        </Button>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-40 rounded-2xl animate-shimmer" style={{ background: 'var(--gs-card)' }} />
          ))}
        </div>
      ) : (
        <>
          {activeGoals.length === 0 && achievedGoals.length === 0 ? (
            <div
              className="rounded-2xl border p-16 text-center"
              style={{ background: 'var(--gs-card)', borderColor: 'var(--gs-border)', borderStyle: 'dashed' }}
            >
              <p className="text-5xl mb-4">🎯</p>
              <p className="font-semibold text-lg mb-2" style={{ color: 'var(--gs-text)' }}>
                No goals yet
              </p>
              <p className="text-sm mb-6" style={{ color: 'var(--gs-text-dim)' }}>
                Create your first goal to start tracking progress
              </p>
              <Button
                onClick={() => setAddOpen(true)}
                className="gap-2 font-semibold rounded-xl"
                style={{ background: 'var(--gs-accent)', color: '#fff' }}
              >
                <Plus size={15} /> Create goal
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
              {activeGoals.map((goal) => <GoalCard key={goal.id} goal={goal} />)}
            </div>
          )}

          {achievedGoals.length > 0 && (
            <div className="mt-10">
              <div className="flex items-center gap-3 mb-4">
                <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: 'var(--gs-text-dim)' }}>
                  Achieved
                </p>
                <span className="text-sm">🏆</span>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 opacity-55">
                {achievedGoals.map((goal) => <GoalCard key={goal.id} goal={goal} />)}
              </div>
            </div>
          )}

        </>
      )}

      <AddGoalDialog open={addOpen} onClose={() => setAddOpen(false)} />
    </div>
  );
}
