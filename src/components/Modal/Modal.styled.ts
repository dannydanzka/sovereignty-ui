/**
 * Modal Styled Components
 */

import styled, { css, keyframes } from 'styled-components';

import { color, elevation, layout, shape, spacing, typography } from '../../tokens';
import type {
  ConfirmVariant,
  StyledModalContainerProps,
  StyledModalIconProps,
  StyledModalOverlayProps,
} from './Modal.interfaces';

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const fadeOut = keyframes`
  from { opacity: 1; }
  to { opacity: 0; }
`;

const slideUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const slideDown = keyframes`
  from {
    opacity: 1;
    transform: translateY(0);
  }
  to {
    opacity: 0;
    transform: translateY(20px);
  }
`;

export const ModalOverlay = styled.div<StyledModalOverlayProps>`
  align-items: center;
  animation: ${({ $isClosing }) => ($isClosing ? fadeOut : fadeIn)} 0.2s ease-out forwards;
  background-color: ${color.modalOverlay};
  display: flex;
  inset: 0;
  justify-content: center;
  padding: ${spacing.sm};
  position: fixed;
  z-index: 1100;
`;

const sizeStyles: Record<'full' | 'lg' | 'md' | 'sm' | 'xl', ReturnType<typeof css>> = {
  full: css`
    max-height: 90vh;
    max-width: 90vw;
    width: 90vw;
  `,
  lg: css`
    max-width: 600px;
  `,
  md: css`
    max-width: 480px;
  `,
  sm: css`
    max-width: 360px;
  `,
  xl: css`
    max-width: 700px;
  `,
};

export const ModalContainer = styled.div<StyledModalContainerProps>`
  animation: ${({ $isClosing }) => ($isClosing ? slideDown : slideUp)} 0.2s ease-out forwards;
  background-color: ${color.white};
  border-radius: ${shape.lg};
  box-shadow: ${elevation.xl};
  display: flex;
  flex-direction: column;
  max-height: 90vh;
  overflow: hidden;
  width: 100%;
  ${({ $size }) => sizeStyles[$size]}

  @media (min-width: ${layout.breakpoint.md}) {
    max-height: 85vh;
  }
`;

export const ModalHeader = styled.div`
  align-items: center;
  display: flex;
  justify-content: space-between;
  padding: ${spacing.sm};
`;

export const ModalTitle = styled.h2<{ $centered?: boolean }>`
  color: ${color.textPrimary};
  font-family: ${typography.family.display};
  font-size: ${typography.size.xl};
  font-weight: ${typography.weight.bold};
  margin: 0;
  ${({ $centered }) =>
    $centered &&
    `
    margin-bottom: ${spacing.xs};
    text-align: center;
  `}
`;

export const ModalContent = styled.div<{ $noPadding?: boolean }>`
  flex: 1;
  overflow-y: auto;
  padding: ${({ $noPadding }) => ($noPadding ? '0' : spacing.sm)};
`;

export const ModalFooter = styled.div`
  display: flex;
  gap: ${spacing.sm};
  justify-content: flex-end;
  padding: ${spacing.xs} ${spacing.sm};
`;

const getIconVariantStyles = (variant: ConfirmVariant) => {
  const variants: Record<ConfirmVariant, ReturnType<typeof css>> = {
    danger: css`
      background: ${color.errorBackground};
      color: ${color.error};
    `,
    info: css`
      background: ${color.primary50};
      color: ${color.primary500};
    `,
    success: css`
      background: ${color.successBackground};
      color: ${color.success};
    `,
    warning: css`
      background: ${color.warningBackground};
      color: ${color.warning};
    `,
  };
  return variants[variant];
};

export const ModalIcon = styled.div<StyledModalIconProps>`
  align-items: center;
  border-radius: ${shape.full};
  display: flex;
  height: ${spacing['4xl']};
  justify-content: center;
  margin: 0 auto ${spacing.sm};
  width: ${spacing['4xl']};
  ${({ $variant }) => getIconVariantStyles($variant)}
`;

export const ModalMessage = styled.p`
  color: ${color.textSecondary};
  font-family: ${typography.family.body};
  font-size: ${typography.size.sm};
  line-height: 1.6;
  margin: 0 0 ${spacing.md};
  text-align: center;
`;

export const ModalConfirmChildren = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: ${spacing.md};
  width: 100%;
`;

export const ModalActions = styled.div`
  display: flex;
  gap: ${spacing.sm};
  justify-content: center;
`;
