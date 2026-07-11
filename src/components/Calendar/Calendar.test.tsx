import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import {
  addMonths,
  buildMonthGrid,
  dayKey,
  isSameDay,
  isWithinRange,
  monthLabel,
  nextRange,
  weekdayLabels,
} from './Calendar.helpers';
import { Calendar } from './Calendar';

describe('Calendar helpers', () => {
  it('buildMonthGrid returns a full 6×7 grid flagging the current month', () => {
    const grid = buildMonthGrid(new Date(2026, 5, 15), 1); // June 2026, week starts Monday
    expect(grid).toHaveLength(42);
    expect(grid.filter((c) => c.inCurrentMonth)).toHaveLength(30); // June has 30 days
    // June 1 2026 is a Monday → with weekStartsOn=1 the first cell is June 1.
    expect(grid[0]?.key).toBe('2026-06-01');
  });

  it('dayKey / isSameDay are timezone-stable on local dates', () => {
    expect(dayKey(new Date(2026, 0, 5))).toBe('2026-01-05');
    expect(isSameDay(new Date(2026, 0, 5, 9), new Date(2026, 0, 5, 22))).toBe(true);
    expect(isSameDay(new Date(2026, 0, 5), new Date(2026, 0, 6))).toBe(false);
  });

  it('addMonths / monthLabel / weekdayLabels are localized and ordered', () => {
    expect(dayKey(addMonths(new Date(2026, 11, 10), 1))).toBe('2027-01-01');
    expect(monthLabel(new Date(2026, 5, 1), 'es-MX')).toContain('2026');
    expect(weekdayLabels(1, 'es-MX')).toHaveLength(7);
  });

  it('isWithinRange is inclusive and null-safe', () => {
    const a = new Date(2026, 5, 10);
    const b = new Date(2026, 5, 15);
    expect(isWithinRange(new Date(2026, 5, 12), a, b)).toBe(true);
    expect(isWithinRange(new Date(2026, 5, 10), a, b)).toBe(true);
    expect(isWithinRange(new Date(2026, 5, 16), a, b)).toBe(false);
    expect(isWithinRange(new Date(2026, 5, 12), a, null)).toBe(false);
  });

  it('nextRange starts, completes, and restarts a range', () => {
    const start = new Date(2026, 5, 10);
    const opened = nextRange({ end: null, start: null }, start);
    expect(opened).toEqual({ end: null, start });
    const completed = nextRange(opened, new Date(2026, 5, 15));
    expect(isSameDay(completed.end, new Date(2026, 5, 15))).toBe(true);
    // clicking before the start restarts
    const restarted = nextRange(opened, new Date(2026, 5, 5));
    expect(isSameDay(restarted.start, new Date(2026, 5, 5))).toBe(true);
    expect(restarted.end).toBeNull();
  });
});

describe('Calendar (web)', () => {
  it('renders the visible month title and a day grid', () => {
    render(<Calendar month={new Date(2026, 5, 1)} />);
    expect(screen.getByText(/2026/)).toBeInTheDocument();
    expect(screen.getByLabelText(/15 de junio de 2026/i)).toBeInTheDocument();
  });

  it('calls onChange with the clicked day in single mode', async () => {
    const onChange = vi.fn();
    render(<Calendar month={new Date(2026, 5, 1)} onChange={onChange} />);
    await userEvent.click(screen.getByLabelText(/12 de junio de 2026/i));
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(isSameDay(onChange.mock.calls[0]?.[0], new Date(2026, 5, 12))).toBe(true);
  });

  it('does not fire onChange for a disabled day', async () => {
    const onChange = vi.fn();
    render(
      <Calendar
        isDateDisabled={(d) => d.getDate() === 12}
        month={new Date(2026, 5, 1)}
        onChange={onChange}
      />
    );
    await userEvent.click(screen.getByLabelText(/12 de junio de 2026/i));
    expect(onChange).not.toHaveBeenCalled();
  });

  it('emits a range update in range mode', async () => {
    const onRangeChange = vi.fn();
    render(<Calendar mode='range' month={new Date(2026, 5, 1)} onRangeChange={onRangeChange} />);
    await userEvent.click(screen.getByLabelText(/10 de junio de 2026/i));
    expect(onRangeChange).toHaveBeenCalledWith(expect.objectContaining({ end: null }));
    expect(isSameDay(onRangeChange.mock.calls[0]?.[0]?.start, new Date(2026, 5, 10))).toBe(true);
  });

  it('navigates to the previous month', async () => {
    const onMonthChange = vi.fn();
    render(<Calendar month={new Date(2026, 5, 1)} onMonthChange={onMonthChange} />);
    await userEvent.click(screen.getByLabelText('Mes anterior'));
    expect(isSameDay(onMonthChange.mock.calls[0]?.[0], new Date(2026, 4, 1))).toBe(true);
  });
});
