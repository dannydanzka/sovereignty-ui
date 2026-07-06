/**
 * EmptyState Styled Components — React Native resolution
 *
 * Containers are Div (View); Title/Message are Span (Text) with their own
 * textAlign (native Text does not inherit alignment from the parent View).
 * Icon sizing is up to the injected icon (no svg descendant selectors on RN).
 */

import styled from 'styled-components/native';

import { c, s, tf, tl, ts, tw } from '../../tokens/css-variables';
import { Div, Span } from '../../primitives';

export const Container = styled(Div)`
  align-items: center;
  gap: ${s('sm')};
  justify-content: center;
  padding: ${s('2xl')};
`;

export const IconWrapper = styled(Div)`
  align-items: center;
  background-color: ${c('neutral100')};
  border-radius: 9999px;
  height: ${s('4xl')};
  justify-content: center;
  width: ${s('4xl')};
`;

export const Title = styled(Span)`
  color: ${c('textPrimary')};
  font-family: ${tf('display')};
  font-size: ${ts('lg')};
  font-weight: ${tw('semibold')};
  text-align: center;
`;

export const Message = styled(Span)`
  color: ${c('textSecondary')};
  font-family: ${tf('body')};
  font-size: ${ts('sm')};
  line-height: ${tl('relaxed')};
  text-align: center;
`;

export const Action = styled(Div)`
  margin-top: ${s('xs')};
`;
