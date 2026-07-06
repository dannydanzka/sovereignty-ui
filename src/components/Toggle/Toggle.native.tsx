/**
 * Toggle Component — React Native resolution
 *
 * Web keeps its hidden <input> + CSS transform thumb; native uses a Pressable
 * that toggles on press with an absolutely-positioned thumb. Same public props
 * (Toggle.interfaces.ts).
 */

import { useCallback } from 'react';

import type { ToggleProps } from './Toggle.interfaces';

import { ToggleLabel, ToggleThumb, ToggleTrack, ToggleWrapper } from './Toggle.styled';

export const Toggle = ({
  checked = false,
  className,
  disabled = false,
  label,
  onChange,
  size = 'md',
}: ToggleProps) => {
  const handlePress = useCallback(() => onChange?.(!checked), [checked, onChange]);

  return (
    <ToggleWrapper
      $disabled={disabled}
      aria-label={label}
      className={className}
      disabled={disabled}
      onClick={handlePress}
    >
      <ToggleTrack $checked={checked} $size={size}>
        <ToggleThumb $checked={checked} $size={size} />
      </ToggleTrack>
      {label ? <ToggleLabel>{label}</ToggleLabel> : null}
    </ToggleWrapper>
  );
};
