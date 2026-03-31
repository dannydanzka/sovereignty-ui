/**
 * Modal Styled Components
 */

import styled, { css, keyframes } from 'styled-components';

import { c, el, s, sh, tf, ts, tw } from '../../tokens/css-variables';
import type {
  ConfirmVariant,
  StyledModalContainerProps,
  StyledModalIconProps,
  StyledModalOverlayProps,
} from './Modal.interfaces';
import { layout } from '../../tokens';

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
  background-color: ${c('modalOverlay')};
  display: flex;
  inset: 0;
  justify-content: center;
  padding: ${s('sm')};
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
  background-color: ${c('white')};
  border-radius: ${sh('lg')};
  box-shadow: ${el('xl')};
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
  padding: ${s('sm')};
`;

export const ModalTitle = styled.h2<{ $centered?: boolean }>`
  color: ${c('textPrimary')};
  font-family: ${tf('display')};
  font-size: ${ts('xl')};
  font-weight: ${tw('bold')};
  margin: 0;
  ${({ $centered }) =>
    $centered &&
    `
    margin-bottom: ${s('xs')};
    text-align: center;
  `}
`;

export const ModalContent = styled.div<{ $noPadding?: boolean }>`
  flex: 1;
  overflow-y: auto;
  padding: ${({ $noPadding }) => ($noPadding ? '0' : s('sm'))};
`;

export const ModalFooterBar = styled.div`
  display: flex;
  gap: ${s('sm')};
  justify-content: flex-end;
  padding: ${s('xs')} ${s('sm')};
`;

const getIconVariantStyles = (variant: ConfirmVariant) => {
  const variants: Record<ConfirmVariant, ReturnType<typeof css>> = {
    danger: css`
      background: ${c('errorBackground')};
      color: ${c('error')};
    `,
    info: css`
      background: ${c('primary50')};
      color: ${c('primary500')};
    `,
    success: css`
      background: ${c('successBackground')};
      color: ${c('success')};
    `,
    warning: css`
      background: ${c('warningBackground')};
      color: ${c('warning')};
    `,
  };
  return variants[variant];
};

export const ModalIcon = styled.div<StyledModalIconProps>`
  align-items: center;
  border-radius: ${sh('full')};
  display: flex;
  height: ${s('4xl')};
  justify-content: center;
  margin: 0 auto ${s('sm')};
  width: ${s('4xl')};
  ${({ $variant }) => getIconVariantStyles($variant)}
`;

export const ModalMessage = styled.p`
  color: ${c('textSecondary')};
  font-family: ${tf('body')};
  font-size: ${ts('sm')};
  line-height: 1.6;
  margin: 0 0 ${s('md')};
  text-align: center;
`;

export const ModalConfirmChildren = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: ${s('md')};
  width: 100%;
`;

export const ModalActions = styled.div`
  display: flex;
  gap: ${s('sm')};
  justify-content: center;
`;
