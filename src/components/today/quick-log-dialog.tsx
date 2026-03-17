'use client';

import { useState } from 'react';
import { useStore } from '@/store/use-store';
import { Goal, Task } from '@/types';
import { resolveGoalColor, todayStr } from '@/lib/utils';
import { useTheme } from 'next-themes';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface Props {
  open: boolean;
  onClose: () => void;
  goal: Goal;
  task: Task;
}

export function QuickLogDialog({ open, onClose, goal, task }: Props) {
  const { theme } = useTheme();
  const { addJournal, toggleTask } = useStore();
  const color = resolveGoalColor(goal.color, theme ?? 'dark');
  const [mins, setMins] = useState(String(task.estimatedMins || 30));
  const [note, setNote] = useState('');

  const handleSave = () => {
    const m = Math.max(1, parseInt(mins) || 1);
    const journalId = `journal-${Date.now()}`;
    addJournal({
      id: journalId,
      goalId: goal.id,
      taskTitle: task.title,
      minutesSpent: m,
      note: note.trim(),
      date: todayStr(),
    });
    toggleTask(goal.id, task.id, journalId);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent
        className="max-w-sm border"
        style={{ background: 'var(--gs-card2)', borderColor: 'var(--gs-border)' }}
      >
        <DialogHeader>
          <DialogTitle style={{ color: 'var(--gs-text)' }}>Log time</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 mt-1">
          <div
            className="px-3 py-2 rounded-lg text-sm border"
            style={{ background: `${goal.color}18`, borderColor: `${goal.color}44`, color }}
          >
            {task.title}
          </div>

          <div className="space-y-1.5">
            <Label style={{ color: 'var(--gs-text-sub)' }}>Minutes spent</Label>
            <Input
              type="number"
              min={1}
              value={mins}
              onChange={(e) => setMins(e.target.value)}
              className="border-0"
              style={{ background: 'var(--gs-input-bg)', color: 'var(--gs-text)' }}
            />
          </div>

          <div className="space-y-1.5">
            <Label style={{ color: 'var(--gs-text-sub)' }}>Note (optional)</Label>
            <Textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="How did it go?"
              rows={3}
              className="border resize-none"
              style={{
                background: 'var(--gs-input-bg)',
                borderColor: 'var(--gs-border)',
                color: 'var(--gs-text)',
              }}
            />
          </div>

          <Button
            onClick={handleSave}
            className="w-full font-semibold"
            style={{ background: color, color: '#000' }}
          >
            Save & mark done
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
