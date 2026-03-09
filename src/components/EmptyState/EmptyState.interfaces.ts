/**
 * EmptyState Interfaces
 */

import type { ReactNode } from 'react';

export interface EmptyStateProps {
  action?: ReactNode;
  className?: string;
  icon?: ReactNode;
  message?: string;
  title?: string;
}
