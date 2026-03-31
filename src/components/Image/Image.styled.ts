/**
 * Image Styled Components
 *
 * Styles for image display and fallback placeholder.
 */

import styled from 'styled-components';

import { c, s, tf, ts } from '../../tokens/css-variables';

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
  background: ${c('neutral50')};
  display: flex;
  flex-direction: column;
  gap: ${s('xs')};
  height: 100%;
  justify-content: center;
  width: 100%;
`;

export const FallbackIcon = styled.span`
  color: ${c('accent500')};
  opacity: 0.6;

  svg {
    height: ${s('xl')};
    width: ${s('xl')};
  }
`;

export const FallbackText = styled.span`
  color: ${c('textSecondary')};
  font-family: ${tf('body')};
  font-size: ${ts('xs')};
  opacity: 0.8;
`;
