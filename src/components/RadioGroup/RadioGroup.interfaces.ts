/**
 * RadioGroup Interfaces
 */

import type { ChangeEvent, ReactNode } from 'react';

export type RadioGroupDirection = 'horizontal' | 'vertical';

export interface RadioGroupProps {
  children: ReactNode;
  className?: string;
  direction?: RadioGroupDirection;
}

export interface RadioProps {
  checked?: boolean;
  className?: string;
  disabled?: boolean;
  id?: string;
  label?: string;
  name?: string;
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
  value?: string;
}

export interface StyledRadioGroupProps {
  $direction: RadioGroupDirection;
}

export interface StyledRadioWrapperProps {
  $disabled?: boolean;
}
