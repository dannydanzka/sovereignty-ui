/**
 * NotificationToast Styled Components
 */

import styled, { keyframes } from 'styled-components';

import { color, elevation, shape, spacing, typography } from '../../tokens';
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
      return color.success;
    case 'error':
      return color.error;
    case 'warning':
      return color.warning;
    case 'info':
      return color.info;
  }
};

export const ToastContainer = styled.div<StyledContainerProps>`
  align-items: center;
  animation: ${({ $isClosing }) => ($isClosing ? slideOut : slideIn)} 0.3s ease-in-out;
  background: ${color.white};
  border-left: 4px solid ${({ $type }) => getBorderColor($type)};
  border-radius: ${shape.md};
  box-shadow: ${elevation.lg};
  display: flex;
  gap: ${spacing.sm};
  max-width: 400px;
  min-width: 300px;
  padding: ${spacing.sm};
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
  color: ${color.textPrimary};
  font-family: ${typography.family.body};
  font-size: ${typography.size.sm};
  font-weight: ${typography.weight.semibold};
  margin: 0 0 ${spacing.micro};
`;

export const ToastMessage = styled.p`
  color: ${color.textSecondary};
  font-family: ${typography.family.body};
  font-size: ${typography.size.sm};
  line-height: 1.4;
  margin: 0;
`;

export const ToastCloseButton = styled.button`
  background: transparent;
  border: none;
  color: ${color.textSecondary};
  cursor: pointer;
  flex-shrink: 0;
  padding: ${spacing.micro};
  transition: color 0.2s ease-in-out;

  &:hover {
    color: ${color.textPrimary};
  }

  &:focus {
    color: ${color.textPrimary};
    outline: 2px solid ${color.primary500};
    outline-offset: 2px;
  }
`;
