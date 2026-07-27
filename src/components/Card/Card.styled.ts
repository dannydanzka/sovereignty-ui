/**
 * Card Styled Components
 *
 * Container with rounded corners: shadowed (`elevated`) or bordered (`outlined`).
 * Supports clickable state with hover lift effect.
 */

import styled from 'styled-components';

import { c, el, s, sh } from '../../tokens/css-variables';
import type { CardPadding, StyledCardProps } from './Card.interfaces';

const getPaddingStyles = (padding: CardPadding) => {
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

/*
 * The radius is `sh('lg')`, not the literal `12px` it used to be. Same value — `shape.lg` IS 0.75rem —
 * but a hardcoded pixel in the design system is the one thing the system exists to prevent: it could
 * not be themed, and a consumer that wanted a different corner had no choice but to fork the card.
 * Found while migrating 12 hand-rolled cards in one product, whose radii were `shape.lg`/`md`/`sm`.
 */
export const StyledCard = styled.div<StyledCardProps>`
  background-color: ${c('white')};
  border-radius: ${sh('lg')};
  transition: all 0.2s ease-in-out;

  ${({ $variant }) =>
    $variant === 'outlined' ? `border: 1px solid ${c('neutral200')};` : `box-shadow: ${el('sm')};`}

  ${({ $clipped }) => ($clipped ? 'overflow: hidden;' : '')}

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
