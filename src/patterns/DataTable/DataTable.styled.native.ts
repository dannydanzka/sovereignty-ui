/**
 * DataTable Styled Components — React Native resolution
 *
 * Native has no table semantics: each row renders as a card of label/value
 * pairs (see DataTable.native.tsx). Built on Div/Span/Pressable primitives.
 */

import styled from 'styled-components/native';

import { c, el, s, sh, tf, ts, tw } from '../../tokens/css-variables';
import { Div, Pressable, Span } from '../../primitives';

export const DataTableWrapper = styled(Div)`
  gap: ${s('sm')};
  width: 100%;
`;

export const DataTableToolbar = styled(Div)`
  align-items: center;
  flex-direction: row;
  gap: ${s('sm')};
`;

export const Card = styled(Div)`
  background-color: ${c('white')};
  border-color: ${c('neutral200')};
  border-radius: ${sh('md')};
  border-width: 1px;
  box-shadow: ${el('sm')};
  gap: ${s('xs')};
  padding: ${s('sm')};
`;

export const CardRow = styled(Div)`
  align-items: flex-start;
  flex-direction: row;
  gap: ${s('sm')};
  justify-content: space-between;
`;

export const CardLabel = styled(Span)`
  color: ${c('textSecondary')};
  flex-shrink: 0;
  font-family: ${tf('body')};
  font-size: ${ts('xs')};
  font-weight: ${tw('semibold')};
`;

export const CardValueText = styled(Span)`
  color: ${c('textPrimary')};
  flex-shrink: 1;
  font-family: ${tf('body')};
  font-size: ${ts('sm')};
  text-align: right;
`;

export const CardValueBox = styled(Div)`
  align-items: flex-end;
  flex-shrink: 1;
`;

export const CardActions = styled(Div)`
  flex-direction: row;
  gap: ${s('xs')};
  justify-content: flex-end;
  padding-top: ${s('xs')};
`;

export const ActionBtn = styled(Pressable)`
  align-items: center;
  height: ${s('lg')};
  justify-content: center;
  opacity: ${({ disabled }) => (disabled ? 0.4 : 1)};
  width: ${s('lg')};
`;

export const SelectAllRow = styled(Div)`
  align-items: center;
  flex-direction: row;
  gap: ${s('sm')};
`;

export const StateText = styled(Span)`
  color: ${c('textSecondary')};
  font-family: ${tf('body')};
  font-size: ${ts('sm')};
  padding: ${s('md')};
  text-align: center;
`;
