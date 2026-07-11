/** Calendar component props — a month-grid date picker (single date or range). */

export interface CalendarDayCell {
  /** Local midnight of the day. */
  date: Date;
  /** Stable `YYYY-MM-DD` key (local). */
  key: string;
  /** Whether the day belongs to the month being displayed. */
  inCurrentMonth: boolean;
}

export type CalendarMode = 'single' | 'range';

export interface CalendarRange {
  start: Date | null;
  end: Date | null;
}

export interface CalendarProps {
  /** Selection mode. Default `'single'`. */
  mode?: CalendarMode;
  /** Selected date (single mode). */
  value?: Date | null;
  /** Selected range (range mode). */
  rangeValue?: CalendarRange;
  /** Fires with the picked date (single mode). */
  onChange?: (date: Date) => void;
  /** Fires with the updated range (range mode). */
  onRangeChange?: (range: CalendarRange) => void;
  /** A date within the month to display (controlled month). */
  month?: Date;
  /** Default visible month (uncontrolled) — falls back to the selection or today. */
  defaultMonth?: Date;
  /** Fires when the user navigates to another month. */
  onMonthChange?: (month: Date) => void;
  /** Return `true` to block a day (e.g. no availability). Blocked days are not selectable. */
  isDateDisabled?: (date: Date) => boolean;
  /** Hard lower bound — days before this are disabled. */
  minDate?: Date;
  /** Hard upper bound — days after this are disabled. */
  maxDate?: Date;
  /** First column of the week: `0` = Sunday, `1` = Monday. Default `1`. */
  weekStartsOn?: 0 | 1;
  /** BCP-47 locale for the month title and weekday labels. Default `'es-MX'`. */
  locale?: string;
  /** Accessible label for the previous-month button. Default `'Mes anterior'`. */
  prevMonthLabel?: string;
  /** Accessible label for the next-month button. Default `'Mes siguiente'`. */
  nextMonthLabel?: string;
  className?: string;
}
