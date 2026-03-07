/**
 * Checkbox Component
 *
 * Styled checkbox with custom visual and label.
 */

import { useCallback } from 'react';

import type { CheckboxProps } from './Checkbox.interfaces';

import { CheckboxBox, CheckboxLabel, CheckboxWrapper, HiddenInput } from './Checkbox.styled';

export const Checkbox = ({
  checked = false,
  className,
  disabled = false,
  id,
  label,
  name,
  onChange,
}: CheckboxProps) => {
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      onChange?.(e.target.checked);
    },
    [onChange]
  );

  return (
    <CheckboxWrapper $disabled={disabled} className={className}>
      <HiddenInput
        checked={checked}
        disabled={disabled}
        id={id ?? name}
        name={name}
        type='checkbox'
        onChange={handleChange}
      />
      <CheckboxBox $checked={checked} />
      {label && <CheckboxLabel>{label}</CheckboxLabel>}
    </CheckboxWrapper>
  );
};
