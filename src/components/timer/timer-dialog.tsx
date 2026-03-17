'use client';

import { useEffect, useRef, useState } from 'react';
import { useStore } from '@/store/use-store';
import { useTheme } from 'next-themes';
import { Goal, Task } from '@/types';
import { useTimer } from '@/hooks/use-timer';
import { resolveGoalColor, fmtTimer, fmtMins, todayStr } from '@/lib/utils';
import { Textarea } from '@/components/ui/textarea';
import { X } from 'lucide-react';

interface Props {
  goal: Goal;
  initialTask?: Task | null;
  open: boolean;
  onClose: () => void;
}

export function TimerDialog({ goal, initialTask, open, onClose }: Props) {
  const { theme } = useTheme();
  const { addJournal, toggleTask } = useStore();
  const color = resolveGoalColor(goal.color, theme ?? 'dark');

  const [phase, setPhase] = useState<'pick' | 'timer' | 'journal'>(
    initialTask ? 'timer' : 'pick'
  );
  const [selectedTask, setSelectedTask] = useState<Task | null>(initialTask ?? null);
  const [note, setNote] = useState('');
  const toneFiredRef = useRef(false);

  const { elapsed, running, displaySecs, timesUp, start, pause } = useTimer({
    estimatedMins: selectedTask?.estimatedMins ?? 0,
  });

  // Play a chime when timer ends
  useEffect(() => {
    if (timesUp && !toneFiredRef.current) {
      toneFiredRef.current = true;
      try {
        const ctx = new AudioContext();
        const notes = [523, 659, 784, 1047]; // C5 E5 G5 C6
        notes.forEach((freq, i) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.type = 'sine';
          osc.frequency.value = freq;
          const t = ctx.currentTime + i * 0.18;
          gain.gain.setValueAtTime(0, t);
          gain.gain.linearRampToValueAtTime(0.25, t + 0.04);
          gain.gain.exponentialRampToValueAtTime(0.001, t + 0.9);
          osc.start(t);
          osc.stop(t + 0.9);
        });
      } catch {
        // AudioContext not available
      }
    }
  }, [timesUp]);

  // Auto-start when entering timer phase
  useEffect(() => {
    if (phase === 'timer') start();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase]);

  if (!open) return null;

  const handleDone = () => {
    pause();
    setPhase('journal');
  };

  const handleSave = () => {
    const mins = Math.max(1, Math.floor(elapsed / 60));
    const journalId = `journal-${Date.now()}`;
    addJournal({
      id: journalId,
      goalId: goal.id,
      taskTitle: selectedTask?.title ?? 'Free session',
      minutesSpent: mins,
      note: note.trim(),
      date: todayStr(),
    });
    if (selectedTask) {
      toggleTask(goal.id, selectedTask.id, journalId);
    }
    onClose();
  };

  const statusText = timesUp
    ? "time's up! 🎉"
    : running
    ? 'in progress'
    : elapsed > 0
    ? 'paused'
    : 'starting…';

  /* ── Pick phase — small centered card ──────────────────────────────── */
  if (phase === 'pick') {
    return (
      <div
        className="fixed inset-0 z-[100] flex items-center justify-center p-4"
        style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)' }}
      >
        <div
          className="w-full max-w-sm rounded-2xl p-6 border animate-slide-up"
          style={{
            background: 'var(--gs-card)',
            borderColor: `${goal.color}44`,
          }}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="text-lg">{goal.emoji}</span>
              <span className="font-semibold text-sm" style={{ color }}>
                {goal.title}
              </span>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg transition-colors hover:bg-[var(--gs-card2)]"
            >
              <X size={14} style={{ color: 'var(--gs-text-dim)' }} />
            </button>
          </div>

          <p className="text-xs uppercase tracking-widest mb-3" style={{ color: 'var(--gs-text-dim)' }}>
            Pick a task
          </p>

          <div className="space-y-2">
            {goal.tasks.filter((t) => !t.done).map((task) => (
              <button
                key={task.id}
                onClick={() => { setSelectedTask(task); setPhase('timer'); }}
                className="w-full flex items-center justify-between px-4 py-3 rounded-xl border text-left transition-all hover:opacity-80 hover:scale-[1.01]"
                style={{ background: 'var(--gs-input-bg)', borderColor: 'var(--gs-border)' }}
              >
                <span className="text-sm" style={{ color: 'var(--gs-text)' }}>{task.title}</span>
                {task.estimatedMins > 0 && (
                  <span className="text-xs ml-2 shrink-0" style={{ color: 'var(--gs-text-dim)' }}>
                    {task.estimatedMins}m
                  </span>
                )}
              </button>
            ))}
            {goal.tasks.filter((t) => !t.done).length === 0 && (
              <p className="text-sm text-center py-4" style={{ color: 'var(--gs-text-dim)' }}>
                All tasks done!
              </p>
            )}
          </div>
        </div>
      </div>
    );
  }

  /* ── Journal phase — centered card ─────────────────────────────────── */
  if (phase === 'journal') {
    return (
      <div
        className="fixed inset-0 z-[100] flex items-center justify-center p-4"
        style={{ background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(10px)' }}
      >
        <div
          className="w-full max-w-sm rounded-2xl p-6 border animate-slide-up space-y-4"
          style={{ background: 'var(--gs-card)', borderColor: `${goal.color}44` }}
        >
          <div className="text-center space-y-1">
            <div className="text-3xl">✍️</div>
            <p className="font-black tracking-tight text-xl" style={{ color: 'var(--gs-text)' }}>
              Session complete!
            </p>
            <p className="text-sm" style={{ color: 'var(--gs-text-dim)' }}>
              {fmtMins(Math.floor(elapsed / 60))} on{' '}
              <span style={{ color }}>{selectedTask?.title}</span>
            </p>
          </div>

          <p className="text-xs" style={{ color: 'var(--gs-text-dim)' }}>
            How did it go? Write a quick note.
          </p>

          <Textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="What did you accomplish? Any blockers? How do you feel about this goal now..."
            rows={4}
            className="border resize-none"
            style={{
              background: 'var(--gs-input-bg)',
              borderColor: `${goal.color}44`,
              color: 'var(--gs-text)',
            }}
            autoFocus
          />

          <button
            onClick={handleSave}
            className="w-full py-3 rounded-xl font-bold text-sm transition-all hover:opacity-90 hover:scale-[1.01] active:scale-[0.98]"
            style={{ background: color, color: '#000' }}
          >
            {note.trim() ? 'Save & Close' : 'Skip & Close'}
          </button>
        </div>
      </div>
    );
  }

  /* ── Timer phase — full screen ──────────────────────────────────────── */
  return (
    <div
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center"
      style={{ background: goal.color }}
    >
      {/* Close */}
      <button
        onClick={onClose}
        className="absolute top-6 right-6 p-2 rounded-xl transition-all hover:bg-white/20"
      >
        <X size={18} style={{ color: 'rgba(255,255,255,0.5)' }} />
      </button>

      {/* Goal badge */}
      <div
        className="flex items-center gap-2 px-4 py-2 rounded-full mb-8"
        style={{ background: 'rgba(255,255,255,0.15)' }}
      >
        <span>{goal.emoji}</span>
        <span className="text-sm font-medium" style={{ color: 'rgba(255,255,255,0.8)' }}>{goal.title}</span>
      </div>

      {/* Task title */}
      <h2
        className="font-black tracking-tight text-center px-8 mb-10"
        style={{ fontSize: 32, letterSpacing: '-0.03em', color: '#fff', maxWidth: 600 }}
      >
        {selectedTask?.title}
      </h2>

      {/* Timer */}
      <div
        className="font-black tracking-tight leading-none mb-4 tabular-nums"
        style={{
          fontSize: 'clamp(80px, 18vw, 160px)',
          letterSpacing: '-0.04em',
          color: '#fff',
        }}
      >
        {fmtTimer(displaySecs)}
      </div>

      {/* Status */}
      <p className="text-sm font-medium mb-12 uppercase tracking-widest" style={{ color: 'rgba(255,255,255,0.5)' }}>
        {statusText}
      </p>

      {/* Buttons */}
      <div className="flex items-center gap-4">
        {running ? (
          <button
            onClick={pause}
            className="px-10 py-3.5 rounded-full font-bold text-sm transition-all hover:bg-white/30 active:scale-[0.97]"
            style={{ background: 'rgba(255,255,255,0.2)', color: '#fff' }}
          >
            Pause
          </button>
        ) : (
          <button
            onClick={start}
            className="px-10 py-3.5 rounded-full font-bold text-sm transition-all hover:bg-white/30 active:scale-[0.97]"
            style={{ background: 'rgba(255,255,255,0.2)', color: '#fff' }}
          >
            Resume
          </button>
        )}

        {elapsed > 0 && (
          <button
            onClick={handleDone}
            className="px-10 py-3.5 rounded-full font-bold text-sm transition-all active:scale-[0.97]"
            style={{ background: 'rgba(0,0,0,0.35)', color: '#fff' }}
          >
            Done ✓
          </button>
        )}
      </div>
    </div>
  );
}
