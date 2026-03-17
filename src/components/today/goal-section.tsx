'use client';

import { useState } from 'react';
import { useStore } from '@/store/use-store';
import { useTheme } from 'next-themes';
import { Goal } from '@/types';
import { resolveGoalColor, todayStr } from '@/lib/utils';
import { computeStreak } from '@/lib/chart-utils';
import { TaskRow } from './task-row';
import { ChevronDown, ChevronRight, Plus } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface Props {
  goal: Goal;
}

export function GoalSection({ goal }: Props) {
  const { theme } = useTheme();
  const { addTask, journals } = useStore();
  const color = resolveGoalColor(goal.color, theme ?? 'dark');
  const [expanded, setExpanded] = useState(true);
  const [addingTask, setAddingTask] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newMins, setNewMins] = useState('');

  const today = todayStr();
  const streak = computeStreak(journals.filter((j) => j.goalId === goal.id));
  const pendingTasks = goal.tasks.filter((t) => !t.done);
  const allDoneTasks = goal.tasks.filter((t) => t.done);
  // Only show tasks completed today
  const doneTasks = allDoneTasks.filter((t) => {
    if (!t.doneJournalId) return false;
    const journal = journals.find((j) => j.id === t.doneJournalId);
    return journal?.date === today;
  });
  const visibleTotal = pendingTasks.length + doneTasks.length;
  const progress = visibleTotal > 0 ? doneTasks.length / visibleTotal : 0;

  const handleAddTask = () => {
    if (!newTitle.trim()) { setAddingTask(false); setNewMins(''); return; }
    addTask(goal.id, { title: newTitle.trim(), estimatedMins: parseInt(newMins) || 0 });
    setNewTitle('');
    setNewMins('');
    setAddingTask(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleAddTask();
    if (e.key === 'Escape') { setAddingTask(false); setNewTitle(''); setNewMins(''); }
  };

  return (
    <>
      <div
        className="rounded-2xl border overflow-hidden"
        style={{
          borderColor: `${goal.color}30`,
          background: `linear-gradient(160deg, ${goal.color}12 0%, var(--gs-card) 45%)`,
          boxShadow: `0 4px 24px ${goal.color}14`,
          borderTop: `2px solid ${goal.color}70`,
        }}
      >
        {/* Header */}
        <div
          className="flex items-center gap-3 px-4 py-3.5 cursor-pointer select-none"
          style={{ borderBottom: expanded ? `1px solid ${goal.color}20` : 'none' }}
          onClick={() => setExpanded((v) => !v)}
        >
          <span className="text-base leading-none">{goal.emoji}</span>
          <span className="font-semibold text-sm flex-1" style={{ color }}>
            {goal.title}
          </span>

          {/* Streak badge */}
          {streak > 0 && (
            <span
              className="text-xs font-bold px-2 py-0.5 rounded-full shrink-0"
              style={{ background: `${goal.color}20`, color }}
              title={`${streak}-day streak`}
            >
              🔥 {streak}
            </span>
          )}

          {/* Progress */}
          {visibleTotal > 0 && (
            <div className="flex items-center gap-2">
              <div className="w-16 h-1.5 rounded-full overflow-hidden" style={{ background: `${goal.color}20` }}>
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{ width: `${progress * 100}%`, background: color }}
                />
              </div>
              <span className="text-[11px] font-medium tabular-nums" style={{ color: 'var(--gs-text-dim)' }}>
                {doneTasks.length}/{visibleTotal}
              </span>
            </div>
          )}

<span style={{ color: 'var(--gs-text-dim)' }}>
            {expanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
          </span>
        </div>

        {/* Tasks */}
        {expanded && (
          <div className="p-2 space-y-1">
            {pendingTasks.map((task) => (
              <TaskRow key={task.id} goal={goal} task={task} />
            ))}

            {/* Done tasks — slightly separated */}
            {doneTasks.length > 0 && pendingTasks.length > 0 && (
              <div className="pt-1 mt-1" style={{ borderTop: `1px solid var(--gs-border)` }} />
            )}
            {doneTasks.map((task) => (
              <TaskRow key={task.id} goal={goal} task={task} />
            ))}

            {/* Add task inline */}
            {addingTask ? (
              <div className="px-2 py-1.5 flex items-center gap-2">
                <Input
                  autoFocus
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Task name…"
                  className="border-0 text-sm h-8 flex-1"
                  style={{ background: 'var(--gs-input-bg)', color: 'var(--gs-text)' }}
                />
                <Input
                  type="number"
                  min={0}
                  value={newMins}
                  onChange={(e) => setNewMins(e.target.value)}
                  onKeyDown={handleKeyDown}
                  onBlur={handleAddTask}
                  placeholder="mins"
                  className="border-0 text-sm h-8 w-16 text-center"
                  style={{ background: 'var(--gs-input-bg)', color: 'var(--gs-text)' }}
                />
              </div>
            ) : (
              <button
                onClick={() => setAddingTask(true)}
                className="flex items-center gap-2 px-3 py-2 w-full text-xs font-medium rounded-xl transition-colors hover:bg-[var(--gs-card2)]"
                style={{ color: 'var(--gs-text-dim)' }}
              >
                <Plus size={13} />
                Add task
              </button>
            )}
          </div>
        )}
      </div>

    </>
  );
}
