/**
 * FormField Component Interfaces
 */

import type { ReactNode } from 'react';

export interface FormFieldProps {
  children: ReactNode;
  className?: string;
  error?: string;
  helpText?: string;
  htmlFor?: string;
  label?: string;
  required?: boolean;
}
