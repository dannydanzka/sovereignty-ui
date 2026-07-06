/**
 * Divider Styled Components — React Native resolution
 *
 * hr does not exist on native: the separator is a thin Div (View).
 */

import styled from 'styled-components/native';

import { c, s } from '../../tokens/css-variables';
import { Div } from '../../primitives';

export const StyledDivider = styled(Div)<{
  $color?: string;
  $orientation: 'horizontal' | 'vertical';
  $spacing?: string;
}>`
  background-color: ${({ $color }) => $color ?? c('border')};
  flex-shrink: 0;

  ${({ $orientation, $spacing: $gap }) =>
    $orientation === 'vertical'
      ? `
    margin: 0px ${$gap ?? s('sm')};
    min-height: 100%;
    width: 1px;
  `
      : `
    height: 1px;
    margin: ${$gap ?? s('sm')} 0px;
    width: 100%;
  `}
`;
