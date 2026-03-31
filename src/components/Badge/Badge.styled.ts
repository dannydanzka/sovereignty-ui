/**
 * Badge Styled Component
 */

import styled, { css } from 'styled-components';

import { c, s, sh, tf, ts, tw } from '../../tokens/css-variables';
import type { StyledBadgeProps } from './Badge.interfaces';

const getVariantStyles = ($variant: StyledBadgeProps['$variant']) => {
  switch ($variant) {
    case 'primary':
      return css`
        background: ${c('primary100')};
        color: ${c('primary700')};
      `;
    case 'success':
      return css`
        background: ${c('successBackground')};
        color: ${c('successDark')};
      `;
    case 'warning':
      return css`
        background: ${c('warningBackground')};
        color: ${c('warningDark')};
      `;
    case 'danger':
      return css`
        background: ${c('errorBackground')};
        color: ${c('errorDark')};
      `;
    case 'info':
      return css`
        background: ${c('secondary100')};
        color: ${c('secondary700')};
      `;
    case 'secondary':
      return css`
        background: ${c('secondary50')};
        color: ${c('secondary600')};
      `;
    case 'default':
    default:
      return css`
        background: ${c('neutral100')};
        color: ${c('neutral700')};
      `;
  }
};

const getSizeStyles = ($size: StyledBadgeProps['$size']) => {
  switch ($size) {
    case 'sm':
      return css`
        font-size: ${ts('xs')};
        padding: 2px ${s('xs')};
      `;
    case 'lg':
      return css`
        font-size: ${ts('sm')};
        padding: ${s('xs')} ${s('md')};
      `;
    case 'md':
    case undefined:
    default:
      return css`
        font-size: ${ts('xs')};
        padding: ${s('micro')} ${s('sm')};
      `;
  }
};

export const StyledBadge = styled.span<StyledBadgeProps>`
  border-radius: ${sh('full')};
  display: inline-block;
  font-family: ${tf('body')};
  font-weight: ${tw('medium')};
  white-space: nowrap;
  ${({ $size }) => getSizeStyles($size)}
  ${({ $variant }) => getVariantStyles($variant)}
`;
