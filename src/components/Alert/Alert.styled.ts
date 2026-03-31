/**
 * Alert Styled Components
 */

import styled from 'styled-components';

import { c, s, sh, tf, tl, ts, tw } from '../../tokens/css-variables';

type AlertVariant = 'info' | 'success' | 'warning' | 'error';

const VARIANT_COLORS: Record<AlertVariant, { bg: string; border: string; icon: string }> = {
  error: { bg: c('errorBackground'), border: c('errorBorder'), icon: c('error') },
  info: { bg: c('secondary50'), border: c('secondary200'), icon: c('info') },
  success: { bg: c('successBackground'), border: c('successLight'), icon: c('success') },
  warning: { bg: c('warningBackground'), border: c('warningLight'), icon: c('warning') },
};

export const AlertContainer = styled.div<{ $variant: AlertVariant }>`
  background-color: ${({ $variant }) => VARIANT_COLORS[$variant].bg};
  border: 1px solid ${({ $variant }) => VARIANT_COLORS[$variant].border};
  border-left: 4px solid ${({ $variant }) => VARIANT_COLORS[$variant].icon};
  border-radius: ${sh('md')};
  display: flex;
  gap: ${s('sm')};
  padding: ${s('sm')} ${s('md')};
`;

export const AlertIcon = styled.div<{ $variant: AlertVariant }>`
  color: ${({ $variant }) => VARIANT_COLORS[$variant].icon};
  flex-shrink: 0;
  margin-top: 2px;
`;

export const AlertBody = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: ${s('micro')};
`;

export const AlertTitle = styled.strong`
  color: ${c('textPrimary')};
  font-family: ${tf('body')};
  font-size: ${ts('sm')};
  font-weight: ${tw('semibold')};
`;

export const AlertMessage = styled.div`
  color: ${c('textSecondary')};
  font-family: ${tf('body')};
  font-size: ${ts('sm')};
  line-height: ${tl('relaxed')};
`;

export const AlertDismiss = styled.button`
  background: none;
  border: none;
  color: ${c('textTertiary')};
  cursor: pointer;
  flex-shrink: 0;
  padding: 0;
  transition: color 0.15s ease;

  &:hover {
    color: ${c('textPrimary')};
  }
`;
