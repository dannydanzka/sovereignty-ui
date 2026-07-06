/**
 * Alert Styled Components — React Native resolution
 *
 * Same structure on Div/Span/Pressable primitives. Native View defaults to a
 * column, so the container/body set flex-direction explicitly; border shorthands
 * become longhand (RN has no `border`/`border-left` shorthand) and the message
 * lives inside a Span (raw text must render inside Text on native).
 */

import styled from 'styled-components/native';

import { c, s, sh, tf, ts, tw } from '../../tokens/css-variables';
import { Div, Pressable, Span } from '../../primitives';

type AlertVariant = 'info' | 'success' | 'warning' | 'error';

const VARIANT_COLORS: Record<AlertVariant, { bg: string; border: string; icon: string }> = {
  error: { bg: c('errorBackground'), border: c('errorBorder'), icon: c('error') },
  info: { bg: c('secondary50'), border: c('secondary200'), icon: c('info') },
  success: { bg: c('successBackground'), border: c('successLight'), icon: c('success') },
  warning: { bg: c('warningBackground'), border: c('warningLight'), icon: c('warning') },
};

export const AlertContainer = styled(Div)<{ $variant: AlertVariant }>`
  background-color: ${({ $variant }) => VARIANT_COLORS[$variant].bg};
  border-color: ${({ $variant }) => VARIANT_COLORS[$variant].border};
  border-left-color: ${({ $variant }) => VARIANT_COLORS[$variant].icon};
  border-left-width: 4px;
  border-radius: ${sh('md')};
  border-width: 1px;
  flex-direction: row;
  gap: ${s('sm')};
  padding: ${s('sm')} ${s('md')};
`;

export const AlertIcon = styled(Div)<{ $variant: AlertVariant }>`
  flex-shrink: 0;
  margin-top: 2px;
`;

export const AlertBody = styled(Div)`
  flex: 1;
  gap: ${s('micro')};
`;

export const AlertTitle = styled(Span)`
  color: ${c('textPrimary')};
  font-family: ${tf('body')};
  font-size: ${ts('sm')};
  font-weight: ${tw('semibold')};
`;

export const AlertMessage = styled(Span)`
  color: ${c('textSecondary')};
  font-family: ${tf('body')};
  font-size: ${ts('sm')};
`;

export const AlertDismiss = styled(Pressable)`
  flex-shrink: 0;
`;
