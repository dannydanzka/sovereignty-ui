/**
 * PasswordInput Interfaces
 */

import type { ChangeEvent } from 'react';

export interface PasswordInputProps {
  autoComplete?: string;
  className?: string;
  disabled?: boolean;
  disablePaste?: boolean;
  id?: string;
  name?: string;
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
  onToggleVisibility?: () => void;
  placeholder?: string;
  showPassword?: boolean;
  value?: string;
}
