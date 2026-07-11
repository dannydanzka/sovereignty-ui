/**
 * Calendar Component — React Native resolution.
 *
 * Same public props and pure date math as the web resolution (Calendar.helpers.ts).
 * Native diverges in rendering only: the grid is a flex-wrap of Pressables and each
 * day number is a Text (see CalendarDay.native.tsx).
 */

import { useCallback, useMemo, useState } from 'react';

import {
  addMonths,
  buildMonthGrid,
  isBefore,
  isSameDay,
  isWithinRange,
  monthLabel,
  nextRange,
  startOfMonth,
  weekdayLabels,
} from './Calendar.helpers';
import { c } from '../../tokens/css-variables';
import { CalendarDay } from './CalendarDay';
import type { CalendarProps } from './Calendar.interfaces';
import { ChevronLeft, ChevronRight } from '../../internal/icons';

import {
  CalendarHeader,
  CalendarTitle,
  CalendarWrapper,
  DayGrid,
  NavButton,
  WeekdayCell,
  WeekdayRow,
} from './Calendar.styled';

const DEFAULT_LOCALE = 'es-MX';

export const Calendar = ({
  className,
  defaultMonth,
  isDateDisabled,
  locale = DEFAULT_LOCALE,
  maxDate,
  minDate,
  mode = 'single',
  month,
  nextMonthLabel = 'Mes siguiente',
  onChange,
  onMonthChange,
  onRangeChange,
  prevMonthLabel = 'Mes anterior',
  rangeValue,
  value,
  weekStartsOn = 1,
}: CalendarProps) => {
  const [internalMonth, setInternalMonth] = useState(() =>
    startOfMonth(month ?? defaultMonth ?? value ?? rangeValue?.start ?? new Date())
  );
  const visibleMonth = month ? startOfMonth(month) : internalMonth;
  const today = useMemo(() => new Date(), []);

  const goToMonth = useCallback(
    (target: Date) => {
      onMonthChange?.(target);
      if (!month) setInternalMonth(target);
    },
    [month, onMonthChange]
  );
  const goPrev = useCallback(
    () => goToMonth(addMonths(visibleMonth, -1)),
    [goToMonth, visibleMonth]
  );
  const goNext = useCallback(
    () => goToMonth(addMonths(visibleMonth, 1)),
    [goToMonth, visibleMonth]
  );

  const dayDisabled = useCallback(
    (date: Date): boolean =>
      (minDate ? isBefore(date, minDate) : false) ||
      (maxDate ? isBefore(maxDate, date) : false) ||
      (isDateDisabled?.(date) ?? false),
    [isDateDisabled, maxDate, minDate]
  );

  const handleSelect = useCallback(
    (date: Date) => {
      if (mode === 'range') {
        onRangeChange?.(nextRange(rangeValue ?? { end: null, start: null }, date));
        return;
      }
      onChange?.(date);
    },
    [mode, onChange, onRangeChange, rangeValue]
  );

  const cells = useMemo(
    () => buildMonthGrid(visibleMonth, weekStartsOn),
    [visibleMonth, weekStartsOn]
  );
  const weekdays = useMemo(() => weekdayLabels(weekStartsOn, locale), [locale, weekStartsOn]);
  const dayFormatter = useMemo(
    () => new Intl.DateTimeFormat(locale, { day: 'numeric', month: 'long', year: 'numeric' }),
    [locale]
  );

  const isSelected = (date: Date): boolean =>
    mode === 'range'
      ? isSameDay(date, rangeValue?.start ?? null) || isSameDay(date, rangeValue?.end ?? null)
      : isSameDay(date, value ?? null);

  return (
    <CalendarWrapper className={className}>
      <CalendarHeader>
        <NavButton aria-label={prevMonthLabel} onClick={goPrev}>
          <ChevronLeft color={c('textSecondary')} size={18} />
        </NavButton>
        <CalendarTitle>{monthLabel(visibleMonth, locale)}</CalendarTitle>
        <NavButton aria-label={nextMonthLabel} onClick={goNext}>
          <ChevronRight color={c('textSecondary')} size={18} />
        </NavButton>
      </CalendarHeader>

      <WeekdayRow>
        {weekdays.map((label, i) => (
          <WeekdayCell key={`${label}-${i}`}>{label}</WeekdayCell>
        ))}
      </WeekdayRow>

      <DayGrid>
        {cells.map((cell) => {
          const selected = isSelected(cell.date);
          return (
            <CalendarDay
              cell={cell}
              disabled={dayDisabled(cell.date)}
              inRange={
                mode === 'range' &&
                !selected &&
                isWithinRange(cell.date, rangeValue?.start ?? null, rangeValue?.end ?? null)
              }
              key={cell.key}
              label={dayFormatter.format(cell.date)}
              selected={selected}
              today={isSameDay(cell.date, today)}
              onSelect={handleSelect}
            />
          );
        })}
      </DayGrid>
    </CalendarWrapper>
  );
};
