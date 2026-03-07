/** Alert component props */
import type { ReactNode } from 'react';

export interface AlertProps {
  children: ReactNode;
  className?: string;
  icon?: ReactNode;
  onDismiss?: () => void;
  title?: string;
  variant?: 'info' | 'success' | 'warning' | 'error';
}
