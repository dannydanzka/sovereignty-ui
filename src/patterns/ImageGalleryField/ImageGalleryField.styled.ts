/**
 * ImageGalleryField Styled Components
 */

import styled from 'styled-components';

import { c, s, sh, tf, ts, tw } from '../../tokens/css-variables';
import { Image } from '../../components/Image';

export const GalleryField = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${s('sm')};
`;

export const GalleryLabel = styled.span`
  color: ${c('primary700')};
  font-family: ${tf('body')};
  font-size: ${ts('sm')};
  font-weight: ${tw('semibold')};
`;

export const ThumbnailGrid = styled.div`
  display: grid;
  gap: ${s('sm')};
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
`;

export const GalleryItem = styled.div`
  border: 1px solid ${c('neutral200')};
  border-radius: ${sh('md')};
  overflow: hidden;
  position: relative;
`;

/** The box is the wrapper's job; the fallback belongs to `Image`. */
export const Thumbnail = styled(Image)`
  aspect-ratio: 4 / 3;
  width: 100%;
`;

/** Overlay slot for the destructive action — positioning only; the control is the shared `Button`. */
export const RemoveSlot = styled.span`
  inset: ${s('xs')} ${s('xs')} auto auto;
  position: absolute;
`;

/**
 * The primary marker and the promote action occupy the SAME slot, because exactly one of them shows
 * per image: the primary says what it is, the rest offer to become it.
 */
export const PrimarySlot = styled.span`
  bottom: ${s('xs')};
  left: ${s('xs')};
  position: absolute;
`;

export const PrimaryTag = styled.span`
  background: ${c('primary500')};
  border-radius: ${sh('sm')};
  color: ${c('onPrimary')};
  font-family: ${tf('body')};
  font-size: ${ts('xs')};
  font-weight: ${tw('semibold')};
  padding: ${s('micro')} ${s('xs')};
`;

export const GalleryHint = styled.span`
  color: ${c('textTertiary')};
  font-family: ${tf('body')};
  font-size: ${ts('xs')};
`;

export const GalleryError = styled.span`
  color: ${c('errorDark')};
  font-family: ${tf('body')};
  font-size: ${ts('xs')};
`;
