'use client';

import { useState, useMemo } from 'react';
import { useStore } from '@/store/use-store';
import { JournalEntry } from '@/components/journal/journal-entry';
import { GoalFilterPills } from '@/components/journal/goal-filter-pills';
import { fmtMins } from '@/lib/utils';

export default function JournalPage() {
  const { journals, goals, isLoading } = useStore();
  const [selectedGoalId, setSelectedGoalId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    if (!selectedGoalId) return journals;
    return journals.filter((j) => j.goalId === selectedGoalId);
  }, [journals, selectedGoalId]);

  const grouped = useMemo(() => {
    const map = new Map<string, typeof filtered>();
    for (const entry of filtered) {
      const list = map.get(entry.date) ?? [];
      list.push(entry);
      map.set(entry.date, list);
    }
    return Array.from(map.entries()).sort(([a], [b]) => b.localeCompare(a));
  }, [filtered]);

  const totalMins = filtered.reduce((s, j) => s + j.minutesSpent, 0);

  const formatGroupDate = (date: string) => {
    const d = new Date(date + 'T00:00:00');
    const today = new Date(); today.setHours(0, 0, 0, 0);
    const diff = Math.floor((today.getTime() - d.getTime()) / 86400000);
    if (diff === 0) return 'Today';
    if (diff === 1) return 'Yesterday';
    return d.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' });
  };

  return (
    <div className="max-w-4xl mx-auto px-8 py-8 animate-fade-in">
      <div className="mb-8">
        <h1 className="font-black tracking-tight" style={{ fontSize: 36, letterSpacing: '-0.03em', color: 'var(--gs-text)' }}>Journal</h1>
        <p className="text-sm mt-1" style={{ color: 'var(--gs-text-sub)' }}>
          {totalMins > 0 ? `${fmtMins(totalMins)} total${selectedGoalId ? ' for this goal' : ''}` : 'Your work history'}
        </p>
      </div>

      {goals.length > 0 && (
        <div className="mb-8">
          <GoalFilterPills goals={goals} selectedId={selectedGoalId} onSelect={setSelectedGoalId} />
        </div>
      )}

      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-16 rounded-xl animate-shimmer" style={{ background: 'var(--gs-card)' }} />
          ))}
        </div>
      ) : grouped.length === 0 ? (
        <div
          className="rounded-2xl border p-16 text-center"
          style={{ background: 'var(--gs-card)', borderColor: 'var(--gs-border)', borderStyle: 'dashed' }}
        >
          <p className="text-4xl mb-4">📓</p>
          <p className="font-semibold text-lg mb-1" style={{ color: 'var(--gs-text)' }}>No entries yet</p>
          <p className="text-sm" style={{ color: 'var(--gs-text-dim)' }}>
            Complete a timer session to create your first entry
          </p>
        </div>
      ) : (
        <div className="space-y-8">
          {grouped.map(([date, entries]) => (
            <div key={date}>
              <div className="flex items-center gap-3 mb-4">
                <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: 'var(--gs-text-dim)' }}>
                  {formatGroupDate(date)}
                </p>
                <div className="flex-1 h-px" style={{ background: 'var(--gs-border)' }} />
                <span className="text-xs" style={{ color: 'var(--gs-text-faint)' }}>
                  {fmtMins(entries.reduce((s, e) => s + e.minutesSpent, 0))}
                </span>
              </div>
              <div className="rounded-2xl border overflow-hidden" style={{ background: 'var(--gs-card)', borderColor: 'var(--gs-border)' }}>
                {entries.map((entry, i) => (
                  <JournalEntry key={entry.id} entry={entry} isLast={i === entries.length - 1} />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
