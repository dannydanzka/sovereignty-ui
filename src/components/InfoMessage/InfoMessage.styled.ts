/**
 * InfoMessage Styled Components
 */

import styled, { css } from 'styled-components';

import { c, s, sh, tf, tl, ts } from '../../tokens/css-variables';
import type { StyledInfoMessageProps } from './InfoMessage.interfaces';

const getVariantStyles = (variant: StyledInfoMessageProps['$variant']) => {
  switch (variant) {
    case 'success':
      return css`
        background: ${c('successBackground')};
        border-left-color: ${c('success')};
        color: ${c('successDark')};
      `;
    case 'error':
      return css`
        background: ${c('errorBackground')};
        border-left-color: ${c('error')};
        color: ${c('errorDark')};
      `;
    case 'warning':
      return css`
        background: ${c('warningBackground')};
        border-left-color: ${c('warning')};
        color: ${c('warningDark')};
      `;
    case 'info':
    default:
      return css`
        background: ${c('secondary100')};
        border-left-color: ${c('secondary500')};
        color: ${c('secondary700')};
      `;
  }
};

export const StyledInfoMessage = styled.div<StyledInfoMessageProps>`
  border-left: 4px solid;
  border-radius: ${sh('md')};
  font-family: ${tf('body')};
  font-size: ${ts('sm')};
  line-height: ${tl('relaxed')};
  padding: ${s('sm')};
  ${({ $variant }) => getVariantStyles($variant)}
`;
