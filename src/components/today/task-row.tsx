'use client';

import { useState } from 'react';
import { Goal, Task } from '@/types';
import { resolveGoalColor } from '@/lib/utils';
import { useTheme } from 'next-themes';
import { TimerDialog } from '@/components/timer/timer-dialog';
import { QuickLogDialog } from './quick-log-dialog';
import { EditTaskDialog } from './edit-task-dialog';
import { Play, Pencil } from 'lucide-react';

interface Props {
  goal: Goal;
  task: Task;
}

export function TaskRow({ goal, task }: Props) {
  const { theme } = useTheme();
  const color = resolveGoalColor(goal.color, theme ?? 'dark');
  const [timerOpen, setTimerOpen] = useState(false);
  const [quickLogOpen, setQuickLogOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);

  return (
    <>
      <div
        className="flex items-center gap-3 px-3 py-2.5 rounded-xl group transition-colors hover:bg-[var(--gs-card2)]"
        style={{ background: 'transparent' }}
      >
        {/* Checkbox */}
        <button
          onClick={() => !task.done && setQuickLogOpen(true)}
          className="w-[18px] h-[18px] rounded-[5px] border-2 shrink-0 flex items-center justify-center transition-all"
          style={{
            borderColor: task.done ? color : 'var(--gs-border-mid)',
            background: task.done ? color : 'transparent',
          }}
        >
          {task.done && (
            <svg width="9" height="7" viewBox="0 0 9 7" fill="none">
              <path d="M1 3.5l2.5 2.5 4.5-5" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          )}
        </button>

        {/* Title */}
        <span
          className="flex-1 text-sm min-w-0 truncate leading-snug"
          style={{
            color: task.done ? 'var(--gs-text-dim)' : 'var(--gs-text)',
            textDecoration: task.done ? 'line-through' : 'none',
            textDecorationColor: 'var(--gs-text-dim)',
          }}
        >
          {task.title}
        </span>

        {/* Estimate badge */}
        {task.estimatedMins > 0 && (
          <span
            className="text-[11px] px-1.5 py-0.5 rounded-md shrink-0"
            style={{ background: 'var(--gs-card)', color: 'var(--gs-text-dim)', border: '1px solid var(--gs-border)' }}
          >
            {task.estimatedMins}m
          </span>
        )}

        {/* Actions */}
        <div className="flex items-center gap-1 shrink-0">
          <button
            onClick={() => setEditOpen(true)}
            className="p-1.5 rounded-lg hover:bg-[var(--gs-card)] transition-colors"
            title="Edit"
          >
            <Pencil size={11} style={{ color: 'var(--gs-text-dim)' }} />
          </button>
          {!task.done && (
            <button
              onClick={() => setTimerOpen(true)}
              className="flex items-center gap-1 pl-2 pr-2.5 py-1 rounded-lg text-[11px] font-semibold transition-opacity hover:opacity-80"
              style={{ background: `${goal.color}20`, color }}
              title="Start timer"
            >
              <Play size={9} fill={color} />
              Start
            </button>
          )}
        </div>
      </div>

      {timerOpen && <TimerDialog goal={goal} initialTask={task} open={timerOpen} onClose={() => setTimerOpen(false)} />}
      {quickLogOpen && <QuickLogDialog open={quickLogOpen} onClose={() => setQuickLogOpen(false)} goal={goal} task={task} />}
      {editOpen && <EditTaskDialog open={editOpen} onClose={() => setEditOpen(false)} goalId={goal.id} task={task} />}
    </>
  );
}
