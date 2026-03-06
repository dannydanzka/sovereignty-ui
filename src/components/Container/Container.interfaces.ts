/**
 * Container Component Interfaces
 */

import type { ReactNode } from 'react';

export type ContainerSize = 'full' | 'large' | 'medium' | 'small';

export interface ContainerProps {
  children: ReactNode;
  size?: ContainerSize;
}
