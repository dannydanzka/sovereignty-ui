/**
 * SearchInput Styled Components
 */

import styled from 'styled-components';

import { c, s, sh, tf, ts } from '../../tokens/css-variables';

export const FilterBar = styled.div`
  align-items: center;
  display: flex;
  flex-wrap: wrap;
  gap: ${s('sm')};
  margin-bottom: ${s('md')};
`;

export const StyledSearchInput = styled.input`
  background: ${c('white')};
  border: 1px solid ${c('border')};
  border-radius: ${sh('md')};
  flex: 1;
  font-family: ${tf('body')};
  font-size: ${ts('sm')};
  min-width: 200px;
  padding: ${s('xs')} ${s('sm')};
  transition: border-color 0.2s ease;

  &:focus {
    border-color: ${c('primary500')};
    outline: none;
  }

  &::placeholder {
    color: ${c('textTertiary')};
  }
`;
