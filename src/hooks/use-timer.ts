'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { fmtTimer } from '@/lib/utils';

interface UseTimerOptions {
  estimatedMins: number;
}

export function useTimer({ estimatedMins }: UseTimerOptions) {
  const [elapsed, setElapsed] = useState(0);
  const [running, setRunning] = useState(false);

  // Wall-clock based refs so the timer stays accurate in background tabs
  const startTimeRef = useRef<number | null>(null); // Date.now() when run started
  const baseElapsedRef = useRef(0);                  // elapsed accumulated before this run
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const estimatedSecs = estimatedMins * 60;
  // Always count down if estimate exists, otherwise count up
  const displaySecs = estimatedSecs > 0 ? Math.max(0, estimatedSecs - elapsed) : elapsed;
  const timesUp = estimatedSecs > 0 && elapsed >= estimatedSecs;

  const syncElapsed = useCallback(() => {
    if (startTimeRef.current !== null) {
      const wallElapsed = Math.floor((Date.now() - startTimeRef.current) / 1000);
      setElapsed(baseElapsedRef.current + wallElapsed);
    }
  }, []);

  useEffect(() => {
    if (running) {
      startTimeRef.current = Date.now();
      // Poll every 500ms so display stays smooth even if browser throttles
      intervalRef.current = setInterval(syncElapsed, 500);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
      // Freeze base elapsed when pausing
      if (startTimeRef.current !== null) {
        baseElapsedRef.current += Math.floor((Date.now() - startTimeRef.current) / 1000);
        startTimeRef.current = null;
        setElapsed(baseElapsedRef.current);
      }
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [running, syncElapsed]);

  // Immediately re-sync when tab becomes visible again
  useEffect(() => {
    const onVisible = () => { if (!document.hidden) syncElapsed(); };
    document.addEventListener('visibilitychange', onVisible);
    return () => document.removeEventListener('visibilitychange', onVisible);
  }, [syncElapsed]);

  // Auto-stop at countdown zero
  useEffect(() => {
    if (running && estimatedSecs > 0 && elapsed >= estimatedSecs) {
      setRunning(false);
    }
  }, [elapsed, running, estimatedSecs]);

  // Update document title while running
  useEffect(() => {
    if (running) {
      document.title = `${fmtTimer(displaySecs)} — Goal Story`;
    }
    return () => { document.title = 'Goal Story'; };
  }, [running, displaySecs]);

  const start = () => setRunning(true);
  const pause = () => setRunning(false);
  const reset = () => {
    setRunning(false);
    setElapsed(0);
    baseElapsedRef.current = 0;
    startTimeRef.current = null;
  };

  return { elapsed, running, displaySecs, timesUp, start, pause, reset };
}
