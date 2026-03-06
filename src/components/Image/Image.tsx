/**
 * Image Component
 *
 * Image display with automatic fallback when src is missing or fails to load.
 */

import { ImageIcon } from 'lucide-react';
import { useCallback, useState } from 'react';

import type { ImageProps } from './Image.interfaces';

import {
  FallbackContainer,
  FallbackIcon,
  FallbackText,
  ImageContainer,
  StyledImage,
} from './Image.styled';

export const Image = ({
  alt,
  className,
  fallbackIcon,
  fallbackText = 'No image',
  height,
  loading = 'lazy',
  objectFit = 'cover',
  src,
  width,
}: ImageProps) => {
  const [hasError, setHasError] = useState(false);

  const handleError = useCallback(() => {
    setHasError(true);
  }, []);

  const showFallback = !src || hasError;

  const containerStyle = {
    height: typeof height === 'number' ? `${height}px` : height,
    width: typeof width === 'number' ? `${width}px` : width,
  };

  if (showFallback) {
    return (
      <ImageContainer className={className} style={containerStyle}>
        <FallbackContainer>
          <FallbackIcon>{fallbackIcon ?? <ImageIcon />}</FallbackIcon>
          <FallbackText>{fallbackText}</FallbackText>
        </FallbackContainer>
      </ImageContainer>
    );
  }

  return (
    <ImageContainer className={className} style={containerStyle}>
      <StyledImage
        $objectFit={objectFit}
        alt={alt}
        loading={loading}
        src={src}
        onError={handleError}
      />
    </ImageContainer>
  );
};
