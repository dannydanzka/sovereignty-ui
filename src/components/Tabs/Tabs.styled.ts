/**
 * Tabs Styled Components
 *
 * Tab navigation with active indicator and badge support.
 */

import styled from 'styled-components';

import { color, layout, shape, spacing, typography } from '../../tokens';

export const TabsContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

export const TabList = styled.div`
  border-bottom: 2px solid ${color.neutral200};
  display: flex;
  gap: ${spacing.micro};
  overflow-x: auto;
  scrollbar-width: none;

  @media (min-width: ${layout.breakpoint.md}) {
    gap: ${spacing.xs};
  }

  &::-webkit-scrollbar {
    display: none;
  }
`;

export const TabButton = styled.button<{ $isActive: boolean; $isDisabled: boolean }>`
  align-items: center;
  background: transparent;
  border: none;
  border-bottom: 3px solid ${({ $isActive }) => ($isActive ? color.accent500 : 'transparent')};
  color: ${({ $isActive, $isDisabled }) => {
    if ($isDisabled) return color.neutral400;
    return $isActive ? color.accent500 : color.textSecondary;
  }};
  cursor: ${({ $isDisabled }) => ($isDisabled ? 'not-allowed' : 'pointer')};
  display: flex;
  flex-shrink: 0;
  font-family: ${typography.family.body};
  font-size: ${typography.size.sm};
  font-weight: ${({ $isActive }) =>
    $isActive ? typography.weight.semibold : typography.weight.medium};
  gap: ${spacing.xs};
  margin-bottom: -2px;
  opacity: ${({ $isDisabled }) => ($isDisabled ? 0.5 : 1)};
  padding: ${spacing.sm} ${spacing.sm};
  transition: all 0.2s ease-in-out;
  white-space: nowrap;

  @media (min-width: ${layout.breakpoint.md}) {
    font-size: ${typography.size.base};
    padding: ${spacing.sm} ${spacing.md};
  }

  &:hover:not(:disabled) {
    background: ${color.neutral50};
    color: ${({ $isActive }) => ($isActive ? color.accent500 : color.textPrimary)};
  }

  svg {
    height: ${spacing.sm};
    width: ${spacing.sm};
  }
`;

export const TabBadge = styled.span`
  background: ${color.accent500};
  border-radius: ${shape.full};
  color: ${color.white};
  font-size: ${typography.size.xs};
  font-weight: ${typography.weight.semibold};
  min-width: ${spacing.sm};
  padding: ${spacing.micro} ${spacing.xs};
  text-align: center;
`;

export const TabContent = styled.div`
  padding: ${spacing.md} 0;
`;
