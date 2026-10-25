/**
 * Catalog list rows and section headers.
 */

import styled from 'styled-components/native';

import { c, Pressable, s, Span, ts, tw } from '@dannydanzka/sovereignty-ui';

export const Screen = styled.ScrollView`
  background-color: ${c('backgroundAlt')};
  flex: 1;
`;

export const SectionHeader = styled(Span)`
  background-color: ${c('backgroundAlt')};
  color: ${c('textSecondary')};
  font-size: ${ts('xs')};
  font-weight: ${tw('semibold')};
  padding: ${s('sm')} ${s('md')} ${s('xs')};
  text-transform: uppercase;
`;

export const DemoItem = styled(Pressable)`
  background-color: ${c('white')};
  border-bottom-color: ${c('border')};
  border-bottom-width: 1px;
  padding: ${s('sm')} ${s('md')};
`;

export const DemoName = styled(Span)`
  color: ${c('textPrimary')};
  font-size: ${ts('base')};
`;
