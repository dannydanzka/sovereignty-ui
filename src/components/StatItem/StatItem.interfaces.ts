/**
 * StatItem Interfaces
 */

import type { ReactNode } from 'react';

export type StatVariant = 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'info';

export interface StatItemProps {
  className?: string;
  icon?: ReactNode;
  label: string;
  value: number | string;
  variant?: StatVariant;
}

export interface StatsBarProps {
  children: ReactNode;
  className?: string;
}

export interface StatsGridProps {
  children: ReactNode;
  className?: string;
  columns?: 2 | 3 | 4;
}

export interface StyledStatItemProps {
  $variant: StatVariant;
}

export interface StyledStatsGridProps {
  $columns: number;
}
