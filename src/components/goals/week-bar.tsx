'use client';

import { useMemo } from 'react';
import { JournalEntry } from '@/types';
import { fmtMins } from '@/lib/utils';

const DAYS = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
const BAR_MAX_H = 72;

function getWeekStart(weeksAgo = 0): Date {
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const dow = today.getDay();
  const mon = new Date(today);
  mon.setDate(today.getDate() - (dow === 0 ? 6 : dow - 1) - weeksAgo * 7);
  return mon;
}

function getWeekData(journals: JournalEntry[], goalId: string, weekStart: Date): number[] {
  const data = [0, 0, 0, 0, 0, 0, 0];
  for (const j of journals) {
    if (j.goalId !== goalId) continue;
    const d = new Date(j.date + 'T00:00:00');
    const diff = Math.round((d.getTime() - weekStart.getTime()) / 86400000);
    if (diff >= 0 && diff < 7) data[diff] += j.minutesSpent;
  }
  return data;
}

function weekLabel(weeksAgo: number): string {
  if (weeksAgo === 0) return 'This week';
  if (weeksAgo === 1) return 'Last week';
  const start = getWeekStart(weeksAgo);
  const end = new Date(start); end.setDate(start.getDate() + 6);
  const fmt = (d: Date) => d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  return `${fmt(start)} – ${fmt(end)}`;
}

interface Props {
  goalId: string;
  journals: JournalEntry[];
  color: string;
  weeksAgo: number;
  setWeeksAgo: (fn: (w: number) => number) => void;
}

export function WeekBar({ goalId, journals, color, weeksAgo, setWeeksAgo }: Props) {
  const dow = new Date().getDay();
  const todayIdx = dow === 0 ? 6 : dow - 1;
  const isCurrentWeek = weeksAgo === 0;

  const thisWeekStart = useMemo(() => getWeekStart(weeksAgo), [weeksAgo]);
  const prevWeekStart = useMemo(() => getWeekStart(weeksAgo + 1), [weeksAgo]);

  const thisWeek = useMemo(() => getWeekData(journals, goalId, thisWeekStart), [journals, goalId, thisWeekStart]);
  const prevWeek = useMemo(() => getWeekData(journals, goalId, prevWeekStart), [journals, goalId, prevWeekStart]);

  const max = Math.max(...thisWeek, 1);
  const thisTotal = thisWeek.reduce((a, b) => a + b, 0);
  const prevTotal = prevWeek.reduce((a, b) => a + b, 0);
  const diff = thisTotal - prevTotal;

  return (
    <div>
      {/* Week nav */}
      <div className="flex items-center justify-between mb-3">
        <button
          onClick={() => setWeeksAgo((w) => Math.min(w + 1, 52))}
          className="w-7 h-7 rounded-lg flex items-center justify-center text-sm transition-colors hover:bg-[var(--gs-card2)]"
          style={{ color: 'var(--gs-text-dim)' }}
        >
          ‹
        </button>
        <span className="text-xs font-semibold" style={{ color: 'var(--gs-text-dim)' }}>
          {weekLabel(weeksAgo)}
        </span>
        <button
          onClick={() => setWeeksAgo((w) => Math.max(w - 1, 0))}
          disabled={weeksAgo === 0}
          className="w-7 h-7 rounded-lg flex items-center justify-center text-sm transition-colors hover:bg-[var(--gs-card2)] disabled:opacity-20"
          style={{ color: 'var(--gs-text-dim)' }}
        >
          ›
        </button>
      </div>

      {/* Bars */}
      <div className="flex gap-1 items-end" style={{ height: BAR_MAX_H + 28 }}>
        {thisWeek.map((val, i) => {
          const isToday = isCurrentWeek && i === todayIdx;
          const isFuture = isCurrentWeek && i > todayIdx;
          const barH = val > 0 ? Math.max(8, (val / max) * BAR_MAX_H) : isFuture ? 0 : 4;
          const barColor = isFuture ? 'transparent' : val > 0 ? color : 'var(--gs-border)';
          const opacity = isFuture ? 0 : val > 0 ? 1 : 0.4;

          return (
            <div
              key={i}
              className="flex flex-col items-center justify-end flex-1"
              style={{ height: BAR_MAX_H + 28 }}
            >
              {isToday && val > 0 && (
                <span className="text-[10px] font-bold mb-1" style={{ color }}>
                  {fmtMins(val)}
                </span>
              )}
              <div
                className="w-full rounded-t-[4px] rounded-b-[2px] transition-all"
                style={{ height: barH, background: barColor, opacity }}
              />
              <span
                className="text-[10px] mt-1.5 font-medium"
                style={{ color: isToday ? color : 'var(--gs-text-dim)', fontWeight: isToday ? 700 : 500 }}
              >
                {DAYS[i]}
              </span>
            </div>
          );
        })}
      </div>

      {/* Comparison */}
      {prevTotal > 0 && (
        <div className="flex items-center gap-1.5 mt-2">
          <span
            className="text-xs font-bold"
            style={{ color: diff >= 0 ? '#4CAF50' : '#FF5252' }}
          >
            {diff > 0 ? `↑ ${fmtMins(diff)}` : diff < 0 ? `↓ ${fmtMins(Math.abs(diff))}` : '—'}
          </span>
          <span className="text-xs" style={{ color: 'var(--gs-text-dim)' }}>
            {diff === 0 ? 'same as week before' : diff > 0 ? 'more than week before' : 'less than week before'}
          </span>
        </div>
      )}
    </div>
  );
}
