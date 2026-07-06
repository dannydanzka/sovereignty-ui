/**
 * SearchInput Styled Components — React Native resolution
 *
 * FilterBar is a horizontal Div (native View defaults to column); the input
 * builds on the TextField primitive. No focus/placeholder pseudos on native.
 */

import styled from 'styled-components/native';

import { c, s, sh, tf, ts } from '../../tokens/css-variables';
import { Div, TextField } from '../../primitives';

export const FilterBar = styled(Div)`
  align-items: center;
  flex-direction: row;
  flex-wrap: wrap;
  gap: ${s('sm')};
  margin-bottom: ${s('md')};
`;

export const StyledSearchInput = styled(TextField)`
  background-color: ${c('white')};
  border-color: ${c('border')};
  border-radius: ${sh('md')};
  border-width: 1px;
  flex: 1;
  font-family: ${tf('body')};
  font-size: ${ts('sm')};
  min-width: 200px;
  padding: ${s('xs')} ${s('sm')};
`;
