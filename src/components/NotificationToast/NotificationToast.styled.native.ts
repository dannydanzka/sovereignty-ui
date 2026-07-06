/**
 * NotificationToast Styled Components — React Native resolution
 *
 * Row layout on Div/Span/Pressable primitives. Border shorthand → longhand, no
 * keyframes/pointer-events on native. Text lives in Span-based pieces.
 */

import styled from 'styled-components/native';

import { c, el, s, sh, tf, ts, tw } from '../../tokens/css-variables';
import { Div, Pressable, Span } from '../../primitives';
import type { StyledContainerProps, StyledIconProps } from './NotificationToast.interfaces';

const getBorderColor = ($type: StyledContainerProps['$type']) => {
  switch ($type) {
    case 'success':
      return c('success');
    case 'error':
      return c('error');
    case 'warning':
      return c('warning');
    case 'info':
      return c('info');
  }
};

export const ToastContainer = styled(Div)<StyledContainerProps>`
  align-items: center;
  background-color: ${c('white')};
  border-left-color: ${({ $type }) => getBorderColor($type)};
  border-left-width: 4px;
  border-radius: ${sh('md')};
  box-shadow: ${el('lg')};
  flex-direction: row;
  gap: ${s('sm')};
  max-width: 400px;
  min-width: 300px;
  padding: ${s('sm')};
`;

export const ToastIcon = styled(Div)<StyledIconProps>`
  flex-shrink: 0;
`;

export const ToastContent = styled(Div)`
  flex: 1;
`;

export const ToastTitle = styled(Span)`
  color: ${c('textPrimary')};
  font-family: ${tf('body')};
  font-size: ${ts('sm')};
  font-weight: ${tw('semibold')};
`;

export const ToastMessage = styled(Span)`
  color: ${c('textSecondary')};
  font-family: ${tf('body')};
  font-size: ${ts('sm')};
`;

export const ToastCloseButton = styled(Pressable)`
  flex-shrink: 0;
  padding: ${s('micro')};
`;
