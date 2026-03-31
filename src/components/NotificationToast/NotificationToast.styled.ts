/**
 * NotificationToast Styled Components
 */

import styled, { keyframes } from 'styled-components';

import { c, el, s, sh, tf, ts, tw } from '../../tokens/css-variables';
import type { StyledContainerProps, StyledIconProps } from './NotificationToast.interfaces';

const slideIn = keyframes`
  from {
    opacity: 0;
    transform: translateX(100%);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
`;

const slideOut = keyframes`
  from {
    opacity: 1;
    transform: translateX(0);
  }
  to {
    opacity: 0;
    transform: translateX(100%);
  }
`;

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

export const ToastContainer = styled.div<StyledContainerProps>`
  align-items: center;
  animation: ${({ $isClosing }) => ($isClosing ? slideOut : slideIn)} 0.3s ease-in-out;
  background: ${c('white')};
  border-left: 4px solid ${({ $type }) => getBorderColor($type)};
  border-radius: ${sh('md')};
  box-shadow: ${el('lg')};
  display: flex;
  gap: ${s('sm')};
  max-width: 400px;
  min-width: 300px;
  padding: ${s('sm')};
  pointer-events: auto;
  position: relative;
`;

export const ToastIcon = styled.div<StyledIconProps>`
  color: ${({ $type }) => getBorderColor($type)};
  flex-shrink: 0;
`;

export const ToastContent = styled.div`
  flex: 1;
`;

export const ToastTitle = styled.p`
  color: ${c('textPrimary')};
  font-family: ${tf('body')};
  font-size: ${ts('sm')};
  font-weight: ${tw('semibold')};
  margin: 0 0 ${s('micro')};
`;

export const ToastMessage = styled.p`
  color: ${c('textSecondary')};
  font-family: ${tf('body')};
  font-size: ${ts('sm')};
  line-height: 1.4;
  margin: 0;
`;

export const ToastCloseButton = styled.button`
  background: transparent;
  border: none;
  color: ${c('textSecondary')};
  cursor: pointer;
  flex-shrink: 0;
  padding: ${s('micro')};
  transition: color 0.2s ease-in-out;

  &:hover {
    color: ${c('textPrimary')};
  }

  &:focus {
    color: ${c('textPrimary')};
    outline: 2px solid ${c('primary500')};
    outline-offset: 2px;
  }
`;
