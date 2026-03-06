/**
 * StatsCard Component Interfaces
 */

import type { ReactNode } from 'react';

export interface StatsCardProps {
  className?: string;
  icon?: ReactNode;
  label: string;
  sublabel?: string;
  value: number | string;
  variant?: 'default' | 'primary' | 'success' | 'warning';
}
