/**
 * Calendar day cell — web resolution. Owns a memoized click handler so the parent
 * grid passes a stable `onSelect(date)` without binding per cell in JSX.
 */

import { useCallback } from 'react';

import type { CalendarDayProps } from './CalendarDay.interfaces';

import { DayCell } from './Calendar.styled';

export const CalendarDay = ({
  cell,
  disabled,
  inRange,
  label,
  onSelect,
  selected,
  today,
}: CalendarDayProps) => {
  const handleClick = useCallback(() => onSelect(cell.date), [cell.date, onSelect]);

  return (
    <DayCell
      $inRange={inRange}
      $outside={!cell.inCurrentMonth}
      $selected={selected}
      $today={today}
      aria-label={label}
      disabled={disabled}
      type='button'
      onClick={handleClick}
    >
      {cell.date.getDate()}
    </DayCell>
  );
};
