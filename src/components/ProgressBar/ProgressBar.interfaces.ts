/**
 * ProgressBar Component Interfaces
 */

import type { ReactNode } from 'react';

export interface ProgressBarProps {
  className?: string;
  label?: string;
  max?: number;
  showPercentage?: boolean;
  size?: 'large' | 'medium' | 'small';
  /**
   * Replaces the percentage on the right with your own reading of the same progress — "$400 / $1,200",
   * "3 de 8". A payment bar is the common case: the number that matters is the money, not the percent,
   * and without this the caller has to render its own row next to the bar and end up showing both.
   */
  valueLabel?: ReactNode;
  value: number;
  variant?: 'default' | 'success' | 'warning';
}
