/**
 * Card Styled Components
 *
 * Container with shadow and rounded corners.
 * Supports clickable state with hover lift effect.
 */

import styled from 'styled-components';

import { color, elevation, spacing } from '../../tokens';

const getPaddingStyles = (padding: 'large' | 'medium' | 'none' | 'small') => {
  switch (padding) {
    case 'none':
      return 'padding: 0;';
    case 'small':
      return `padding: ${spacing.sm};`;
    case 'medium':
      return `padding: ${spacing.md};`;
    case 'large':
      return `padding: ${spacing.lg};`;
  }
};

export const StyledCard = styled.div<{
  $clickable?: boolean;
  $padding: 'large' | 'medium' | 'none' | 'small';
}>`
  background-color: ${color.white};
  border-radius: 12px;
  box-shadow: ${elevation.sm};
  transition: all 0.2s ease-in-out;

  ${({ $padding }) => getPaddingStyles($padding)}

  ${({ $clickable }) =>
    $clickable &&
    `
    cursor: pointer;

    &:hover {
      box-shadow: ${elevation.md};
      transform: translateY(-4px);
    }

    &:active {
      transform: translateY(-2px);
    }
  `}
`;
