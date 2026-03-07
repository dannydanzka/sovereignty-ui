/**
 * Divider Styled Components
 */

import styled from 'styled-components';

import { color, spacing } from '../../tokens';

export const StyledDivider = styled.hr<{
  $color?: string;
  $orientation: 'horizontal' | 'vertical';
  $spacing?: string;
}>`
  background-color: ${({ $color }) => $color ?? color.border};
  border: none;
  flex-shrink: 0;

  ${({ $orientation, $spacing: $gap }) =>
    $orientation === 'vertical'
      ? `
    height: auto;
    margin: 0 ${$gap ?? spacing.sm};
    min-height: 100%;
    width: 1px;
  `
      : `
    height: 1px;
    margin: ${$gap ?? spacing.sm} 0;
    width: 100%;
  `}
`;
