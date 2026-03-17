import { JournalEntry, Goal } from '@/types';

export function fmtHours(mins: number): string {
  if (mins <= 0) return '0m';
  if (mins < 60) return `${mins}m`;
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return m > 0 ? `${h}h ${m}m` : `${h}h`;
}

function isoWeek(dateStr: string): string {
  const d = new Date(dateStr + 'T00:00:00');
  const day = d.getDay() || 7;
  d.setDate(d.getDate() + 4 - day);
  const yearStart = new Date(d.getFullYear(), 0, 1);
  const wn = Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
  return `${d.getFullYear()}-W${String(wn).padStart(2, '0')}`;
}

function weekToMonday(weekStr: string): string {
  const [yearStr, wStr] = weekStr.split('-W');
  const year = parseInt(yearStr);
  const week = parseInt(wStr);
  const jan4 = new Date(year, 0, 4);
  const startW1 = new Date(jan4);
  startW1.setDate(jan4.getDate() - ((jan4.getDay() + 6) % 7));
  const d = new Date(startW1);
  d.setDate(d.getDate() + (week - 1) * 7);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

export function formatPeriodLabel(key: string, period: 'day' | 'week' | 'month'): string {
  if (period === 'day') {
    const d = new Date(key + 'T00:00:00');
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  }
  if (period === 'month') {
    const d = new Date(key + '-01T00:00:00');
    return d.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
  }
  const d = new Date(weekToMonday(key) + 'T00:00:00');
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export function aggregateByPeriod(
  journals: JournalEntry[],
  period: 'day' | 'week' | 'month'
): { key: string; label: string; mins: number }[] {
  const map = new Map<string, number>();
  for (const j of journals) {
    const key =
      period === 'day' ? j.date :
      period === 'month' ? j.date.slice(0, 7) :
      isoWeek(j.date);
    map.set(key, (map.get(key) ?? 0) + j.minutesSpent);
  }
  return Array.from(map.entries())
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([key, mins]) => ({ key, label: formatPeriodLabel(key, period), mins }));
}

export function stackedWeeklyData(
  journals: JournalEntry[]
): { week: string; label: string; [goalId: string]: string | number }[] {
  const weekMap = new Map<string, Record<string, number>>();
  for (const j of journals) {
    const week = isoWeek(j.date);
    if (!weekMap.has(week)) weekMap.set(week, {});
    const row = weekMap.get(week)!;
    row[j.goalId] = (row[j.goalId] ?? 0) + j.minutesSpent;
  }
  return Array.from(weekMap.entries())
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([week, row]) => ({ week, label: formatPeriodLabel(week, 'week'), ...row }));
}

export function cumulativePerGoal(
  journals: JournalEntry[],
  goals: Goal[]
): { date: string; [goalId: string]: string | number }[] {
  const dateSet = new Set(journals.map((j) => j.date));
  const dates = Array.from(dateSet).sort();

  const dayTotals: Record<string, Record<string, number>> = {};
  for (const j of journals) {
    if (!dayTotals[j.date]) dayTotals[j.date] = {};
    dayTotals[j.date][j.goalId] = (dayTotals[j.date][j.goalId] ?? 0) + j.minutesSpent;
  }

  const running: Record<string, number> = {};
  goals.forEach((g) => (running[g.id] = 0));

  return dates.map((date) => {
    const day = dayTotals[date] ?? {};
    for (const g of goals) running[g.id] += day[g.id] ?? 0;
    const row: { date: string; [goalId: string]: string | number } = { date };
    goals.forEach((g) => { row[g.id] = Math.round((running[g.id] / 60) * 10) / 10; });
    return row;
  });
}

export function cumulativeTotal(
  journals: JournalEntry[]
): { date: string; hours: number }[] {
  const dateSet = new Set(journals.map((j) => j.date));
  const dates = Array.from(dateSet).sort();
  const dayTotals: Record<string, number> = {};
  for (const j of journals) dayTotals[j.date] = (dayTotals[j.date] ?? 0) + j.minutesSpent;
  let running = 0;
  return dates.map((date) => {
    running += dayTotals[date] ?? 0;
    return { date, hours: Math.round((running / 60) * 10) / 10 };
  });
}

export function computeStreak(journals: JournalEntry[]): number {
  const dates = new Set(journals.filter((j) => j.minutesSpent > 0).map((j) => j.date));
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  let streak = 0;
  const cursor = new Date(today);
  while (true) {
    const ds = `${cursor.getFullYear()}-${String(cursor.getMonth() + 1).padStart(2, '0')}-${String(cursor.getDate()).padStart(2, '0')}`;
    if (dates.has(ds)) { streak++; cursor.setDate(cursor.getDate() - 1); }
    else break;
  }
  return streak;
}

export function timePerGoal(
  journals: JournalEntry[],
  goals: Goal[],
  palette: string[]
): { id: string; name: string; emoji: string; color: string; mins: number }[] {
  return goals
    .map((g, i) => ({
      id: g.id,
      name: g.title,
      emoji: g.emoji,
      color: palette[i % palette.length],
      mins: journals.filter((j) => j.goalId === g.id).reduce((s, j) => s + j.minutesSpent, 0),
    }))
    .filter((g) => g.mins > 0);
}
