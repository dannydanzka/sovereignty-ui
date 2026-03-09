/**
 * ErrorState Interfaces
 */

import type { ReactNode } from 'react';

export interface ErrorStateProps {
  action?: ReactNode;
  className?: string;
  icon?: ReactNode;
  message?: string;
  title?: string;
}
