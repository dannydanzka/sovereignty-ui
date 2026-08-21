/**
 * Select Styled Components
 */

import styled from 'styled-components';

import { c, s, tf, ts, tw } from '../../tokens/css-variables';
import { FORM_CONTROL_SIZES, formControlFrame } from '../../internal/form-control';
import type { FormControlSize } from '../../internal/form-control';

export const SelectWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${s('micro')};
  width: 100%;
`;

export const SelectLabel = styled.label`
  color: ${c('textPrimary')};
  font-family: ${tf('body')};
  font-size: ${ts('sm')};
  font-weight: ${tw('medium')};
`;

/** See `TextareaRequired` — the same marker `Input` has always had. */
export const SelectRequired = styled.span`
  color: ${c('error')};
  margin-left: ${s('micro')};
`;

export const StyledSelect = styled.select<{
  $hasError: boolean;
  $size: FormControlSize;
}>`
  ${formControlFrame}
  ${({ $size }) => FORM_CONTROL_SIZES[$size]}
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%234A5568' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");
  background-position: right ${s('xs')} center;
  background-repeat: no-repeat;
  cursor: pointer;
  font-family: ${tf('body')};
  /* The arrow occupies the right edge, so the text must stop before it. */
  padding-right: ${s('lg')};
  width: 100%;
`;

export const SelectError = styled.span`
  color: ${c('error')};
  font-family: ${tf('body')};
  font-size: ${ts('xs')};
`;

export const SelectOption = styled.option``;
