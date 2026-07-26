/** TableFooter Styled Components */

import styled from 'styled-components';

import { c, s, tf, ts } from '../../tokens/css-variables';
import { layout } from '../../tokens';

export const FooterWrapper = styled.div`
  align-items: center;
  border-top: 1px solid ${c('border')};
  display: grid;
  gap: ${s('md')};
  grid-template-columns: 1fr;
  padding: ${s('md')} ${s('sm')};

  @media (min-width: ${layout.breakpoint.md}) {
    grid-template-columns: auto 1fr auto;
  }
`;

export const PageSizeGroup = styled.label`
  align-items: center;
  color: ${c('textSecondary')};
  display: inline-flex;
  font-family: ${tf('body')};
  font-size: ${ts('sm')};
  gap: ${s('xs')};
  /* The label is two short words around a dropdown ("Show … per page"): breaking it mid-phrase reads
     as a layout bug, and its grid column is auto-sized, so it can just be as wide as its text. */
  white-space: nowrap;
`;

export const RangeText = styled.span`
  color: ${c('textSecondary')};
  font-family: ${tf('body')};
  font-size: ${ts('sm')};
  text-align: center;

  @media (min-width: ${layout.breakpoint.md}) {
    text-align: left;
  }
`;
