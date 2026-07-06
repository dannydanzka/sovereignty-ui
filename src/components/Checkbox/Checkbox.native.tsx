/**
 * Checkbox Component — React Native resolution
 *
 * Web keeps its hidden <input type="checkbox"> (best a11y + form semantics) and
 * a CSS ::after checkmark — neither has a native equivalent, so native gets this
 * dedicated implementation: a Pressable that toggles on press and renders the
 * checkmark as a real icon. Same public props (Checkbox.interfaces.ts).
 */

import { useCallback } from 'react';

import { c } from '../../tokens/css-variables';
import { Check } from '../../internal/icons';
import type { CheckboxProps } from './Checkbox.interfaces';

import { CheckboxBox, CheckboxLabel, CheckboxWrapper } from './Checkbox.styled';

export const Checkbox = ({
  checked = false,
  className,
  disabled = false,
  label,
  onChange,
}: CheckboxProps) => {
  const handlePress = useCallback(() => onChange?.(!checked), [checked, onChange]);

  return (
    <CheckboxWrapper
      $disabled={disabled}
      aria-label={label}
      className={className}
      disabled={disabled}
      onClick={handlePress}
    >
      <CheckboxBox $checked={checked}>
        {checked ? <Check color={c('white')} size={14} /> : null}
      </CheckboxBox>
      {label ? <CheckboxLabel>{label}</CheckboxLabel> : null}
    </CheckboxWrapper>
  );
};
