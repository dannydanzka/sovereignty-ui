/**
 * The demo page: a scrolling column of demo sections under the component name.
 */

import styled from 'styled-components/native';

import { c, Div, s, Span, tf, ts, tw } from '@dannydanzka/sovereignty-ui';

export const Scroll = styled.ScrollView`
  background-color: ${c('backgroundAlt')};
  flex: 1;
`;

export const Content = styled(Div)`
  gap: ${s('md')};
  padding: ${s('md')};
`;

export const DemoTitle = styled(Span)`
  color: ${c('textPrimary')};
  font-family: ${tf('display')};
  font-size: ${ts('2xl')};
  font-weight: ${tw('bold')};
`;

export const Missing = styled(Span)`
  color: ${c('error')};
  font-size: ${ts('base')};
`;
