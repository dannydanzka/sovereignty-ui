/**
 * RadioGroup Styled Components
 */

import styled from 'styled-components';

import { color, shape, spacing, typography } from '../../tokens';
import type { StyledRadioGroupProps, StyledRadioWrapperProps } from './RadioGroup.interfaces';

export const StyledRadioGroup = styled.div<StyledRadioGroupProps>`
  display: flex;
  flex-direction: ${({ $direction }) => ($direction === 'horizontal' ? 'row' : 'column')};
  gap: ${({ $direction }) => ($direction === 'horizontal' ? spacing.sm : spacing.xs)};
`;

export const RadioWrapper = styled.label<StyledRadioWrapperProps>`
  align-items: center;
  cursor: ${({ $disabled }) => ($disabled ? 'not-allowed' : 'pointer')};
  display: inline-flex;
  gap: ${spacing.xs};
  opacity: ${({ $disabled }) => ($disabled ? 0.5 : 1)};
  user-select: none;
`;

export const RadioInput = styled.input`
  appearance: none;
  background-color: ${color.white};
  border: 2px solid ${color.border};
  border-radius: ${shape.full};
  cursor: inherit;
  height: ${spacing.sm};
  margin: 0;
  position: relative;
  transition: all 0.2s ease;
  width: ${spacing.sm};

  &:hover:not(:disabled) {
    border-color: ${color.primary400};
  }

  &:focus {
    border-color: ${color.primary500};
    box-shadow: 0 0 0 3px ${color.primary100};
    outline: none;
  }

  &:checked {
    border-color: ${color.primary500};
  }

  &:checked::after {
    background-color: ${color.primary500};
    border-radius: ${shape.full};
    content: '';
    height: ${spacing.xs};
    left: 3px;
    position: absolute;
    top: 3px;
    width: ${spacing.xs};
  }

  &:disabled {
    background-color: ${color.neutral100};
    border-color: ${color.neutral300};
  }
`;

export const RadioLabel = styled.span`
  color: ${color.textPrimary};
  font-family: ${typography.family.body};
  font-size: ${typography.size.sm};
`;
