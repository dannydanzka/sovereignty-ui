/**
 * StatsCard Component Interfaces
 */

import type { ReactNode } from 'react';

export type StatsCardVariant = 'danger' | 'default' | 'info' | 'primary' | 'success' | 'warning';

export interface StatsCardProps {
  className?: string;
  icon?: ReactNode;
  label: string;
  sublabel?: string;
  value: number | string;
  variant?: StatsCardVariant;
}

export interface StyledStatsCardProps {
  $variant: StatsCardVariant;
}
