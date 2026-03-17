'use client';

import { useState } from 'react';
import confetti from 'canvas-confetti';
import { useStore } from '@/store/use-store';
import { useTheme } from 'next-themes';
import { Goal } from '@/types';
import { resolveGoalColor, fmtMins } from '@/lib/utils';
import { computeStreak } from '@/lib/chart-utils';
import { WeekBar } from './week-bar';
import { AddGoalDialog } from './add-goal-dialog';
import { ArchiveGoalDialog } from './archive-goal-dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Trash2, Archive, ArchiveRestore } from 'lucide-react';

function daysLeft(endDate: string): { num: string; label: string } | null {
  const end = new Date(endDate + 'T00:00:00');
  if (isNaN(end.getTime())) return null;
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const diff = Math.ceil((end.getTime() - today.getTime()) / 86400000);
  if (diff < 0) return { num: '!', label: 'overdue' };
  if (diff === 0) return { num: '0', label: 'days left' };
  return { num: String(diff), label: diff === 1 ? 'day left' : 'days left' };
}

function getWeekStart(weeksAgo = 0): Date {
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const dow = today.getDay();
  const mon = new Date(today);
  mon.setDate(today.getDate() - (dow === 0 ? 6 : dow - 1) - weeksAgo * 7);
  return mon;
}

interface Props {
  goal: Goal;
}

export function GoalCard({ goal }: Props) {
  const { theme } = useTheme();
  const { journals, toggleGoalAchieved, toggleGoalArchived, deleteGoal } = useStore();
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [archiveOpen, setArchiveOpen] = useState(false);
  const [weeksAgo, setWeeksAgo] = useState(0);
  const color = resolveGoalColor(goal.color, theme ?? 'dark');

  const goalJournals = journals.filter((j) => j.goalId === goal.id);
  const lifetimeMins = goalJournals.reduce((sum, j) => sum + j.minutesSpent, 0);
  const streak = computeStreak(goalJournals);

  const weekStart = getWeekStart(weeksAgo);
  const minsThisWeek = goalJournals
    .filter((j) => {
      const d = new Date(j.date + 'T00:00:00');
      const diff = Math.round((d.getTime() - weekStart.getTime()) / 86400000);
      return diff >= 0 && diff < 7;
    })
    .reduce((sum, j) => sum + j.minutesSpent, 0);

  const doneCount = goal.tasks.filter((t) => t.done).length;
  const dl = goal.endDate ? daysLeft(goal.endDate) : null;

  return (
    <>
      <div
        className="rounded-2xl border"
        style={{ background: 'var(--gs-card)', borderColor: 'var(--gs-border)' }}
      >
        <div className="p-5">
          {/* Top row: left = emoji+title+week mins, right = lifetime */}
          <div className="flex items-start justify-between mb-5">
            <div className="flex-1 min-w-0">
              <p className="text-2xl mb-2">{goal.emoji}</p>
              <p className="font-bold text-base leading-tight" style={{ color: 'var(--gs-text)' }}>
                {goal.title}
              </p>
              <p className="text-xs mt-1 font-medium" style={{ color }}>
                {fmtMins(minsThisWeek)} this week
              </p>
            </div>
            <div className="flex flex-col items-end gap-2 ml-4 shrink-0">
              {/* Edit button */}
              <button
                onClick={() => setEditOpen(true)}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold"
                style={{ background: 'var(--gs-card2)', color: 'var(--gs-text-dim)' }}
              >
                Edit
              </button>
              {/* Lifetime hours */}
              <p className="text-2xl font-black leading-none" style={{ color }}>
                {fmtMins(lifetimeMins)}
              </p>
              <p className="text-xs" style={{ color: 'var(--gs-text-dim)' }}>lifetime</p>
            </div>
          </div>

          {/* Week bars */}
          <WeekBar goalId={goal.id} journals={journals} color={color} weeksAgo={weeksAgo} setWeeksAgo={setWeeksAgo} />

          {/* Footer */}
          <div
            className="flex items-center justify-between mt-4 pt-4"
            style={{ borderTop: '1px solid var(--gs-border)' }}
          >
            <div>
              <p
                className="text-xs font-semibold"
                style={{ color: dl ? (dl.num === '!' ? '#EF4444' : color) : 'var(--gs-text-faint)' }}
              >
                {dl ? (dl.num === '!' ? 'Overdue' : `${dl.num} ${dl.label}`) : 'No deadline'}
              </p>
              <p className="text-xs mt-0.5" style={{ color: 'var(--gs-text-dim)' }}>
                {doneCount} task{doneCount !== 1 ? 's' : ''} done
                {streak > 0 && (
                  <span className="ml-2 font-semibold" style={{ color }}>🔥 {streak}d streak</span>
                )}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setDeleteOpen(true)}
                className="p-1.5 rounded-lg opacity-40 hover:opacity-100 transition-opacity"
                title="Delete goal"
              >
                <Trash2 size={13} className="text-red-400" />
              </button>
              <button
                onClick={() => goal.archived ? toggleGoalArchived(goal.id) : setArchiveOpen(true)}
                className="p-1.5 rounded-lg opacity-40 hover:opacity-100 transition-opacity"
                title={goal.archived ? 'Restore goal' : 'Archive goal'}
              >
                {goal.archived
                  ? <ArchiveRestore size={13} style={{ color: 'var(--gs-accent)' }} />
                  : <Archive size={13} style={{ color: 'var(--gs-text-dim)' }} />
                }
              </button>
              <button
                onClick={() => {
                  if (!goal.achieved) {
                    confetti({
                      particleCount: 120,
                      spread: 70,
                      origin: { y: 0.7 },
                      colors: ['#818CF8', '#FB923C', '#34D399', '#F472B6', '#38BDF8'],
                    });
                  }
                  toggleGoalAchieved(goal.id);
                }}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold border transition-opacity hover:opacity-80"
                style={{
                  background: `${goal.color}18`,
                  borderColor: `${goal.color}44`,
                  color,
                }}
              >
                {goal.achieved ? 'Mark Active' : 'Mark Achieved'}
              </button>
            </div>
          </div>
        </div>
      </div>

      <AddGoalDialog open={editOpen} onClose={() => setEditOpen(false)} editGoal={goal} />

      <ArchiveGoalDialog
        goalTitle={goal.title}
        open={archiveOpen}
        onConfirm={(reason) => { toggleGoalArchived(goal.id, reason); setArchiveOpen(false); }}
        onClose={() => setArchiveOpen(false)}
      />

      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent style={{ background: 'var(--gs-card2)', borderColor: 'var(--gs-border)' }}>
          <AlertDialogHeader>
            <AlertDialogTitle style={{ color: 'var(--gs-text)' }}>Delete goal?</AlertDialogTitle>
            <AlertDialogDescription style={{ color: 'var(--gs-text-dim)' }}>
              This will permanently delete &quot;{goal.title}&quot; and all its tasks and journal entries.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel style={{ background: 'var(--gs-input-bg)', color: 'var(--gs-text)', border: 'none' }}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => deleteGoal(goal.id)} className="bg-red-600 hover:bg-red-700 text-white">Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
