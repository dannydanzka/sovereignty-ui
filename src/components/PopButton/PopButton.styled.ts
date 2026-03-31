/**
 * PopButton Styled Components
 *
 * Neubrutalismo style: solid border + box-shadow elevation on hover.
 * Pill variant: no border, scale animation.
 */

import styled, { css } from 'styled-components';

import { c, el, s, sh, tf, ts, tw } from '../../tokens/css-variables';
import type { PopButtonVariant, StyledPopButtonProps } from './PopButton.interfaces';

const getBackgroundColor = (variant: PopButtonVariant) => {
  switch (variant) {
    case 'blue':
    case 'secondary':
      return c('secondary300');
    case 'pill':
    case 'accent':
      return c('accent500');
    case 'primary':
      return c('primary400');
    case 'yellow':
      return c('primary200');
  }
};

const isPillVariant = (variant?: PopButtonVariant) => variant === 'pill' || variant === 'accent';

const pillStyles = css`
  border: none;
  border-radius: 9999px;
  box-shadow: none;
  color: ${c('white')};
  font-size: ${ts('sm')};
  padding: ${s('sm')} ${s('md')};

  &:hover:not(:disabled) {
    box-shadow: none;
    transform: scale(1.02);
  }

  &:active:not(:disabled) {
    box-shadow: none;
    transform: scale(0.98);
  }
`;

const solidStyles = css`
  border: 2px solid ${c('neutral900')};
  border-radius: ${sh('full')};
  color: ${c('neutral900')};
  padding: ${s('sm')} ${s('lg')};

  &:hover:not(:disabled) {
    box-shadow: ${el('md')};
    transform: translateY(2px);
  }

  &:active:not(:disabled) {
    box-shadow: ${el('sm')};
    transform: translateY(4px);
  }
`;

export const StyledPopButton = styled.button<StyledPopButtonProps>`
  background-color: ${({ $variant }) => getBackgroundColor($variant ?? 'yellow')};
  cursor: pointer;
  font-family: ${tf('body')};
  font-size: ${ts('2xl')};
  font-weight: ${tw('bold')};
  letter-spacing: 0.02em;
  min-height: ${s('2xl')};
  transition: all 0.15s ease;

  &:focus-visible {
    outline: 2px solid ${c('cyan500')};
    outline-offset: 2px;
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.6;
  }

  ${({ $variant }) => (isPillVariant($variant) ? pillStyles : solidStyles)}
`;
