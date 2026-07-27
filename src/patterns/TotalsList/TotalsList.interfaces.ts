/** TotalsList props. */

import type { ReactNode } from 'react';

export interface TotalsListLine {
  /** Skip the line entirely when there is nothing to show (a zero discount, no tax). */
  hidden?: boolean;
  label: string;
  value: ReactNode;
}

export interface TotalsListProps {
  /** `end` makes the block hug the right edge of its container (the usual invoice layout). */
  align?: 'end' | 'stretch';
  className?: string;
  /** The lines above the total: subtotal, discount, tax, shipping… */
  items: readonly TotalsListLine[];
  /** The emphasized final line. Omit it for a summary that has no single total. */
  total?: TotalsListLine;
}

export interface StyledTotalsListProps {
  $align: 'end' | 'stretch';
}
