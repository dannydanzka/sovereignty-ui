/** ErrorFallback component interfaces */
import type { ReactNode } from 'react';

export interface ErrorAction {
  label: string;
  onClick: () => void;
}

export interface ErrorFallbackProps {
  actions?: ErrorAction[];
  className?: string;
  description?: string;
  icon?: ReactNode;
  onRetry?: () => void;
  retryLabel?: string;
  title?: string;
}
