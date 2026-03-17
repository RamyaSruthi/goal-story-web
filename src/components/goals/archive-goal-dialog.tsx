'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Archive } from 'lucide-react';

interface Props {
  goalTitle: string;
  open: boolean;
  onConfirm: (reason: string) => void;
  onClose: () => void;
}

const QUICK_REASONS = [
  'Taking a break',
  'Shifting priorities',
  'Need more time to prepare',
  'Life got busy',
];

export function ArchiveGoalDialog({ goalTitle, open, onConfirm, onClose }: Props) {
  const [reason, setReason] = useState('');

  const handleConfirm = () => {
    onConfirm(reason.trim());
    setReason('');
  };

  const handleClose = () => {
    setReason('');
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && handleClose()}>
      <DialogContent
        className="max-w-sm border"
        style={{ background: 'var(--gs-card2)', borderColor: 'var(--gs-border)' }}
      >
        <DialogHeader>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: 'var(--gs-accent-bg)' }}>
              <Archive size={15} style={{ color: 'var(--gs-accent)' }} />
            </div>
            <DialogTitle style={{ color: 'var(--gs-text)' }}>Archive goal?</DialogTitle>
          </div>
          <p className="text-sm" style={{ color: 'var(--gs-text-dim)' }}>
            &ldquo;{goalTitle}&rdquo; will be hidden until you restore it.
          </p>
        </DialogHeader>

        <div className="space-y-3 mt-1">
          <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--gs-text-dim)' }}>
            Why are you pausing this?
          </p>

          {/* Quick picks */}
          <div className="flex flex-wrap gap-2">
            {QUICK_REASONS.map((r) => (
              <button
                key={r}
                onClick={() => setReason(r)}
                className="text-xs px-3 py-1.5 rounded-full border transition-all"
                style={{
                  background: reason === r ? 'var(--gs-accent-bg)' : 'var(--gs-input-bg)',
                  borderColor: reason === r ? 'var(--gs-accent-border)' : 'var(--gs-border)',
                  color: reason === r ? 'var(--gs-accent)' : 'var(--gs-text-sub)',
                }}
              >
                {r}
              </button>
            ))}
          </div>

          <Textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Or write your own reason…"
            rows={3}
            className="border resize-none text-sm"
            style={{
              background: 'var(--gs-input-bg)',
              borderColor: 'var(--gs-border)',
              color: 'var(--gs-text)',
            }}
          />

          <div className="flex gap-2 pt-1">
            <button
              onClick={handleClose}
              className="flex-1 py-2.5 rounded-xl text-sm font-semibold border transition-opacity hover:opacity-80"
              style={{ background: 'transparent', borderColor: 'var(--gs-border)', color: 'var(--gs-text-sub)' }}
            >
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              className="flex-1 py-2.5 rounded-xl text-sm font-semibold transition-opacity hover:opacity-90"
              style={{ background: 'var(--gs-accent)', color: '#fff' }}
            >
              Archive
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
