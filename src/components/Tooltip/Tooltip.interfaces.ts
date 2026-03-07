/** Tooltip component props */
import type { ReactNode } from 'react';

export interface TooltipProps {
  children: ReactNode;
  className?: string;
  content: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
}
