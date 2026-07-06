/**
 * Modal Styled Components — React Native resolution
 *
 * The RN <Modal> host (see Modal.native.tsx) provides the portal + backdrop
 * layer; these are the surfaces inside it. No fixed positioning / keyframes /
 * media queries on native; text lives in Span-based pieces.
 */

import styled from 'styled-components/native';

import { c, el, s, sh, tf, ts, tw } from '../../tokens/css-variables';
import type {
  ConfirmVariant,
  StyledModalContainerProps,
  StyledModalIconProps,
} from './Modal.interfaces';
import { Div, Span } from '../../primitives';

const MAX_WIDTH: Record<'full' | 'lg' | 'md' | 'sm' | 'xl', number> = {
  full: 9999,
  lg: 600,
  md: 480,
  sm: 360,
  xl: 700,
};

export const ModalOverlay = styled(Div)`
  align-items: center;
  background-color: ${c('modalOverlay')};
  flex: 1;
  justify-content: center;
  padding: ${s('sm')};
`;

export const ModalContainer = styled(Div)<StyledModalContainerProps>`
  background-color: ${c('white')};
  border-radius: ${sh('lg')};
  box-shadow: ${el('xl')};
  max-width: ${({ $size }) => `${MAX_WIDTH[$size]}px`};
  overflow: hidden;
  width: ${({ $size }) => ($size === 'full' ? '96%' : '90%')};
`;

export const ModalHeader = styled(Div)`
  align-items: center;
  flex-direction: row;
  justify-content: space-between;
  padding: ${s('sm')};
`;

export const ModalTitle = styled(Span)<{ $centered?: boolean }>`
  color: ${c('textPrimary')};
  font-family: ${tf('display')};
  font-size: ${ts('xl')};
  font-weight: ${tw('bold')};
  ${({ $centered }) => ($centered ? 'text-align: center;' : '')}
`;

export const ModalContent = styled(Div)<{ $noPadding?: boolean }>`
  padding: ${({ $noPadding }) => ($noPadding ? '0px' : s('sm'))};
`;

export const ModalFooterBar = styled(Div)`
  flex-direction: row;
  gap: ${s('sm')};
  justify-content: flex-end;
  padding: ${s('xs')} ${s('sm')};
`;

const iconBackground = (variant: ConfirmVariant) => {
  switch (variant) {
    case 'danger':
      return c('errorBackground');
    case 'info':
      return c('primary50');
    case 'success':
      return c('successBackground');
    case 'warning':
      return c('warningBackground');
  }
};

export const ModalIcon = styled(Div)<StyledModalIconProps>`
  align-items: center;
  align-self: center;
  background-color: ${({ $variant }) => iconBackground($variant)};
  border-radius: ${sh('full')};
  height: ${s('4xl')};
  justify-content: center;
  margin-bottom: ${s('sm')};
  width: ${s('4xl')};
`;

export const ModalMessage = styled(Span)`
  color: ${c('textSecondary')};
  font-family: ${tf('body')};
  font-size: ${ts('sm')};
  margin-bottom: ${s('md')};
  text-align: center;
`;

export const ModalConfirmChildren = styled(Div)`
  align-items: center;
  margin-bottom: ${s('md')};
  width: 100%;
`;

export const ModalActions = styled(Div)`
  flex-direction: row;
  gap: ${s('sm')};
  justify-content: center;
`;
