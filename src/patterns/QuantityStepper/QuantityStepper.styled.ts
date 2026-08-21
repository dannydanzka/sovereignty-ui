/**
 * QuantityStepper Styled Components
 */

import styled from 'styled-components';

import { Button } from '../../components/Button';
import { c, s, tf, ts, tw } from '../../tokens/css-variables';
import { Card } from '../../components/Card';
import { STEPPER_INPUT_WIDTH } from './QuantityStepper.constants';

export const StepperField = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${s('micro')};
  /* The anchor for a hidden label: absolutely positioned, it must not escape to the document. */
  position: relative;
`;

export const StepperLabel = styled.label`
  color: ${c('textSecondary')};
  font-family: ${tf('body')};
  font-size: ${ts('sm')};
  font-weight: ${tw('semibold')};
`;

/**
 * The same label, still associated with the input, taken out of the visual flow — for rows where a
 * visible caption would make the stepper column taller than its neighbour. Deleting the label
 * instead would leave the number with no accessible name.
 */
export const StepperLabelHidden = styled(StepperLabel)`
  clip-path: inset(50%);
  height: 1px;
  overflow: hidden;
  position: absolute;
  white-space: nowrap;
  width: 1px;
`;

/**
 * ONE control, not three: the border lives on this box and the keys and the number sit inside it
 * borderless — two outlined buttons beside an outlined input read as three separate fields that
 * happen to be adjacent. The box is the `Card` (`variant="outlined"`, `padding="none"`); only the
 * row layout is here. The inner `& input` reset reaches the `Input`, which owns a border, a
 * background and a `min-height` that would draw a second frame inside this one.
 */
export const StepperPill = styled(Card)`
  align-items: stretch;
  display: flex;
  overflow: hidden;
  width: fit-content;

  & > div {
    width: ${STEPPER_INPUT_WIDTH};
  }

  & input {
    background: transparent;
    border: none;
    border-radius: 0;
    font-weight: ${tw('semibold')};
    padding-inline: 0;
    text-align: center;

    &:focus,
    &:focus-visible {
      box-shadow: none;
      outline: none;
    }
  }

  /* The native spin buttons compete with the two keys that replace them. */
  & input::-webkit-outer-spin-button,
  & input::-webkit-inner-spin-button {
    appearance: none;
    margin: 0;
  }
`;

/**
 * The two keys. Each **stretches to the pill** and centres its own content, so the glyph is centred
 * by construction rather than by a padding that has to be re-tuned whenever the row grows.
 */
export const StepperButton = styled(Button)`
  && {
    align-items: center;
    background: transparent;
    border: none;
    border-radius: 0;
    color: ${c('textPrimary')};
    display: flex;
    flex-shrink: 0;
    justify-content: center;
    min-height: 0;
    padding-block: 0;
    padding-inline: ${s('xs')};

    &:hover:not(:disabled) {
      background: ${c('neutral100')};
    }
  }
`;
