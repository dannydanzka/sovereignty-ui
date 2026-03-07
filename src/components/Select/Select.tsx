/**
 * Select Component
 *
 * Styled dropdown select with label and error support.
 */

import { useCallback } from 'react';

import type { SelectProps } from './Select.interfaces';

import {
  SelectError,
  SelectLabel,
  SelectOption,
  SelectWrapper,
  StyledSelect,
} from './Select.styled';

export const Select = ({
  className,
  disabled = false,
  error,
  id,
  label,
  name,
  onChange,
  options,
  placeholder,
  required = false,
  size = 'md',
  value,
}: SelectProps) => {
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      onChange?.(e.target.value);
    },
    [onChange]
  );

  const selectId = id ?? name;

  return (
    <SelectWrapper className={className}>
      {label && <SelectLabel htmlFor={selectId}>{label}</SelectLabel>}
      <StyledSelect
        $hasError={Boolean(error)}
        $size={size}
        disabled={disabled}
        id={selectId}
        name={name}
        required={required}
        value={value}
        onChange={handleChange}
      >
        {placeholder && (
          <SelectOption disabled value=''>
            {placeholder}
          </SelectOption>
        )}
        {options.map((option) => (
          <SelectOption disabled={option.disabled} key={option.value} value={option.value}>
            {option.label}
          </SelectOption>
        ))}
      </StyledSelect>
      {error && <SelectError>{error}</SelectError>}
    </SelectWrapper>
  );
};
