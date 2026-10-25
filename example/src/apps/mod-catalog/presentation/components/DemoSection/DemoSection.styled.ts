/**
 * The card each demo section sits on, plus the row and caption demos lay out with.
 */

import styled from 'styled-components/native';

import { c, Div, s, sh, Span, ts, tw } from '@dannydanzka/sovereignty-ui';

export const SectionCard = styled(Div)`
  background-color: ${c('white')};
  border-radius: ${sh('lg')};
  gap: ${s('sm')};
  padding: ${s('sm')};
`;

export const SectionTitle = styled(Span)`
  color: ${c('textSecondary')};
  font-size: ${ts('xs')};
  font-weight: ${tw('semibold')};
  text-transform: uppercase;
`;

export const DemoRow = styled(Div)`
  align-items: center;
  flex-direction: row;
  flex-wrap: wrap;
  gap: ${s('xs')};
`;

export const DemoCaption = styled(Span)`
  color: ${c('textPrimary')};
  font-size: ${ts('sm')};
`;
