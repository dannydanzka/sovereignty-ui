/**
 * Image Styled Components
 *
 * Styles for image display and fallback placeholder.
 */

import styled from 'styled-components';

import { brandColor, spacing, typography } from '../../tokens';

export const ImageContainer = styled.div`
  height: 100%;
  position: relative;
  width: 100%;
`;

export const StyledImage = styled.img<{ $objectFit?: string }>`
  display: block;
  height: 100%;
  object-fit: ${({ $objectFit }) => $objectFit ?? 'cover'};
  width: 100%;
`;

export const FallbackContainer = styled.div`
  align-items: center;
  background: ${brandColor.landingBgYellow};
  display: flex;
  flex-direction: column;
  gap: ${spacing.xs};
  height: 100%;
  justify-content: center;
  width: 100%;
`;

export const FallbackIcon = styled.span`
  color: ${brandColor.landingPinkVibrant};
  opacity: 0.6;

  svg {
    height: ${spacing.xl};
    width: ${spacing.xl};
  }
`;

export const FallbackText = styled.span`
  color: ${brandColor.landingTextGray};
  font-family: ${typography.family.body};
  font-size: ${typography.size.xs};
  opacity: 0.8;
`;
