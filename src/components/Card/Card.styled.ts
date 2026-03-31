/**
 * Card Styled Components
 *
 * Container with shadow and rounded corners.
 * Supports clickable state with hover lift effect.
 */

import styled from 'styled-components';

import { c, el, s } from '../../tokens/css-variables';

const getPaddingStyles = (padding: 'large' | 'medium' | 'none' | 'small') => {
  switch (padding) {
    case 'none':
      return 'padding: 0;';
    case 'small':
      return `padding: ${s('sm')};`;
    case 'medium':
      return `padding: ${s('md')};`;
    case 'large':
      return `padding: ${s('lg')};`;
  }
};

export const StyledCard = styled.div<{
  $clickable?: boolean;
  $padding: 'large' | 'medium' | 'none' | 'small';
}>`
  background-color: ${c('white')};
  border-radius: 12px;
  box-shadow: ${el('sm')};
  transition: all 0.2s ease-in-out;

  ${({ $padding }) => getPaddingStyles($padding)}

  ${({ $clickable }) =>
    $clickable &&
    `
    cursor: pointer;

    &:hover {
      box-shadow: ${el('md')};
      transform: translateY(-4px);
    }

    &:active {
      transform: translateY(-2px);
    }
  `}
`;
