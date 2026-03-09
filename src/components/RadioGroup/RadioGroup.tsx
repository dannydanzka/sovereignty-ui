/**
 * RadioGroup
 */

import type { RadioGroupProps, RadioProps } from './RadioGroup.interfaces';

import { RadioInput, RadioLabel, RadioWrapper, StyledRadioGroup } from './RadioGroup.styled';

export const RadioGroup = ({ children, className, direction = 'vertical' }: RadioGroupProps) => (
  <StyledRadioGroup $direction={direction} className={className}>
    {children}
  </StyledRadioGroup>
);

export const Radio = ({
  checked = false,
  className,
  disabled = false,
  id,
  label,
  name,
  onChange,
  value,
}: RadioProps) => (
  <RadioWrapper $disabled={disabled} className={className}>
    <RadioInput
      checked={checked}
      disabled={disabled}
      id={id}
      name={name}
      type='radio'
      value={value}
      onChange={onChange}
    />
    {label && <RadioLabel>{label}</RadioLabel>}
  </RadioWrapper>
);
