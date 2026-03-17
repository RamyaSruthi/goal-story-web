'use client';

import { useState, useEffect, useRef } from 'react';

/* ── shared scroll trigger ────────────────────────────────────────────────── */
function useReveal(threshold = 0.35) {
  const ref = useRef<HTMLDivElement>(null);
  const [triggered, setTriggered] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setTriggered(true); obs.disconnect(); } },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, triggered };
}

/* ── Heatmap: columns fade in left → right ───────────────────────────────── */
const HM_COLS = 26, HM_ROWS = 7, ACCENT = '#818CF8';
function lvl(c: number, r: number) {
  const v = ((c * 13 + r * 7 + c * r) % 17) / 17 + (c / 26) * 0.45;
  return v < 0.28 ? 0 : v < 0.48 ? 1 : v < 0.64 ? 2 : v < 0.8 ? 3 : 4;
}
const hmColor = (l: number) =>
  ['var(--gs-border-mid)', `${ACCENT}33`, `${ACCENT}66`, `${ACCENT}aa`, ACCENT][l];

export function AnimatedHeatmapVisual() {
  const { ref, triggered } = useReveal();
  const [col, setCol] = useState(0);

  useEffect(() => {
    if (!triggered || col >= HM_COLS) return;
    const t = setTimeout(() => setCol((c) => c + 1), 28);
    return () => clearTimeout(t);
  }, [triggered, col]);

  return (
    <div ref={ref} className="flex gap-[3px] overflow-hidden">
      {Array.from({ length: HM_COLS }, (_, c) => (
        <div
          key={c}
          className="flex flex-col gap-[3px]"
          style={{ opacity: c < col ? 1 : 0.12, transition: 'opacity 0.25s' }}
        >
          {Array.from({ length: HM_ROWS }, (_, r) => (
            <div
              key={r}
              style={{
                width: 10, height: 10, borderRadius: 2,
                background: c < col ? hmColor(lvl(c, r)) : 'var(--gs-border)',
              }}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

/* ── Streak: number counts up 0 → 23 ─────────────────────────────────────── */
export function AnimatedStreakVisual() {
  const { ref, triggered } = useReveal();
  const [count, setCount] = useState(0);
  const TARGET = 23;

  useEffect(() => {
    if (!triggered || count >= TARGET) return;
    const t = setTimeout(() => setCount((c) => c + 1), count < 18 ? 45 : 75);
    return () => clearTimeout(t);
  }, [triggered, count]);

  return (
    <div ref={ref} className="flex flex-col items-center justify-center h-full gap-1 py-4">
      <span style={{ fontSize: 44 }}>🔥</span>
      <p className="text-5xl font-black tabular-nums" style={{ color: '#FB923C' }}>{count}</p>
      <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: 'var(--gs-text-dim)' }}>
        day streak
      </p>
    </div>
  );
}

/* ── Timer: SVG ring traces around ───────────────────────────────────────── */
export function AnimatedTimerVisual() {
  const { ref, triggered } = useReveal();
  const R = 32;
  const circumference = 2 * Math.PI * R;

  return (
    <div ref={ref} className="flex flex-col items-center justify-center h-full gap-3 py-4">
      <div className="relative w-20 h-20">
        <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 80 80">
          <circle cx="40" cy="40" r={R} fill="rgba(52,211,153,0.08)"
            stroke="rgba(52,211,153,0.18)" strokeWidth="4" />
          <circle
            cx="40" cy="40" r={R}
            fill="none" stroke="#34D399" strokeWidth="4" strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={triggered ? 0 : circumference}
            style={{ transition: 'stroke-dashoffset 1.6s cubic-bezier(0.16,1,0.3,1)' }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <p className="text-base font-black font-mono" style={{ color: '#34D399' }}>25:00</p>
        </div>
      </div>
      <p className="text-xs font-semibold" style={{ color: 'var(--gs-text-dim)' }}>Focus session</p>
    </div>
  );
}

/* ── Journal: lines type in one by one ───────────────────────────────────── */
const JOURNAL_LINES = [
  { w: '85%', accent: true  },
  { w: '72%', accent: false },
  { w: '90%', accent: false },
  { w: '55%', accent: false },
];

export function AnimatedJournalVisual() {
  const { ref, triggered } = useReveal();
  const [shown, setShown] = useState(0);

  useEffect(() => {
    if (!triggered || shown >= JOURNAL_LINES.length) return;
    const t = setTimeout(() => setShown((s) => s + 1), 220);
    return () => clearTimeout(t);
  }, [triggered, shown]);

  return (
    <div ref={ref} className="w-full space-y-3 py-2">
      <div className="flex items-center gap-2 mb-3">
        <span style={{ fontSize: 20 }}>📝</span>
        <div>
          <div className="h-2 w-20 rounded-full" style={{ background: 'rgba(244,114,182,0.5)' }} />
          <div className="h-1.5 w-12 rounded-full mt-1" style={{ background: 'rgba(244,114,182,0.25)' }} />
        </div>
      </div>
      {JOURNAL_LINES.map((l, i) => (
        <div
          key={i}
          className="h-2 rounded-full"
          style={{
            width: i < shown ? l.w : '0%',
            background: l.accent ? 'rgba(244,114,182,0.45)' : 'var(--gs-border-mid)',
            transition: 'width 0.45s cubic-bezier(0.16,1,0.3,1)',
          }}
        />
      ))}
    </div>
  );
}

/* ── Chart: bars grow up with stagger ────────────────────────────────────── */
const BARS = [18, 32, 28, 55, 42, 68, 50, 78, 62, 85, 72, 94];

export function AnimatedChartVisual() {
  const { ref, triggered } = useReveal();
  const max = Math.max(...BARS);

  return (
    <div ref={ref} className="flex items-end gap-1.5 h-16 w-full px-1">
      {BARS.map((h, i) => (
        <div
          key={i}
          className="flex-1 rounded-t-sm"
          style={{
            height: triggered ? `${(h / max) * 100}%` : '0%',
            background: i >= BARS.length - 3 ? '#c084fc' : `${ACCENT}55`,
            transition: `height 0.65s cubic-bezier(0.16,1,0.3,1) ${i * 38}ms`,
          }}
        />
      ))}
    </div>
  );
}

/* ── Dispatcher ───────────────────────────────────────────────────────────── */
export function AnimatedBentoVisual({ type }: { type: string }) {
  if (type === 'heatmap') return <AnimatedHeatmapVisual />;
  if (type === 'streak')  return <AnimatedStreakVisual />;
  if (type === 'timer')   return <AnimatedTimerVisual />;
  if (type === 'journal') return <AnimatedJournalVisual />;
  if (type === 'chart')   return <AnimatedChartVisual />;
  return null;
}
