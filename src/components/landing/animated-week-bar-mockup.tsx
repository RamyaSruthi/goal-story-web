'use client';

import { useState, useEffect } from 'react';

const DAYS = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

const GOALS = [
  { emoji: '💪', title: 'Morning Fitness', color: '#FB923C', values: [45, 30, 60,  0, 50, 40, 35] },
  { emoji: '📚', title: 'Deep Reading',    color: '#34D399', values: [30, 45, 20, 60, 40,  0, 50] },
  { emoji: '💻', title: 'Side Project',    color: '#818CF8', values: [60, 90, 45, 75, 60, 30, 90] },
  { emoji: '🌍', title: 'Language',        color: '#FBBF24', values: [20, 20, 30,  0, 25, 20, 30] },
  { emoji: '🧘', title: 'Meditation',      color: '#F472B6', values: [15, 15, 15,  0, 15, 20, 15] },
  { emoji: '✏️', title: 'Sketching',       color: '#38BDF8', values: [ 0, 45,  0, 60,  0, 90, 45] },
];

const BAR_MAX_H = 52;

function fmtMins(m: number) {
  if (m === 0) return '—';
  const h = Math.floor(m / 60);
  const min = m % 60;
  if (h === 0) return `${min}m`;
  if (min === 0) return `${h}h`;
  return `${h}h ${min}m`;
}

export function AnimatedWeekBarMockup() {
  const [col, setCol]             = useState(0);
  const [resetting, setResetting] = useState(false);

  useEffect(() => {
    if (resetting) {
      const t = setTimeout(() => { setCol(0); setResetting(false); }, 80);
      return () => clearTimeout(t);
    }
    const delay = col === DAYS.length ? 2800 : 480;
    const t = setTimeout(() => {
      if (col >= DAYS.length) setResetting(true);
      else setCol((c) => c + 1);
    }, delay);
    return () => clearTimeout(t);
  }, [col, resetting]);

  return (
    <div
      className="animate-float rounded-2xl overflow-hidden shadow-2xl border w-full max-w-[760px]"
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

      {/* Page header */}
      <div className="px-4 pt-3 pb-2.5 flex items-center justify-between">
        <div>
          <p className="text-sm font-bold" style={{ color: 'var(--gs-text)' }}>Goals</p>
          <p className="text-[10px]" style={{ color: 'var(--gs-text-dim)' }}>6 active · This week</p>
        </div>
        <div
          className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-semibold text-white"
          style={{ background: 'var(--gs-accent)' }}
        >
          + New goal
        </div>
      </div>

      {/* 2-col goal grid */}
      <div className="px-3 pb-3 grid grid-cols-2 gap-2">
        {GOALS.map((goal) => {
          const max      = Math.max(...goal.values, 1);
          const weekMins = goal.values
            .slice(0, resetting ? 0 : col)
            .reduce((a, b) => a + b, 0);

          return (
            <div
              key={goal.title}
              className="rounded-xl border p-2.5"
              style={{ background: 'var(--gs-card2)', borderColor: 'var(--gs-border)' }}
            >
              {/* Card header */}
              <div className="flex items-center gap-1.5 mb-2">
                <div
                  className="w-6 h-6 rounded-md flex items-center justify-center text-sm shrink-0"
                  style={{ background: `${goal.color}18`, border: `1px solid ${goal.color}35` }}
                >
                  {goal.emoji}
                </div>
                <div className="min-w-0 flex-1">
                  <p
                    className="text-[9px] font-bold leading-tight truncate"
                    style={{ color: 'var(--gs-text)' }}
                  >
                    {goal.title}
                  </p>
                  <p
                    className="text-[8px] font-semibold"
                    style={{ color: weekMins > 0 ? goal.color : 'var(--gs-text-faint)' }}
                  >
                    {fmtMins(weekMins)}
                  </p>
                </div>
              </div>

              {/* Week bars */}
              <div
                className="flex items-end gap-[2px]"
                style={{ height: BAR_MAX_H + 12 }}
              >
                {DAYS.map((day, i) => {
                  const isVisible = !resetting && i < col;
                  const val       = goal.values[i];
                  const barH      = isVisible && val > 0
                    ? Math.max(4, (val / max) * BAR_MAX_H)
                    : 3;
                  const isToday   = i === 4;

                  return (
                    <div
                      key={i}
                      className="flex flex-col items-center justify-end flex-1"
                      style={{ height: BAR_MAX_H + 12 }}
                    >
                      <div
                        className="w-full rounded-t-[2px]"
                        style={{
                          height:     isVisible ? barH : 3,
                          background: isVisible && val > 0 ? goal.color : 'var(--gs-border)',
                          opacity:    isVisible ? 1 : 0.3,
                          transition: resetting
                            ? 'none'
                            : 'height 0.5s cubic-bezier(0.16,1,0.3,1), opacity 0.25s',
                        }}
                      />
                      <span
                        className="text-[7px] mt-[3px]"
                        style={{
                          color:      isToday && isVisible ? goal.color : 'var(--gs-text-faint)',
                          fontWeight: isToday && isVisible ? 700 : 400,
                        }}
                      >
                        {day}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
