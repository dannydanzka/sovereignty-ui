/**
 * FormError Interfaces
 */

import type { ReactNode } from 'react';

export type FormErrorVariant = 'form' | 'field';

export interface FormErrorProps {
  children: ReactNode;
  className?: string;
  variant?: FormErrorVariant;
}

export interface StyledFormErrorProps {
  $variant: FormErrorVariant;
}
