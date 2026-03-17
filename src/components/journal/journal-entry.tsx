'use client';

import { useState } from 'react';
import { JournalEntry as JournalEntryType } from '@/types';
import { useStore } from '@/store/use-store';
import { useTheme } from 'next-themes';
import { resolveGoalColor, fmtMins } from '@/lib/utils';
import { Trash2 } from 'lucide-react';

interface Props {
  entry: JournalEntryType;
  isLast: boolean;
}

export function JournalEntry({ entry, isLast }: Props) {
  const { goals, removeJournal } = useStore();
  const { theme } = useTheme();
  const [confirming, setConfirming] = useState(false);

  const goal = goals.find((g) => g.id === entry.goalId);
  const color = goal ? resolveGoalColor(goal.color, theme ?? 'dark') : 'var(--gs-text-dim)';

  const handleDelete = () => {
    if (!confirming) { setConfirming(true); return; }
    removeJournal(entry.id);
  };

  return (
    <div>
      <div className="px-4 py-3 flex items-start gap-3 group">
        {/* Goal color dot */}
        <div
          className="w-2 h-2 rounded-full mt-1.5 shrink-0"
          style={{ background: color }}
        />

        <div className="flex-1 min-w-0">
          {/* Goal name + time */}
          <div className="flex items-center gap-2 mb-0.5">
            {goal && (
              <span className="text-xs font-semibold" style={{ color }}>
                {goal.emoji} {goal.title}
              </span>
            )}
            <span
              className="text-xs font-medium px-1.5 py-0.5 rounded-md"
              style={{ background: 'var(--gs-card2)', color: 'var(--gs-text-dim)' }}
            >
              {fmtMins(entry.minutesSpent)}
            </span>
          </div>

          {/* Task title */}
          <p className="text-sm font-medium" style={{ color: 'var(--gs-text)' }}>
            {entry.taskTitle}
          </p>

          {/* Note */}
          {entry.note && (
            <p className="text-xs mt-1 italic leading-relaxed" style={{ color: 'var(--gs-text-sub)' }}>
              &ldquo;{entry.note}&rdquo;
            </p>
          )}
        </div>

        {/* Delete button */}
        <button
          onClick={handleDelete}
          onBlur={() => setConfirming(false)}
          className="shrink-0 p-1.5 rounded-lg transition-opacity opacity-0 group-hover:opacity-100"
          style={{ color: confirming ? '#EF4444' : 'var(--gs-text-dim)' }}
          title={confirming ? 'Click again to confirm' : 'Delete entry'}
        >
          <Trash2 size={13} />
        </button>
      </div>
      {!isLast && <div className="mx-4 h-px" style={{ background: 'var(--gs-border)' }} />}
    </div>
  );
}
