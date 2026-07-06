/**
 * GalleryScreen Styled Components
 *
 * Built on sovereignty-ui primitives (Div → View, Span → Text) with the
 * library token helpers resolving raw px values on native.
 */

import styled from 'styled-components/native';

import { Div, Span, c, s, tf, ts, tw } from '@dannydanzka/sovereignty-ui';

export const Screen = styled(Div)`
  background-color: ${c('backgroundAlt')};
  flex: 1;
`;

export const Content = styled(Div)`
  gap: ${s('md')};
  padding: ${s('md')};
`;

export const ScreenTitle = styled(Span)`
  color: ${c('textPrimary')};
  font-family: ${tf('display')};
  font-size: ${ts('2xl')};
  font-weight: ${tw('bold')};
`;

export const SectionCard = styled(Div)`
  background-color: ${c('white')};
  border-radius: 12px;
  gap: ${s('sm')};
  padding: ${s('sm')};
`;

export const SectionTitle = styled(Span)`
  color: ${c('textSecondary')};
  font-size: ${ts('xs')};
  font-weight: ${tw('semibold')};
  letter-spacing: 0.5px;
  text-transform: uppercase;
`;

export const Row = styled(Div)`
  align-items: center;
  flex-direction: row;
  flex-wrap: wrap;
  gap: ${s('xs')};
`;

export const InlineLabel = styled(Span)`
  color: ${c('textPrimary')};
  font-size: ${ts('sm')};
`;
