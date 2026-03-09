/**
 * ModalFooter Interfaces
 */

import type { ReactNode } from 'react';

export type ModalFooterAlign = 'left' | 'right' | 'space-between';

export interface ModalFooterProps {
  align?: ModalFooterAlign;
  children: ReactNode;
  className?: string;
}

export interface StyledModalFooterProps {
  $align: ModalFooterAlign;
}
