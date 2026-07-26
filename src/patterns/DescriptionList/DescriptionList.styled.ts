/** DescriptionList Styled Components */

import styled from 'styled-components';

import { c, s, tf, ts, tw } from '../../tokens/css-variables';
import type {
  DescriptionListColumns,
  StyledDescriptionListProps,
} from './DescriptionList.interfaces';

const template = (columns: DescriptionListColumns): string =>
  columns === 'auto'
    ? 'repeat(auto-fit, minmax(200px, 1fr))'
    : `repeat(${columns}, minmax(0, 1fr))`;

export const ListWrapper = styled.dl<StyledDescriptionListProps>`
  display: grid;
  gap: ${s('md')};
  grid-template-columns: ${({ $columns }) => template($columns)};
  margin: 0;
`;

export const Row = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${s('micro')};
`;

export const Label = styled.dt`
  color: ${c('textSecondary')};
  font-family: ${tf('body')};
  font-size: ${ts('xs')};
  font-weight: ${tw('semibold')};
  letter-spacing: 0.04em;
  text-transform: uppercase;
`;

export const Value = styled.dd`
  color: ${c('textPrimary')};
  font-family: ${tf('body')};
  font-size: ${ts('base')};
  margin: 0;
`;
