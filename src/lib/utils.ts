import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { DARK_PALETTE, LIGHT_PALETTE } from './theme';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export function resolveGoalColor(hex: string, theme: string): string {
  const i = DARK_PALETTE.indexOf(hex);
  return i === -1 ? hex : theme === 'dark' ? DARK_PALETTE[i] : LIGHT_PALETTE[i];
}

export function fmtMins(m: number): string {
  if (m <= 0) return '0m';
  if (m < 60) return `${m}m`;
  const h = Math.floor(m / 60);
  const rem = m % 60;
  return rem > 0 ? `${h}h ${rem}m` : `${h}h`;
}

export function fmtTimer(secs: number): string {
  const m = Math.floor(secs / 60);
  const s = secs % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

export function todayStr(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

