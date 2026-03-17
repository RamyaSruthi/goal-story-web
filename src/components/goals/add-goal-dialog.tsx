'use client';

import { useState } from 'react';
import { useStore } from '@/store/use-store';
import { useTheme } from 'next-themes';
import { Goal } from '@/types';
import { resolveGoalColor } from '@/lib/utils';
import { DARK_PALETTE, GOAL_EMOJIS } from '@/lib/theme';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface Props {
  open: boolean;
  onClose: () => void;
  editGoal?: Goal;
}

export function AddGoalDialog({ open, onClose, editGoal }: Props) {
  const { theme } = useTheme();
  const { addGoal, editGoal: updateGoal } = useStore();

  const [title, setTitle] = useState(editGoal?.title ?? '');
  const [emoji, setEmoji] = useState(editGoal?.emoji ?? '🎯');
  const [color, setColor] = useState(editGoal?.color ?? DARK_PALETTE[0]);
  const [endDate, setEndDate] = useState(editGoal?.endDate ?? '');

  const handleSave = () => {
    if (!title.trim()) return;
    if (editGoal) {
      updateGoal(editGoal.id, { title: title.trim(), emoji, color, endDate: endDate || undefined, achieved: editGoal.achieved });
    } else {
      addGoal({ title: title.trim(), emoji, color, endDate: endDate || undefined });
    }
    onClose();
  };

  const handleOpenChange = (v: boolean) => {
    if (!v) onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent
        className="max-w-sm border"
        style={{ background: 'var(--gs-card2)', borderColor: 'var(--gs-border)', color: 'var(--gs-text)' }}
      >
        <DialogHeader>
          <DialogTitle style={{ color: 'var(--gs-text)' }}>
            {editGoal ? 'Edit Goal' : 'New Goal'}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-5 mt-2">
          {/* Title */}
          <div className="space-y-1.5">
            <Label style={{ color: 'var(--gs-text-sub)' }}>Name</Label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="What's your goal?"
              className="border-0"
              style={{ background: 'var(--gs-input-bg)', color: 'var(--gs-text)' }}
              autoFocus
            />
          </div>

          {/* Emoji grid */}
          <div className="space-y-1.5">
            <Label style={{ color: 'var(--gs-text-sub)' }}>Icon</Label>
            <div className="grid grid-cols-7 gap-1">
              {GOAL_EMOJIS.map((e) => (
                <button
                  key={e}
                  onClick={() => setEmoji(e)}
                  className="w-9 h-9 rounded-lg text-lg flex items-center justify-center transition-colors"
                  style={{
                    background: emoji === e ? `${color}28` : 'var(--gs-input-bg)',
                    outline: emoji === e ? `2px solid ${color}` : 'none',
                    outlineOffset: '1px',
                  }}
                >
                  {e}
                </button>
              ))}
            </div>
          </div>

          {/* Color */}
          <div className="space-y-1.5">
            <Label style={{ color: 'var(--gs-text-sub)' }}>Color</Label>
            <div className="flex gap-2">
              {DARK_PALETTE.map((c) => {
                const resolved = resolveGoalColor(c, theme ?? 'dark');
                return (
                  <button
                    key={c}
                    onClick={() => setColor(c)}
                    className="w-9 h-9 rounded-full transition-transform"
                    style={{
                      background: resolved,
                      transform: color === c ? 'scale(1.15)' : 'scale(1)',
                      outline: color === c ? `3px solid ${resolved}` : 'none',
                      outlineOffset: '2px',
                    }}
                  />
                );
              })}
            </div>
          </div>

          {/* Deadline */}
          <div className="space-y-1.5">
            <Label style={{ color: 'var(--gs-text-sub)' }}>Deadline (optional)</Label>
            <Input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="border-0"
              style={{ background: 'var(--gs-input-bg)', color: 'var(--gs-text)' }}
            />
          </div>

          <Button
            onClick={handleSave}
            disabled={!title.trim()}
            className="w-full font-semibold"
            style={{ background: color, color: '#000' }}
          >
            {editGoal ? 'Save changes' : 'Create goal'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
