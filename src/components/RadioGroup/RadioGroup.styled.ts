/**
 * RadioGroup Styled Components
 */

import styled from 'styled-components';

import { c, s, sh, tf, ts } from '../../tokens/css-variables';
import type { StyledRadioGroupProps, StyledRadioWrapperProps } from './RadioGroup.interfaces';

export const StyledRadioGroup = styled.div<StyledRadioGroupProps>`
  display: flex;
  flex-direction: ${({ $direction }) => ($direction === 'horizontal' ? 'row' : 'column')};
  gap: ${({ $direction }) => ($direction === 'horizontal' ? s('sm') : s('xs'))};
`;

export const RadioWrapper = styled.label<StyledRadioWrapperProps>`
  align-items: center;
  cursor: ${({ $disabled }) => ($disabled ? 'not-allowed' : 'pointer')};
  display: inline-flex;
  gap: ${s('xs')};
  opacity: ${({ $disabled }) => ($disabled ? 0.5 : 1)};
  user-select: none;
`;

export const RadioInput = styled.input`
  appearance: none;
  background-color: ${c('white')};
  border: 2px solid ${c('border')};
  border-radius: ${sh('full')};
  cursor: inherit;
  height: ${s('sm')};
  margin: 0;
  position: relative;
  transition: all 0.2s ease;
  width: ${s('sm')};

  &:hover:not(:disabled) {
    border-color: ${c('primary400')};
  }

  &:focus {
    border-color: ${c('primary500')};
    box-shadow: 0 0 0 3px ${c('primary100')};
    outline: none;
  }

  &:checked {
    border-color: ${c('primary500')};
  }

  &:checked::after {
    background-color: ${c('primary500')};
    border-radius: ${sh('full')};
    content: '';
    height: ${s('xs')};
    left: 3px;
    position: absolute;
    top: 3px;
    width: ${s('xs')};
  }

  &:disabled {
    background-color: ${c('neutral100')};
    border-color: ${c('neutral300')};
  }
`;

export const RadioLabel = styled.span`
  color: ${c('textPrimary')};
  font-family: ${tf('body')};
  font-size: ${ts('sm')};
`;
