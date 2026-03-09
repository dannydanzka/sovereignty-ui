/**
 * PasswordInput Styled Components
 */

import styled from 'styled-components';

import { color, shape, spacing, typography } from '../../tokens';

export const Wrapper = styled.div`
  position: relative;
  width: 100%;
`;

export const Input = styled.input<{ $hasIcon?: boolean }>`
  background: ${color.white};
  border: 1px solid ${color.border};
  border-radius: ${shape.md};
  color: ${color.textPrimary};
  font-family: ${typography.family.body};
  font-size: ${typography.size.sm};
  padding: ${spacing.xs};
  padding-right: ${({ $hasIcon }) => ($hasIcon ? '48px' : spacing.xs)};
  transition:
    border-color 0.2s ease,
    box-shadow 0.2s ease;
  width: 100%;

  &::placeholder {
    color: ${color.textTertiary};
  }

  &:hover:not(:disabled) {
    border-color: ${color.primary300};
  }

  &:focus {
    border-color: ${color.primary500};
    box-shadow: 0 0 0 3px ${color.primary100};
    outline: none;
  }

  &:disabled {
    background: ${color.neutral100};
    cursor: not-allowed;
  }
`;

export const ToggleButton = styled.button`
  align-items: center;
  background: transparent;
  border: none;
  color: ${color.textTertiary};
  cursor: pointer;
  display: flex;
  padding: ${spacing.xs};
  position: absolute;
  right: ${spacing.micro};
  top: 50%;
  transform: translateY(-50%);
  transition: color 0.2s ease;

  &:hover:not(:disabled) {
    color: ${color.textPrimary};
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }
`;
