/**
 * Calendar pure date math — shared by the web and native resolutions and covered by
 * unit tests. All functions operate on local calendar dates (no timezone shifting):
 * a day is identified by its local year/month/day, so the grid a user sees matches
 * the dates emitted by selection.
 */

import type { CalendarDayCell } from './Calendar.interfaces';

const DAYS_IN_WEEK = 7;
const WEEKS_IN_GRID = 6;

export const startOfDay = (date: Date): Date =>
  new Date(date.getFullYear(), date.getMonth(), date.getDate());

export const startOfMonth = (date: Date): Date => new Date(date.getFullYear(), date.getMonth(), 1);

export const addMonths = (date: Date, amount: number): Date =>
  new Date(date.getFullYear(), date.getMonth() + amount, 1);

export const addDays = (date: Date, amount: number): Date =>
  new Date(date.getFullYear(), date.getMonth(), date.getDate() + amount);

export const isSameDay = (a: Date | null, b: Date | null): boolean =>
  a !== null &&
  b !== null &&
  a.getFullYear() === b.getFullYear() &&
  a.getMonth() === b.getMonth() &&
  a.getDate() === b.getDate();

export const dayKey = (date: Date): string => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
};

/**
 * Days between `date` and the start of its week, given the first weekday.
 * `weekStartsOn` 0 = Sunday, 1 = Monday.
 */
const leadingOffset = (date: Date, weekStartsOn: 0 | 1): number =>
  (date.getDay() - weekStartsOn + DAYS_IN_WEEK) % DAYS_IN_WEEK;

/**
 * A fixed 6×7 grid of day cells covering the month of `month`, padded with the
 * trailing days of the previous month and leading days of the next so every row is
 * full. `inCurrentMonth` flags the padding days.
 */
export const buildMonthGrid = (month: Date, weekStartsOn: 0 | 1): CalendarDayCell[] => {
  const first = startOfMonth(month);
  const gridStart = addDays(first, -leadingOffset(first, weekStartsOn));
  const cells: CalendarDayCell[] = [];
  for (let i = 0; i < WEEKS_IN_GRID * DAYS_IN_WEEK; i++) {
    const date = addDays(gridStart, i);
    cells.push({ date, inCurrentMonth: date.getMonth() === month.getMonth(), key: dayKey(date) });
  }
  return cells;
};

/** Inclusive check: is `date` within `[start, end]` (either bound may be null)? */
export const isWithinRange = (date: Date, start: Date | null, end: Date | null): boolean => {
  if (!start || !end) return false;
  const t = startOfDay(date).getTime();
  return t >= startOfDay(start).getTime() && t <= startOfDay(end).getTime();
};

export const isBefore = (a: Date, b: Date): boolean =>
  startOfDay(a).getTime() < startOfDay(b).getTime();

/** Weekday short labels ordered from `weekStartsOn`, localized. */
export const weekdayLabels = (weekStartsOn: 0 | 1, locale: string): string[] => {
  const formatter = new Intl.DateTimeFormat(locale, { weekday: 'short' });
  /** 2024-01-07 is a Sunday — a stable anchor independent of the current date. */
  const sunday = new Date(2024, 0, 7);
  const labels: string[] = [];
  for (let i = 0; i < DAYS_IN_WEEK; i++) {
    labels.push(formatter.format(addDays(sunday, (i + weekStartsOn) % DAYS_IN_WEEK)));
  }
  return labels;
};

/** Localized "month year" title, e.g. "junio 2026". */
export const monthLabel = (month: Date, locale: string): string =>
  new Intl.DateTimeFormat(locale, { month: 'long', year: 'numeric' }).format(month);

/**
 * The next range after clicking `date`, given the current range. Clicking with no
 * start (or with a completed range) starts fresh; clicking a day before the start
 * restarts from that day; clicking on/after the start completes the range.
 */
export const nextRange = (
  current: { start: Date | null; end: Date | null },
  date: Date
): { start: Date | null; end: Date | null } => {
  const picked = startOfDay(date);
  if (!current.start || current.end) return { end: null, start: picked };
  if (isBefore(picked, current.start)) return { end: null, start: picked };
  return { end: picked, start: current.start };
};
