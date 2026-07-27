/** Alert component props */
import type { ReactNode } from 'react';

export interface AlertProps {
  children: ReactNode;
  className?: string;
  icon?: ReactNode;
  onDismiss?: () => void;
  /**
   * Live-region role. Defaults from the variant: `alert` (assertive) for error/warning, `status`
   * (polite) for info/success. Override only when the surrounding UI already announces the change.
   */
  role?: 'alert' | 'status';
  title?: string;
  variant?: 'info' | 'success' | 'warning' | 'error';
}
