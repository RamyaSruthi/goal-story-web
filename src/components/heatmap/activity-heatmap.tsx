'use client';

import { useMemo, useState } from 'react';
import { JournalEntry } from '@/types';
import { fmtMins } from '@/lib/utils';

interface Props {
  journals: JournalEntry[];
  color: string;
}

const DAY_LABELS = ['M', '', 'W', '', 'F', '', ''];
const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const CELL = 13;
const GAP = 2;
const STEP = CELL + GAP;
const CURRENT_YEAR = new Date().getFullYear();

function addDays(base: Date, n: number): Date {
  const d = new Date(base);
  d.setDate(d.getDate() + n);
  return d;
}

function toDateStr(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function cellBg(mins: number, color: string): string {
  if (mins === 0) return 'var(--gs-border-mid)';
  if (mins < 30) return `${color}44`;
  if (mins < 60) return `${color}80`;
  if (mins < 120) return `${color}bb`;
  return color;
}

export function ActivityHeatmap({ journals, color }: Props) {
  const [year, setYear] = useState(CURRENT_YEAR);

  // Earliest year with data (floor for prev button)
  const minYear = useMemo(() => {
    if (journals.length === 0) return CURRENT_YEAR;
    return Math.min(...journals.map((j) => Number(j.date.slice(0, 4))));
  }, [journals]);

  const yearJournals = useMemo(
    () => journals.filter((j) => j.date.startsWith(String(year))),
    [journals, year]
  );

  const jan1 = useMemo(() => new Date(year, 0, 1), [year]);
  const dec31 = useMemo(() => new Date(year, 11, 31), [year]);

  const startDate = useMemo(() => {
    const dow = (jan1.getDay() + 6) % 7;
    return addDays(jan1, -dow);
  }, [jan1]);

  const totalCols = useMemo(() => {
    const days = Math.ceil((dec31.getTime() - startDate.getTime()) / 86400000) + 1;
    return Math.ceil(days / 7);
  }, [startDate, dec31]);

  const dayMap = useMemo(() => {
    const map = new Map<string, number>();
    for (const j of yearJournals) {
      map.set(j.date, (map.get(j.date) ?? 0) + j.minutesSpent);
    }
    return map;
  }, [yearJournals]);

  type Cell = { date: string; mins: number } | null;

  const grid = useMemo<Cell[][]>(() => {
    const cols: Cell[][] = [];
    for (let col = 0; col < totalCols; col++) {
      const rows: Cell[] = [];
      for (let row = 0; row < 7; row++) {
        const d = addDays(startDate, col * 7 + row);
        if (d < jan1 || d > dec31) {
          rows.push(null);
        } else {
          const ds = toDateStr(d);
          rows.push({ date: ds, mins: dayMap.get(ds) ?? 0 });
        }
      }
      cols.push(rows);
    }
    return cols;
  }, [startDate, totalCols, jan1, dec31, dayMap]);

  const monthLabels = useMemo(() => {
    const labels: { col: number; label: string }[] = [];
    let last = -1;
    for (let col = 0; col < totalCols; col++) {
      const d = addDays(startDate, col * 7);
      if (d < jan1 || d > dec31) continue;
      const m = d.getMonth();
      if (m !== last) {
        labels.push({ col, label: MONTH_NAMES[m] });
        last = m;
      }
    }
    return labels;
  }, [startDate, totalCols, jan1, dec31]);

  const tooltip = (cell: NonNullable<Cell>): string => {
    const d = new Date(cell.date + 'T00:00:00');
    const label = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    return cell.mins > 0 ? `${label} · ${fmtMins(cell.mins)}` : label;
  };

  return (
    <div
      className="rounded-2xl border p-6 overflow-x-auto"
      style={{ background: 'var(--gs-card)', borderColor: 'var(--gs-border)' }}
    >
      {/* Year navigation */}
      <div className="flex items-center gap-2 mb-4">
        <button
          onClick={() => setYear((y) => y - 1)}
          disabled={year <= minYear}
          className="flex items-center justify-center w-6 h-6 rounded transition-opacity disabled:opacity-30"
          style={{ color: 'var(--gs-text-dim)' }}
          aria-label="Previous year"
        >
          ‹
        </button>
        <span className="text-sm font-medium w-10 text-center" style={{ color: 'var(--gs-text)' }}>
          {year}
        </span>
        <button
          onClick={() => setYear((y) => y + 1)}
          disabled={year >= CURRENT_YEAR}
          className="flex items-center justify-center w-6 h-6 rounded transition-opacity disabled:opacity-30"
          style={{ color: 'var(--gs-text-dim)' }}
          aria-label="Next year"
        >
          ›
        </button>
      </div>

      <div className="flex gap-3 w-fit">
        {/* Day-of-week labels */}
        <div
          className="flex flex-col shrink-0"
          style={{ gap: GAP, paddingTop: 24 }}
        >
          {DAY_LABELS.map((lbl, i) => (
            <div
              key={i}
              className="flex items-center justify-end text-[10px]"
              style={{ height: CELL, color: 'var(--gs-text-faint)' }}
            >
              {lbl}
            </div>
          ))}
        </div>

        {/* Grid + month labels */}
        <div className="flex flex-col" style={{ gap: 4 }}>
          <div className="relative" style={{ height: 18 }}>
            {monthLabels.map(({ col, label }) => (
              <span
                key={`${label}-${col}`}
                className="absolute text-[10px]"
                style={{ left: col * STEP, color: 'var(--gs-text-faint)', lineHeight: '18px' }}
              >
                {label}
              </span>
            ))}
          </div>

          <div className="flex" style={{ gap: GAP }}>
            {grid.map((rows, col) => (
              <div key={col} className="flex flex-col" style={{ gap: GAP }}>
                {rows.map((cell, row) => (
                  <div
                    key={row}
                    className="rounded-sm"
                    style={{
                      width: CELL,
                      height: CELL,
                      background: cell ? cellBg(cell.mins, color) : 'transparent',
                    }}
                    title={cell ? tooltip(cell) : undefined}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-1.5 mt-4 justify-end">
        <span className="text-[10px] mr-1" style={{ color: 'var(--gs-text-faint)' }}>Empty</span>
        {['var(--gs-border-mid)', `${color}44`, `${color}80`, `${color}bb`, color].map((bg, i) => (
          <div
            key={i}
            className="rounded-sm"
            style={{ width: CELL, height: CELL, background: bg }}
          />
        ))}
        <span className="text-[10px] ml-1" style={{ color: 'var(--gs-text-faint)' }}>High</span>
      </div>
    </div>
  );
}
