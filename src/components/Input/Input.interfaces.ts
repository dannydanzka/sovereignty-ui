/**
 * Input Component Interfaces
 */

export type InputType = 'date' | 'email' | 'number' | 'password' | 'tel' | 'text';

export interface InputProps {
  autoComplete?: string;
  disabled?: boolean;
  error?: string;
  fullWidth?: boolean;
  hidePasswordLabel?: string;
  id: string;
  /** On-screen keyboard hint, independent of `type` (e.g. numeric keypad for a code). */
  inputMode?: 'decimal' | 'email' | 'numeric' | 'search' | 'tel' | 'text' | 'url';
  label?: string;
  /** Upper bound for `number` / latest day for `date`. Web-only; also validate in the schema. */
  max?: number | string;
  /** Hard cap on the value length (native `maxLength`). Also drives the counter. */
  maxLength?: number;
  /** Lower bound for `number` / earliest day for `date`. Web-only; also validate in the schema. */
  min?: number | string;
  name: string;
  onBlur?: () => void;
  onChange?: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  /** Render a `current/max` counter under the field. Requires `maxLength`. */
  showCount?: boolean;
  showPasswordLabel?: string;
  /** Granularity for `number` (e.g. `0.01` for money) / `date`. Web-only. */
  step?: number | string;
  type?: InputType;
  value?: string;
}

export interface StyledInputWrapperProps {
  $fullWidth?: boolean;
}

export interface StyledInputProps {
  $hasError?: boolean;
  $hasToggle?: boolean;
}
