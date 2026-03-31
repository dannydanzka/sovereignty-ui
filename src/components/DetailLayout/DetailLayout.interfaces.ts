/**
 * DetailLayout Interfaces
 */

import type { ReactNode } from 'react';

export type DetailContentBoxVariant = 'default' | 'info' | 'warning' | 'error';

export interface DetailSectionProps {
  children: ReactNode;
  className?: string;
}

export interface DetailLabelProps {
  children: ReactNode;
  className?: string;
}

export interface DetailValueProps {
  children: ReactNode;
  className?: string;
  mono?: boolean;
}

export interface DetailRowProps {
  children: ReactNode;
  className?: string;
  columns?: 2 | 3 | 4;
}

export interface DetailDividerProps {
  className?: string;
}

export interface DetailAmountProps {
  children: ReactNode;
  className?: string;
  size?: 'default' | 'large';
}

export interface DetailContentBoxProps {
  children: ReactNode;
  className?: string;
  variant?: DetailContentBoxVariant;
}

export interface StyledDetailRowProps {
  $columns: number;
}

export interface StyledDetailContentBoxProps {
  $variant: DetailContentBoxVariant;
}
