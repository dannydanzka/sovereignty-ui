/** TotalsList Styled Components */

import styled from 'styled-components';

import { c, s, tf, ts, tw } from '../../tokens/css-variables';
import type { StyledTotalsListProps } from './TotalsList.interfaces';

export const ListWrapper = styled.dl<StyledTotalsListProps>`
  align-self: ${({ $align }) => ($align === 'end' ? 'flex-end' : 'stretch')};
  display: flex;
  flex-direction: column;
  gap: ${s('xs')};
  margin: 0;
  min-width: ${({ $align }) => ($align === 'end' ? '220px' : 'auto')};
`;

export const Line = styled.div`
  align-items: center;
  display: flex;
  justify-content: space-between;
`;

export const Label = styled.dt`
  color: ${c('textSecondary')};
  font-family: ${tf('body')};
  font-size: ${ts('sm')};
`;

export const Value = styled.dd`
  color: ${c('textPrimary')};
  font-family: ${tf('body')};
  font-size: ${ts('sm')};
  font-weight: ${tw('semibold')};
  margin: 0;
`;

/**
 * The emphasized final line.
 *
 * Its colour, scale and rule are variables for the same reason page titles are: this is **money**, and
 * a branded product decides how its total looks ONCE. Before this pattern the same grand total was
 * tenant-dark bold `base` on one screen, brand-red display `xl` on another, and plain `textPrimary`
 * `lg` on a third — three answers to "how much do I owe" inside one product.
 *
 * Set `--sui-totals-*` on an ancestor; never wrap this to recolour it.
 */
export const TotalLine = styled(Line)`
  border-top: var(--sui-totals-divider, 1px solid ${c('border')});
  padding-top: ${s('xs')};
`;

export const TotalLabel = styled.dt`
  color: var(--sui-totals-total-color, ${c('textPrimary')});
  font-family: ${tf('body')};
  font-size: var(--sui-totals-total-size, ${ts('base')});
  font-weight: ${tw('bold')};
`;

export const TotalValue = styled.dd`
  color: var(--sui-totals-total-color, ${c('textPrimary')});
  font-family: ${tf('body')};
  font-size: var(--sui-totals-total-size, ${ts('base')});
  font-weight: ${tw('bold')};
  margin: 0;
`;
