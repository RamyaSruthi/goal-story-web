'use client';

import { useStore } from '@/store/use-store';
import { TimerDialog } from './timer-dialog';

export function GlobalTimerOverlay() {
  const { timerGoal, timerTask, closeTimer } = useStore();

  if (!timerGoal) return null;

  return (
    <TimerDialog
      goal={timerGoal}
      initialTask={timerTask}
      open={true}
      onClose={closeTimer}
    />
  );
}
