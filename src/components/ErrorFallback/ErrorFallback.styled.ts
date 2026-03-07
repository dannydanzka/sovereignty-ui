/**
 * ErrorFallback Styled Components
 */

import styled from 'styled-components';

import { color, shape, spacing, typography } from '../../tokens';

export const ErrorContainer = styled.div`
  align-items: center;
  background-color: ${color.errorBackground};
  border: 1px solid ${color.errorBorder};
  border-radius: ${shape.lg};
  display: flex;
  flex-direction: column;
  gap: ${spacing.sm};
  justify-content: center;
  min-height: 200px;
  padding: ${spacing.lg};
`;

export const ErrorIconWrapper = styled.div`
  color: ${color.error};
`;

export const ErrorTitle = styled.h3`
  color: ${color.textPrimary};
  font-family: ${typography.family.display};
  font-size: ${typography.size.xl};
  font-weight: ${typography.weight.semibold};
  margin: 0;
  text-align: center;
`;

export const ErrorDescription = styled.p`
  color: ${color.textSecondary};
  font-family: ${typography.family.body};
  font-size: ${typography.size.base};
  margin: 0;
  max-width: 500px;
  text-align: center;
`;

export const ErrorActions = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${spacing.xs};
  justify-content: center;
  margin-top: ${spacing.xs};
`;

export const ActionButton = styled.button<{ $variant: 'primary' | 'secondary' }>`
  background-color: ${({ $variant }) =>
    $variant === 'primary' ? color.primary500 : color.transparent};
  border: 1px solid ${({ $variant }) => ($variant === 'primary' ? color.primary500 : color.border)};
  border-radius: ${shape.md};
  color: ${({ $variant }) => ($variant === 'primary' ? color.white : color.textPrimary)};
  cursor: pointer;
  font-family: ${typography.family.body};
  font-size: ${typography.size.sm};
  font-weight: ${typography.weight.medium};
  padding: ${spacing.xs} ${spacing.sm};
  transition: all 0.2s ease;

  &:hover {
    background-color: ${({ $variant }) =>
      $variant === 'primary' ? color.primary600 : color.backgroundDark};
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.6;
  }
`;
