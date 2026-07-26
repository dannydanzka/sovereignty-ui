/** PageHeader Styled Components */

import styled from 'styled-components';

import { c, s, tf, ts } from '../../tokens/css-variables';

export const HeaderWrapper = styled.div`
  align-items: center;
  display: flex;
  flex-wrap: wrap;
  gap: ${s('md')};
  justify-content: space-between;
`;

export const TitleColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${s('xs')};
`;

export const Description = styled.p`
  color: ${c('textSecondary')};
  font-family: ${tf('body')};
  font-size: ${ts('base')};
  margin: 0;
`;
