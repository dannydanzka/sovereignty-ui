/**
 * ImagePreviewModal Styled Components
 *
 * Fullscreen dark overlay with contained image, gradient title/caption
 * overlays, and a translucent close button.
 */

import styled from 'styled-components';

import { c, mo, s, sh, tf, tl, ts, tw } from '../../tokens/css-variables';
import { layout } from '../../tokens';
import type { StyledOverlayProps } from './ImagePreviewModal.interfaces';

export const ModalOverlay = styled.div<StyledOverlayProps>`
  align-items: center;
  backdrop-filter: blur(4px);
  background: rgb(${c('blackRgb')} / 0.85);
  display: flex;
  inset: 0;
  justify-content: center;
  opacity: ${({ $isOpen }) => ($isOpen ? 1 : 0)};
  position: fixed;
  transition: opacity ${mo('normal')};
  visibility: ${({ $isOpen }) => ($isOpen ? 'visible' : 'hidden')};
  z-index: ${layout.zIndex.modal};
`;

export const ModalContent = styled.div`
  max-height: 90vh;
  max-width: 90vw;
  position: relative;
`;

export const PreviewImage = styled.img`
  border-radius: ${sh('lg')};
  display: block;
  max-height: 80vh;
  max-width: 85vw;
  object-fit: contain;
`;

export const ImageOverlay = styled.div`
  align-items: flex-start;
  background: linear-gradient(to bottom, rgb(${c('blackRgb')} / 0.7) 0%, transparent 100%);
  border-radius: ${sh('lg')} ${sh('lg')} 0 0;
  display: flex;
  gap: ${s('sm')};
  justify-content: space-between;
  left: 0;
  padding: ${s('md')} ${s('lg')};
  position: absolute;
  right: 0;
  top: 0;
`;

export const TitleWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${s('xs')};
`;

export const ImageTitle = styled.h2`
  color: ${c('white')};
  font-family: ${tf('display')};
  font-size: ${ts('xl')};
  font-weight: ${tw('bold')};
  margin: 0;
  text-shadow: 0 2px 4px rgb(${c('blackRgb')} / 0.5);
`;

export const BadgeSlot = styled.span`
  width: fit-content;
`;

export const CloseButton = styled.button`
  align-items: center;
  background: rgb(${c('whiteRgb')} / 0.2);
  border: none;
  border-radius: ${sh('full')};
  color: ${c('white')};
  cursor: pointer;
  display: flex;
  flex-shrink: 0;
  height: ${s('lg')};
  justify-content: center;
  transition: background ${mo('fast')};
  width: ${s('lg')};

  &:hover {
    background: rgb(${c('whiteRgb')} / 0.3);
  }
`;

export const CaptionOverlay = styled.div`
  background: linear-gradient(to top, rgb(${c('blackRgb')} / 0.7) 0%, transparent 100%);
  border-radius: 0 0 ${sh('lg')} ${sh('lg')};
  bottom: 0;
  left: 0;
  padding: ${s('lg')} ${s('lg')} ${s('md')};
  position: absolute;
  right: 0;
`;

export const ImageDescription = styled.p`
  color: ${c('white')};
  font-size: ${ts('sm')};
  line-height: ${tl('normal')};
  margin: 0;
  opacity: 0.9;
  text-shadow: 0 1px 2px rgb(${c('blackRgb')} / 0.5);
`;
