/**
 * InfoMessage Styled Components
 */

import styled, { css } from 'styled-components';

import { color, shape, spacing, typography } from '../../tokens';
import type { StyledInfoMessageProps } from './InfoMessage.interfaces';

const getVariantStyles = (variant: StyledInfoMessageProps['$variant']) => {
  switch (variant) {
    case 'success':
      return css`
        background: ${color.successBackground};
        border-left-color: ${color.success};
        color: ${color.successDark};
      `;
    case 'error':
      return css`
        background: ${color.errorBackground};
        border-left-color: ${color.error};
        color: ${color.errorDark};
      `;
    case 'warning':
      return css`
        background: ${color.warningBackground};
        border-left-color: ${color.warning};
        color: ${color.warningDark};
      `;
    case 'info':
    default:
      return css`
        background: ${color.secondary100};
        border-left-color: ${color.secondary500};
        color: ${color.secondary700};
      `;
  }
};

export const StyledInfoMessage = styled.div<StyledInfoMessageProps>`
  border-left: 4px solid;
  border-radius: ${shape.md};
  font-family: ${typography.family.body};
  font-size: ${typography.size.sm};
  line-height: ${typography.leading.relaxed};
  padding: ${spacing.sm};
  ${({ $variant }) => getVariantStyles($variant)}
`;
