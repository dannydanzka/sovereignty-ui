/**
 * Input Styled Components
 */

import styled from 'styled-components';

import { color, shape, spacing, typography } from '../../tokens';
import type { StyledInputProps, StyledInputWrapperProps } from './Input.interfaces';

export const InputWrapper = styled.div<StyledInputWrapperProps>`
  display: flex;
  flex-direction: column;
  gap: ${spacing.xs};
  ${({ $fullWidth }) => $fullWidth && 'width: 100%;'}
`;

export const InputLabel = styled.label`
  color: ${color.textPrimary};
  font-family: ${typography.family.body};
  font-size: ${typography.size.sm};
  font-weight: ${typography.weight.medium};
`;

export const InputContainer = styled.div`
  position: relative;
  width: 100%;
`;

export const StyledInput = styled.input<StyledInputProps>`
  background-color: ${color.white};
  border: 2px solid ${({ $hasError }) => ($hasError ? color.error : color.neutral200)};
  border-radius: ${shape.md};
  color: ${color.textPrimary};
  font-family: ${typography.family.body};
  font-size: ${typography.size.base};
  min-height: ${spacing.xl};
  padding: ${spacing.sm};
  padding-right: ${({ $hasToggle }) => ($hasToggle ? '48px' : spacing.sm)};
  transition: all 0.2s ease-in-out;
  width: 100%;

  &::placeholder {
    color: ${color.textTertiary};
  }

  &:hover:not(:disabled) {
    border-color: ${({ $hasError }) => ($hasError ? color.errorDark : color.neutral300)};
  }

  &:focus {
    border-color: ${({ $hasError }) => ($hasError ? color.error : color.primary500)};
    box-shadow: 0 0 0 3px
      ${({ $hasError }) => ($hasError ? color.errorFocusShadow : color.primaryFocusShadow)};
    outline: none;
  }

  &:disabled {
    background-color: ${color.neutral50};
    color: ${color.textDisabled};
    cursor: not-allowed;
  }
`;

export const PasswordToggle = styled.button`
  align-items: center;
  background: transparent;
  border: none;
  cursor: pointer;
  display: flex;
  font-size: ${typography.size.lg};
  height: 100%;
  justify-content: center;
  padding: 0 ${spacing.sm};
  position: absolute;
  right: 0;
  top: 0;

  &:hover {
    opacity: 0.7;
  }

  &:focus-visible {
    outline: 2px solid ${color.primary500};
    outline-offset: -2px;
  }
`;

export const InputError = styled.span`
  color: ${color.error};
  font-family: ${typography.family.body};
  font-size: ${typography.size.xs};
`;

export const InputRequired = styled.span`
  color: ${color.error};
  margin-left: ${spacing.micro};
`;
