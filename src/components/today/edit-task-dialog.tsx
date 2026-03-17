'use client';

import { useState } from 'react';
import { useStore } from '@/store/use-store';
import { Task } from '@/types';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
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
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Trash2 } from 'lucide-react';

interface Props {
  open: boolean;
  onClose: () => void;
  goalId: string;
  task: Task;
}

export function EditTaskDialog({ open, onClose, goalId, task }: Props) {
  const { editTask, deleteTask } = useStore();
  const [title, setTitle] = useState(task.title);
  const [mins, setMins] = useState(String(task.estimatedMins));
  const [deleteOpen, setDeleteOpen] = useState(false);

  const handleSave = () => {
    if (!title.trim()) return;
    editTask(goalId, task.id, { title: title.trim(), estimatedMins: parseInt(mins) || 0 });
    onClose();
  };

  return (
    <>
      <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
        <DialogContent
          className="max-w-sm border"
          style={{ background: 'var(--gs-card2)', borderColor: 'var(--gs-border)' }}
        >
          <DialogHeader>
            <DialogTitle style={{ color: 'var(--gs-text)' }}>Edit task</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-1">
            <div className="space-y-1.5">
              <Label style={{ color: 'var(--gs-text-sub)' }}>Title</Label>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="border-0"
                style={{ background: 'var(--gs-input-bg)', color: 'var(--gs-text)' }}
                autoFocus
              />
            </div>
            <div className="space-y-1.5">
              <Label style={{ color: 'var(--gs-text-sub)' }}>Estimated minutes</Label>
              <Input
                type="number"
                min={0}
                value={mins}
                onChange={(e) => setMins(e.target.value)}
                className="border-0"
                style={{ background: 'var(--gs-input-bg)', color: 'var(--gs-text)' }}
              />
            </div>
            <div className="flex gap-2">
              <Button
                onClick={handleSave}
                disabled={!title.trim()}
                className="flex-1 font-semibold"
                style={{ background: 'var(--gs-accent)', color: '#fff' }}
              >
                Save
              </Button>
              <Button
                onClick={() => setDeleteOpen(true)}
                variant="outline"
                size="icon"
                className="border"
                style={{ borderColor: 'var(--gs-border)', background: 'transparent' }}
              >
                <Trash2 size={15} className="text-red-500" />
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent style={{ background: 'var(--gs-card2)', borderColor: 'var(--gs-border)' }}>
          <AlertDialogHeader>
            <AlertDialogTitle style={{ color: 'var(--gs-text)' }}>Delete task?</AlertDialogTitle>
            <AlertDialogDescription style={{ color: 'var(--gs-text-dim)' }}>
              &quot;{task.title}&quot; will be permanently deleted.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel style={{ background: 'var(--gs-input-bg)', color: 'var(--gs-text)', border: 'none' }}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => { deleteTask(goalId, task.id); onClose(); }}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
