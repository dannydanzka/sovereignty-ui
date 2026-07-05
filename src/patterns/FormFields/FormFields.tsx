/**
 * FormFields Patterns
 *
 * TextField / SelectField / TextareaField — SUI form controls (which already
 * render their own label and error) extended with FormField help text.
 * Replaces the per-project Form*Field duplicates with a single composition.
 */

import { FormField } from '../FormField';
import { Input } from '../../components/Input';
import { Select } from '../../components/Select';
import type { SelectFieldProps, TextareaFieldProps, TextFieldProps } from './FormFields.interfaces';
import { Textarea } from '../../components/Textarea';

export const TextField = ({
  autoComplete,
  className,
  disabled = false,
  error,
  helpText,
  id,
  label,
  name,
  onChange,
  placeholder,
  required = false,
  type = 'text',
  value,
}: TextFieldProps) => (
  <FormField className={className} helpText={error ? undefined : helpText}>
    <Input
      autoComplete={autoComplete}
      disabled={disabled}
      error={error}
      fullWidth
      id={id}
      label={label}
      name={name ?? id}
      placeholder={placeholder}
      required={required}
      type={type}
      value={value}
      onChange={onChange}
    />
  </FormField>
);

export const SelectField = ({
  className,
  disabled = false,
  error,
  helpText,
  id,
  label,
  name,
  onChange,
  options,
  placeholder,
  required = false,
  value,
}: SelectFieldProps) => (
  <FormField className={className} helpText={error ? undefined : helpText}>
    <Select
      disabled={disabled}
      error={error}
      id={id}
      label={label}
      name={name ?? id}
      options={options}
      placeholder={placeholder}
      required={required}
      value={value}
      onChange={onChange}
    />
  </FormField>
);

export const TextareaField = ({
  className,
  disabled = false,
  error,
  helpText,
  id,
  label,
  maxLength,
  name,
  onChange,
  placeholder,
  required = false,
  rows,
  showCount = false,
  value,
}: TextareaFieldProps) => (
  <FormField className={className} helpText={error ? undefined : helpText}>
    <Textarea
      disabled={disabled}
      error={error}
      id={id}
      label={label}
      maxLength={maxLength}
      name={name ?? id}
      placeholder={placeholder}
      required={required}
      rows={rows}
      showCount={showCount}
      value={value}
      onChange={onChange}
    />
  </FormField>
);
