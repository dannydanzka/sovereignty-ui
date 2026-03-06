/**
 * Card Component Interfaces
 */

import type { ReactNode } from 'react';

export interface CardProps {
  children: ReactNode;
  onClick?: () => void;
  padding?: 'large' | 'medium' | 'none' | 'small';
}
