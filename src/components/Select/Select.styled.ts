/**
 * Select Styled Components
 */

import styled, { css } from 'styled-components';

import { color, shape, spacing, typography } from '../../tokens';

const SIZE_STYLES = {
  lg: css`
    font-size: ${typography.size.base};
    min-height: ${spacing.lg};
    padding: ${spacing.xs} ${spacing.md};
  `,
  md: css`
    font-size: ${typography.size.sm};
    min-height: ${spacing.md};
    padding: ${spacing.xs} ${spacing.sm};
  `,
  sm: css`
    font-size: ${typography.size.xs};
    min-height: ${spacing.sm};
    padding: ${spacing.micro} ${spacing.sm};
  `,
} as const;

export const SelectWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${spacing.micro};
  width: 100%;
`;

export const SelectLabel = styled.label`
  color: ${color.textPrimary};
  font-family: ${typography.family.body};
  font-size: ${typography.size.sm};
  font-weight: ${typography.weight.medium};
`;

export const StyledSelect = styled.select<{
  $hasError: boolean;
  $size: 'sm' | 'md' | 'lg';
}>`
  appearance: none;
  background-color: ${color.white};
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%234A5568' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");
  background-position: right ${spacing.xs} center;
  background-repeat: no-repeat;
  border: 1px solid ${({ $hasError }) => ($hasError ? color.error : color.border)};
  border-radius: ${shape.md};
  color: ${color.textPrimary};
  cursor: pointer;
  font-family: ${typography.family.body};
  outline: none;
  padding-right: ${spacing.lg};
  transition:
    border-color 0.2s ease,
    box-shadow 0.2s ease;
  width: 100%;

  ${({ $size }) => SIZE_STYLES[$size]}

  &:focus {
    border-color: ${({ $hasError }) => ($hasError ? color.error : color.primary500)};
    box-shadow: 0 0 0 3px
      ${({ $hasError }) => ($hasError ? color.errorFocusShadow : color.primaryFocusShadow)};
  }

  &:disabled {
    background-color: ${color.backgroundDark};
    cursor: not-allowed;
    opacity: 0.6;
  }
`;

export const SelectError = styled.span`
  color: ${color.error};
  font-family: ${typography.family.body};
  font-size: ${typography.size.xs};
`;

export const SelectOption = styled.option``;
