/**
 * ActionButton Styled Components
 *
 * Icon button for table row actions. Variant maps to semantic backgrounds:
 * view = info | edit = warning | delete = error | neutral = surface.
 */

import styled, { keyframes } from 'styled-components';

import type {
  ActionButtonSize,
  ActionButtonVariant,
  StyledActionButtonProps,
} from './ActionButton.interfaces';
import { c, s, sh } from '../../tokens/css-variables';

const spin = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

const buttonSize = ($size: ActionButtonSize) => ($size === 'sm' ? s('md') : s('lg'));

const background = ($variant: ActionButtonVariant) => {
  if ($variant === 'view') return c('infoLight');
  if ($variant === 'edit') return c('warningBackground');
  if ($variant === 'delete') return c('errorBackground');
  return c('backgroundAlt');
};

const foreground = ($variant: ActionButtonVariant) => {
  if ($variant === 'view') return c('infoDark');
  if ($variant === 'edit') return c('warningDark');
  if ($variant === 'delete') return c('errorDark');
  return c('textSecondary');
};

export const StyledActionButton = styled.button<StyledActionButtonProps>`
  align-items: center;
  background: ${({ $variant }) => background($variant)};
  border: none;
  border-radius: ${sh('md')};
  color: ${({ $variant }) => foreground($variant)};
  cursor: ${({ $isLoading }) => ($isLoading ? 'wait' : 'pointer')};
  display: inline-flex;
  height: ${({ $size }) => buttonSize($size)};
  justify-content: center;
  min-width: ${({ $size }) => buttonSize($size)};
  padding: 0;
  transition: filter 0.2s ease;
  width: ${({ $size }) => buttonSize($size)};

  &:hover:not(:disabled) {
    filter: brightness(0.92);
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }
`;

export const SpinnerIcon = styled.span`
  animation: ${spin} 1s linear infinite;
  display: inline-flex;
`;
