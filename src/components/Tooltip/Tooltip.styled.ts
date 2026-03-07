/**
 * Tooltip Styled Components
 */

import styled, { css } from 'styled-components';

import { color, shape, spacing, typography } from '../../tokens';

const POSITION_STYLES = {
  bottom: css`
    left: 50%;
    top: calc(100% + ${spacing.xs});
    transform: translateX(-50%);
  `,
  left: css`
    right: calc(100% + ${spacing.xs});
    top: 50%;
    transform: translateY(-50%);
  `,
  right: css`
    left: calc(100% + ${spacing.xs});
    top: 50%;
    transform: translateY(-50%);
  `,
  top: css`
    bottom: calc(100% + ${spacing.xs});
    left: 50%;
    transform: translateX(-50%);
  `,
} as const;

export const TooltipContainer = styled.div`
  display: inline-block;
  position: relative;
`;

export const TooltipContent = styled.div<{ $position: 'top' | 'bottom' | 'left' | 'right' }>`
  background-color: ${color.dark300};
  border-radius: ${shape.md};
  color: ${color.white};
  font-family: ${typography.family.body};
  font-size: ${typography.size.xs};
  font-weight: ${typography.weight.medium};
  max-width: 250px;
  opacity: 0;
  padding: ${spacing.micro} ${spacing.xs};
  pointer-events: none;
  position: absolute;
  transition: opacity 0.15s ease;
  white-space: nowrap;
  z-index: 100;

  ${({ $position }) => POSITION_STYLES[$position]}

  ${TooltipContainer}:hover & {
    opacity: 1;
  }
`;
