/**
 * FormActions Interfaces
 */

import type { ReactNode } from 'react';

export type FormActionsAlign = 'left' | 'right' | 'center';

export interface FormActionsProps {
  align?: FormActionsAlign;
  children: ReactNode;
  className?: string;
}

export interface StyledFormActionsProps {
  $align: FormActionsAlign;
}
