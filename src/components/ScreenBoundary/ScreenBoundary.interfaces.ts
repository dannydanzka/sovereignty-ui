/**
 * ScreenBoundary Interfaces
 */

import type { ReactNode } from 'react';

export interface ScreenBoundaryProps {
  children: ReactNode;
  className?: string;
  error?: string | null;
  errorAction?: ReactNode;
  errorTitle?: string;
  isLoading: boolean;
  loadingMessage?: string;
  title: string;
}
