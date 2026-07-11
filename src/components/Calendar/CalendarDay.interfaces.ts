/** Props for a single Calendar day cell (internal — not part of the public barrel). */
import type { CalendarDayCell } from './Calendar.interfaces';

export interface CalendarDayProps {
  cell: CalendarDayCell;
  /** Accessible full-date label (localized), e.g. "12 de junio de 2026". */
  label: string;
  selected: boolean;
  inRange: boolean;
  disabled: boolean;
  today: boolean;
  onSelect: (date: Date) => void;
}
