/**
 * Switch
 */

import type { SwitchProps } from './Switch.interfaces';

import { HiddenInput, Label, Track, Wrapper } from './Switch.styled';

export const Switch = ({
  checked = false,
  className,
  disabled = false,
  id,
  label,
  name,
  onChange,
}: SwitchProps) => (
  <Wrapper $disabled={disabled} className={className}>
    <HiddenInput
      checked={checked}
      disabled={disabled}
      id={id}
      name={name}
      type='checkbox'
      onChange={onChange}
    />
    <Track $checked={checked} $disabled={disabled} />
    {label && <Label>{label}</Label>}
  </Wrapper>
);
