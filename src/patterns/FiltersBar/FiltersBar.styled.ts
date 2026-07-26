/** FiltersBar Styled Components */

import styled from 'styled-components';

import { layout } from '../../tokens';
import { s } from '../../tokens/css-variables';

export const FiltersBarWrapper = styled.div`
  align-items: center;
  display: grid;
  gap: ${s('sm')};
  grid-template-columns: 1fr;

  @media (min-width: ${layout.breakpoint.md}) {
    grid-template-columns: minmax(240px, 1fr) auto auto auto;
  }
`;
