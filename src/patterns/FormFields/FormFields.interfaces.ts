/**
 * FormFields Pattern Interfaces
 *
 * Ready-to-use field compositions: FormField wrapper (label + error + help)
 * around SUI form controls.
 */

import type { InputType } from '../../components/Input';
import type { SelectOption } from '../../components/Select';

interface BaseFieldProps {
  className?: string;
  disabled?: boolean;
  error?: string;
  helpText?: string;
  id: string;
  label: string;
  name?: string;
  required?: boolean;
}

export interface TextFieldProps extends BaseFieldProps {
  autoComplete?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  type?: InputType;
  value?: string;
}

export interface SelectFieldProps extends BaseFieldProps {
  onChange?: (value: string) => void;
  options: SelectOption[];
  placeholder?: string;
  value?: string;
}

export interface TextareaFieldProps extends BaseFieldProps {
  maxLength?: number;
  onChange?: (value: string) => void;
  placeholder?: string;
  rows?: number;
  showCount?: boolean;
  value?: string;
}
