'use client';

import { useMemo, useState } from 'react';
import { JournalEntry } from '@/types';
import { fmtHours } from '@/lib/chart-utils';

interface Props {
  journals: JournalEntry[];
  color: string;
}

const DAY_HEADERS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const MONTH_NAMES = ['January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'];

function cellBg(mins: number, color: string): string {
  if (mins === 0) return 'var(--gs-border-mid)';
  if (mins < 30) return `${color}44`;
  if (mins < 60) return `${color}80`;
  if (mins < 120) return `${color}bb`;
  return color;
}

export function CalendarMonth({ journals, color }: Props) {
  const now = new Date();
  const [view, setView] = useState({ year: now.getFullYear(), month: now.getMonth() });

  const dayMap = useMemo(() => {
    const map = new Map<string, number>();
    for (const j of journals) map.set(j.date, (map.get(j.date) ?? 0) + j.minutesSpent);
    return map;
  }, [journals]);

  const cells = useMemo(() => {
    const firstDay = new Date(view.year, view.month, 1);
    const lastDay = new Date(view.year, view.month + 1, 0);
    const startPad = (firstDay.getDay() + 6) % 7; // Mon=0
    const totalCells = Math.ceil((startPad + lastDay.getDate()) / 7) * 7;

    return Array.from({ length: totalCells }, (_, i) => {
      const dayNum = i - startPad + 1;
      if (dayNum < 1 || dayNum > lastDay.getDate()) return null;
      const dateStr = `${view.year}-${String(view.month + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
      return { dayNum, dateStr, mins: dayMap.get(dateStr) ?? 0 };
    });
  }, [view, dayMap]);

  const prevMonth = () => setView((v) => {
    const m = v.month === 0 ? 11 : v.month - 1;
    const y = v.month === 0 ? v.year - 1 : v.year;
    return { year: y, month: m };
  });

  const nextMonth = () => setView((v) => {
    const m = v.month === 11 ? 0 : v.month + 1;
    const y = v.month === 11 ? v.year + 1 : v.year;
    return { year: y, month: m };
  });

  const isCurrentMonth = view.year === now.getFullYear() && view.month === now.getMonth();
  const todayNum = now.getDate();

  return (
    <div className="rounded-2xl border p-6" style={{ background: 'var(--gs-card)', borderColor: 'var(--gs-border)' }}>
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <p className="text-sm font-semibold" style={{ color: 'var(--gs-text)' }}>
          {MONTH_NAMES[view.month]} {view.year}
        </p>
        <div className="flex items-center gap-1">
          <button onClick={prevMonth} className="w-7 h-7 flex items-center justify-center rounded-lg text-sm"
            style={{ color: 'var(--gs-text-dim)' }}>‹</button>
          <button onClick={nextMonth} disabled={isCurrentMonth}
            className="w-7 h-7 flex items-center justify-center rounded-lg text-sm disabled:opacity-30"
            style={{ color: 'var(--gs-text-dim)' }}>›</button>
        </div>
      </div>

      {/* Day headers */}
      <div className="grid grid-cols-7 gap-1 mb-1">
        {DAY_HEADERS.map((d) => (
          <div key={d} className="text-center text-[10px] font-medium" style={{ color: 'var(--gs-text-faint)' }}>{d}</div>
        ))}
      </div>

      {/* Cells */}
      <div className="grid grid-cols-7 gap-1">
        {cells.map((cell, i) => {
          if (!cell) return <div key={i} />;
          const isToday = isCurrentMonth && cell.dayNum === todayNum;
          return (
            <div
              key={i}
              className="aspect-square rounded-lg flex flex-col items-center justify-center gap-0.5 relative"
              style={{ background: cell.mins > 0 ? cellBg(cell.mins, color) : 'var(--gs-card2)' }}
              title={cell.mins > 0 ? fmtHours(cell.mins) : undefined}
            >
              <span
                className="text-[11px] font-medium leading-none"
                style={{ color: cell.mins > 0 ? 'rgba(255,255,255,0.9)' : isToday ? 'var(--gs-accent)' : 'var(--gs-text-dim)' }}
              >
                {cell.dayNum}
              </span>
              {isToday && (
                <div className="w-1 h-1 rounded-full" style={{ background: cell.mins > 0 ? 'rgba(255,255,255,0.7)' : 'var(--gs-accent)' }} />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
