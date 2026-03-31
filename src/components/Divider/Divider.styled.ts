/**
 * Divider Styled Components
 */

import styled from 'styled-components';

import { c, s } from '../../tokens/css-variables';

export const StyledDivider = styled.hr<{
  $color?: string;
  $orientation: 'horizontal' | 'vertical';
  $spacing?: string;
}>`
  background-color: ${({ $color }) => $color ?? c('border')};
  border: none;
  flex-shrink: 0;

  ${({ $orientation, $spacing: $gap }) =>
    $orientation === 'vertical'
      ? `
    height: auto;
    margin: 0 ${$gap ?? s('sm')};
    min-height: 100%;
    width: 1px;
  `
      : `
    height: 1px;
    margin: ${$gap ?? s('sm')} 0;
    width: 100%;
  `}
`;
