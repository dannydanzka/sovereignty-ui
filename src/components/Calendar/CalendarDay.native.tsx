/**
 * Calendar day cell — React Native resolution. Same memoized handler as web; the day
 * number is a DayCellLabel Text because native Pressable can't render raw text and
 * Text does not inherit color from its parent.
 */

import { useCallback } from 'react';

import type { CalendarDayProps } from './CalendarDay.interfaces';

import { DayCell, DayCellLabel } from './Calendar.styled';

export const CalendarDay = ({
  cell,
  disabled,
  inRange,
  label,
  onSelect,
  selected,
  today,
}: CalendarDayProps) => {
  const handlePress = useCallback(() => onSelect(cell.date), [cell.date, onSelect]);

  return (
    <DayCell
      $inRange={inRange}
      $selected={selected}
      $today={today}
      aria-label={label}
      disabled={disabled}
      onClick={handlePress}
    >
      <DayCellLabel $disabled={disabled} $outside={!cell.inCurrentMonth} $selected={selected}>
        {cell.date.getDate()}
      </DayCellLabel>
    </DayCell>
  );
};
