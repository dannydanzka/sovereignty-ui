/** FormGrid Styled Components */

import styled from 'styled-components';

import { layout } from '../../tokens';
import { s } from '../../tokens/css-variables';
import type { StyledFormGridProps } from './FormGrid.interfaces';

export const GridWrapper = styled.div<StyledFormGridProps>`
  display: grid;
  gap: ${s('sm')};
  grid-template-columns: ${({ $columns }) => `repeat(${$columns}, minmax(0, 1fr))`};

  @media (max-width: ${layout.breakpoint.sm}) {
    grid-template-columns: 1fr;
  }
`;

export const FullRow = styled.div`
  grid-column-end: -1;
  grid-column-start: 1;
`;
