/**
 * QuantityStepper
 *
 * A quantity as a − n + pill: the keys step and clamp at one; typing passes through untouched,
 * because the caller's schema is the validator (a clamp on the input path lets `NaN` masquerade as
 * a corrected value). Assistive copy for the two keys arrives via the required `texts` prop — the
 * library has no language.
 */

import { Minus, Plus } from 'lucide-react';
import { useCallback } from 'react';

import { Input } from '../../components/Input';
import type { QuantityStepperProps } from './QuantityStepper.interfaces';
import { STEPPER_ICON_SIZE, STEPPER_MIN } from './QuantityStepper.constants';

import {
  StepperButton,
  StepperField,
  StepperLabel,
  StepperLabelHidden,
  StepperPill,
} from './QuantityStepper.styled';

export const QuantityStepper = ({
  hideLabel = false,
  id,
  label,
  name,
  onChange,
  texts,
  value,
}: QuantityStepperProps) => {
  const Label = hideLabel ? StepperLabelHidden : StepperLabel;

  const decrement = useCallback(() => {
    if (value > STEPPER_MIN) onChange(String(value - 1));
  }, [onChange, value]);
  const increment = useCallback(() => onChange(String(value + 1)), [onChange, value]);

  return (
    <StepperField>
      <Label htmlFor={id}>{label}</Label>
      <StepperPill element='div' padding='none' variant='outlined'>
        {/* `icon` + `iconOnly` is the icon-button contract: it centres the glyph and sizes the hit
            area, which a bare child cannot do. */}
        <StepperButton
          aria-label={texts.decrease}
          icon={<Minus aria-hidden='true' size={STEPPER_ICON_SIZE} />}
          iconOnly
          type='button'
          variant='ghost'
          onClick={decrement}
        />
        <Input
          id={id}
          min={STEPPER_MIN}
          name={name}
          type='number'
          value={String(value)}
          onChange={onChange}
        />
        <StepperButton
          aria-label={texts.increase}
          icon={<Plus aria-hidden='true' size={STEPPER_ICON_SIZE} />}
          iconOnly
          type='button'
          variant='ghost'
          onClick={increment}
        />
      </StepperPill>
    </StepperField>
  );
};
