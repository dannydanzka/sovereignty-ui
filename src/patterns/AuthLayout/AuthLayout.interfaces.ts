/**
 * AuthLayout Pattern Interfaces
 */

import type { ReactNode } from 'react';

export interface AuthLayoutProps {
  children: ReactNode;
  className?: string;
  leftSlot?: ReactNode;
  rightSlot?: ReactNode;
  subtitle?: string;
  title?: string;
}

export interface AuthCardProps {
  children: ReactNode;
  className?: string;
}
