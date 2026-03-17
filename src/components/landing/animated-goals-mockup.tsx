'use client';

import { useState, useEffect } from 'react';

const MAIN_GOAL = {
  emoji: '💪',
  title: 'Morning Fitness',
  color: '#FB923C',
  tasks: [
    { title: '5K run',          mins: 30 },
    { title: 'Weight training', mins: 45 },
    { title: 'Yoga & stretch',  mins: 20 },
  ],
};

const OTHER_GOALS = [
  { emoji: '📚', title: 'Deep Reading',  color: '#34D399', pct: 50,  streak: 7  },
  { emoji: '💻', title: 'Side Project',  color: '#818CF8', pct: 67,  streak: 12 },
];

export function AnimatedGoalsMockup() {
  const [done, setDone]         = useState(0);
  const [resetting, setResetting] = useState(false);
  const total = MAIN_GOAL.tasks.length;
  const pct   = (done / total) * 100;

  useEffect(() => {
    if (resetting) {
      // brief window to disable transition before re-drawing
      const t = setTimeout(() => { setDone(0); setResetting(false); }, 80);
      return () => clearTimeout(t);
    }
    const delay = done === total ? 3200 : 1500;
    const t = setTimeout(() => {
      if (done >= total) setResetting(true);
      else setDone((c) => c + 1);
    }, delay);
    return () => clearTimeout(t);
  }, [done, total, resetting]);

  const allDone = done === total && !resetting;

  return (
    <div
      className="animate-float rounded-2xl overflow-hidden shadow-2xl border w-full max-w-[460px]"
      style={{ background: 'var(--gs-card)', borderColor: 'var(--gs-border)' }}
    >
      {/* Browser chrome */}
      <div
        className="flex items-center gap-2 px-4 py-2.5 border-b"
        style={{ background: 'var(--gs-card2)', borderColor: 'var(--gs-border)' }}
      >
        <div className="flex gap-1.5">
          {['#FF5F57', '#FFBD2E', '#28C840'].map((c) => (
            <div key={c} className="w-3 h-3 rounded-full" style={{ background: c }} />
          ))}
        </div>
        <div
          className="flex-1 h-5 rounded-md flex items-center justify-center text-[10px] mx-2"
          style={{ background: 'var(--gs-border)', color: 'var(--gs-text-faint)' }}
        >
          goalstory.app/goals
        </div>
      </div>

      {/* Goals page */}
      <div className="p-4 space-y-3">

        {/* Page header */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-bold" style={{ color: 'var(--gs-text)' }}>Goals</p>
            <p className="text-[10px]" style={{ color: 'var(--gs-text-dim)' }}>3 active</p>
          </div>
          <div
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-semibold text-white"
            style={{ background: 'var(--gs-accent)' }}
          >
            + New goal
          </div>
        </div>

        {/* ── Animated goal card ─────────────────────────────────────── */}
        <div
          className="rounded-xl border p-3.5"
          style={{
            background: 'var(--gs-card2)',
            borderColor: allDone ? `${MAIN_GOAL.color}70` : 'var(--gs-border)',
            boxShadow: allDone ? `0 0 24px ${MAIN_GOAL.color}25` : 'none',
            transition: 'border-color 0.5s, box-shadow 0.5s',
          }}
        >
          {/* Card header */}
          <div className="flex items-start justify-between mb-3">
            <div>
              <p className="text-xl mb-1">{MAIN_GOAL.emoji}</p>
              <p className="text-xs font-bold leading-tight" style={{ color: 'var(--gs-text)' }}>
                {MAIN_GOAL.title}
              </p>
              <p className="text-[10px] font-semibold mt-0.5" style={{ color: MAIN_GOAL.color }}>
                {done > 0 ? `${done * 30}m this week` : 'Start today'}
              </p>
            </div>
            <div
              className="text-[9px] px-2 py-1 rounded-md font-medium"
              style={{ background: 'var(--gs-card)', color: 'var(--gs-text-dim)' }}
            >
              Edit
            </div>
          </div>

          {/* Tasks list */}
          <div className="space-y-2 mb-3">
            {MAIN_GOAL.tasks.map((task, i) => {
              const isDone     = !resetting && i < done;
              const isJustDone = !resetting && i === done - 1;
              return (
                <div key={i} className="flex items-center gap-2">
                  {/* Checkbox */}
                  <div
                    className="w-4 h-4 rounded-sm shrink-0 flex items-center justify-center"
                    style={{
                      background:  isDone ? MAIN_GOAL.color : 'transparent',
                      border:      isDone ? 'none' : '1.5px solid var(--gs-border-mid)',
                      transform:   isJustDone ? 'scale(1.25)' : 'scale(1)',
                      transition:  'all 0.25s cubic-bezier(0.34,1.56,0.64,1)',
                    }}
                  >
                    {isDone && (
                      <svg width="8" height="8" viewBox="0 0 8 8">
                        <path d="M1.5 4l2 2 3-3" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                      </svg>
                    )}
                  </div>

                  {/* Task label */}
                  <span
                    className="flex-1 text-[11px]"
                    style={{
                      color:          isDone ? 'var(--gs-text-faint)' : 'var(--gs-text-dim)',
                      textDecoration: isDone ? 'line-through' : 'none',
                      transition:     'color 0.3s, text-decoration 0.3s',
                    }}
                  >
                    {task.title}
                  </span>
                  <span className="text-[10px] shrink-0" style={{ color: 'var(--gs-text-faint)' }}>
                    {task.mins}m
                  </span>
                </div>
              );
            })}
          </div>

          {/* Progress bar */}
          <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--gs-border-mid)' }}>
            <div
              className="h-full rounded-full"
              style={{
                width:      resetting ? '0%' : `${pct}%`,
                background: MAIN_GOAL.color,
                transition: resetting ? 'none' : 'width 0.75s cubic-bezier(0.16,1,0.3,1)',
              }}
            />
          </div>
          <p className="text-[9px] mt-1.5" style={{ color: 'var(--gs-text-faint)' }}>
            {resetting ? '0' : done}/{total} tasks ·{' '}
            <span style={{ color: allDone ? MAIN_GOAL.color : 'var(--gs-text-faint)', fontWeight: allDone ? 700 : 400 }}>
              {allDone ? '🎉 Complete!' : `${Math.round(pct)}%`}
            </span>
          </p>
        </div>

        {/* ── Static goal cards ──────────────────────────────────────── */}
        {OTHER_GOALS.map((g) => (
          <div
            key={g.title}
            className="rounded-xl border p-3 flex items-center gap-3"
            style={{ background: 'var(--gs-card2)', borderColor: 'var(--gs-border)' }}
          >
            <div
              className="w-9 h-9 rounded-lg flex items-center justify-center text-lg shrink-0"
              style={{ background: `${g.color}18`, border: `1px solid ${g.color}35` }}
            >
              {g.emoji}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1.5">
                <p className="text-[11px] font-bold truncate" style={{ color: 'var(--gs-text)' }}>{g.title}</p>
                <p className="text-[10px] shrink-0 ml-2" style={{ color: 'var(--gs-text-dim)' }}>
                  🔥 {g.streak}d
                </p>
              </div>
              <div className="h-1 rounded-full overflow-hidden" style={{ background: 'var(--gs-border-mid)' }}>
                <div className="h-full rounded-full" style={{ width: `${g.pct}%`, background: g.color }} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
