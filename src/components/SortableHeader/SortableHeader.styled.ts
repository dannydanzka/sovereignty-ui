/**
 * SortableHeader Styled Components
 */

import styled from 'styled-components';

import { c, s, tf, ts, tt, tw } from '../../tokens/css-variables';
import type { StyledSortableHeaderProps } from './SortableHeader.interfaces';

export const Header = styled.th<StyledSortableHeaderProps>`
  color: ${({ $active }) => ($active ? c('primary500') : c('textSecondary'))};
  cursor: pointer;
  font-family: ${tf('body')};
  font-size: ${ts('xs')};
  font-weight: ${tw('medium')};
  letter-spacing: ${tt('wide')};
  padding: ${s('sm')};
  text-align: left;
  text-transform: uppercase;
  transition: color 0.15s ease;
  user-select: none;
  ${({ $width }) => $width && `width: ${$width};`}

  &:hover {
    color: ${c('primary500')};
  }
`;

export const SortIcon = styled.span`
  display: inline-flex;
  margin-left: ${s('micro')};
  vertical-align: middle;
`;
