/**
 * Pagination Styled Components
 */

import styled, { css } from 'styled-components';

import { color, shape, spacing, typography } from '../../tokens';

export const PaginationWrapper = styled.nav`
  align-items: center;
  display: flex;
  gap: ${spacing.micro};
  justify-content: center;
`;

const buttonBase = css`
  align-items: center;
  background: none;
  border: 1px solid ${color.border};
  border-radius: ${shape.md};
  color: ${color.textSecondary};
  cursor: pointer;
  display: inline-flex;
  font-family: ${typography.family.body};
  font-size: ${typography.size.sm};
  font-weight: ${typography.weight.medium};
  justify-content: center;
  min-height: 2rem;
  min-width: 2rem;
  padding: ${spacing.micro} ${spacing.xs};
  transition: all 0.2s ease;

  &:hover:not(:disabled) {
    background-color: ${color.neutral50};
    border-color: ${color.primary500};
    color: ${color.primary500};
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.4;
  }
`;

export const PaginationButton = styled.button<{ $active?: boolean }>`
  ${buttonBase}

  ${({ $active }) =>
    $active &&
    css`
      background-color: ${color.primary500};
      border-color: ${color.primary500};
      color: ${color.white};

      &:hover:not(:disabled) {
        background-color: ${color.primary600};
        border-color: ${color.primary600};
        color: ${color.white};
      }
    `}
`;

export const PaginationEllipsis = styled.span`
  align-items: center;
  color: ${color.textTertiary};
  display: inline-flex;
  font-size: ${typography.size.sm};
  justify-content: center;
  min-height: 2rem;
  min-width: 2rem;
`;
