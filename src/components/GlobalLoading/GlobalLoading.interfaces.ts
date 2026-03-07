/** GlobalLoading component props */
import type { ReactNode } from 'react';

export interface GlobalLoadingProps {
  children?: ReactNode;
  className?: string;
  isVisible: boolean;
  text?: string;
}
