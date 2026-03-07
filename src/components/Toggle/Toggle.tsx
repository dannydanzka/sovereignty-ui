/**
 * Toggle Component
 *
 * Toggle switch with optional label.
 */

import { useCallback } from 'react';

import type { ToggleProps } from './Toggle.interfaces';

import { HiddenInput, ToggleLabel, ToggleThumb, ToggleTrack, ToggleWrapper } from './Toggle.styled';

export const Toggle = ({
  checked = false,
  className,
  disabled = false,
  id,
  label,
  name,
  onChange,
  size = 'md',
}: ToggleProps) => {
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      onChange?.(e.target.checked);
    },
    [onChange]
  );

  return (
    <ToggleWrapper $disabled={disabled} className={className}>
      <HiddenInput
        checked={checked}
        disabled={disabled}
        id={id ?? name}
        name={name}
        type='checkbox'
        onChange={handleChange}
      />
      <ToggleTrack $checked={checked} $size={size}>
        <ToggleThumb $checked={checked} $size={size} />
      </ToggleTrack>
      {label && <ToggleLabel>{label}</ToggleLabel>}
    </ToggleWrapper>
  );
};
