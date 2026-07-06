/**
 * ImagePreviewModal Styled Components — React Native resolution
 *
 * Rendered inside the RN <Modal> host (see the .native.tsx). Gradients/blur have
 * no RN equivalent → solid translucent overlays; the image maps src/alt to
 * source/accessibilityLabel via attrs (like Avatar).
 */

import { Image } from 'react-native';
import styled from 'styled-components/native';

import { c, s, sh, tf, ts, tw } from '../../tokens/css-variables';
import { Div, Pressable, Span } from '../../primitives';

/** Translucent scrims — RN has no gradients; these are the flat equivalents. */
const BACKDROP = 'rgba(0, 0, 0, 0.85)';
const SCRIM = 'rgba(0, 0, 0, 0.55)';
const CLOSE_BG = 'rgba(255, 255, 255, 0.2)';

export const ModalOverlay = styled(Div)`
  align-items: center;
  background-color: ${BACKDROP};
  flex: 1;
  justify-content: center;
`;

export const ModalContent = styled(Div)`
  max-width: 90%;
  position: relative;
  width: 90%;
`;

export const PreviewImage = styled(Image).attrs<{ alt?: string; src?: string }>((props) => ({
  accessibilityLabel: props.alt,
  resizeMode: 'contain',
  source: { uri: props.src ?? '' },
}))<{ alt?: string; src?: string }>`
  aspect-ratio: 0.8;
  border-radius: ${sh('lg')};
  width: 100%;
`;

export const ImageOverlay = styled(Div)`
  align-items: flex-start;
  background-color: ${SCRIM};
  border-top-left-radius: ${sh('lg')};
  border-top-right-radius: ${sh('lg')};
  flex-direction: row;
  gap: ${s('sm')};
  justify-content: space-between;
  left: 0;
  padding: ${s('md')} ${s('lg')};
  position: absolute;
  right: 0;
  top: 0;
`;

export const TitleWrapper = styled(Div)`
  gap: ${s('xs')};
`;

export const ImageTitle = styled(Span)`
  color: ${c('white')};
  font-family: ${tf('display')};
  font-size: ${ts('xl')};
  font-weight: ${tw('bold')};
`;

export const BadgeSlot = styled(Div)`
  align-self: flex-start;
`;

export const CloseButton = styled(Pressable)`
  align-items: center;
  background-color: ${CLOSE_BG};
  border-radius: 9999px;
  height: ${s('lg')};
  justify-content: center;
  width: ${s('lg')};
`;

export const CaptionOverlay = styled(Div)`
  background-color: ${SCRIM};
  border-bottom-left-radius: ${sh('lg')};
  border-bottom-right-radius: ${sh('lg')};
  bottom: 0;
  left: 0;
  padding: ${s('lg')} ${s('lg')} ${s('md')};
  position: absolute;
  right: 0;
`;

export const ImageDescription = styled(Span)`
  color: ${c('white')};
  font-size: ${ts('sm')};
`;
