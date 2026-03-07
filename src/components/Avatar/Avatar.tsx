/**
 * Avatar Component
 *
 * User avatar with image or initials fallback.
 */

import { useCallback, useState } from 'react';

import type { AvatarProps } from './Avatar.interfaces';

import { AvatarContainer, AvatarImage } from './Avatar.styled';

const getInitials = (name?: string): string => {
  if (!name) return '?';
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) {
    return `${parts[0]?.[0] ?? ''}${parts[1]?.[0] ?? ''}`.toUpperCase();
  }
  return (name[0] ?? '?').toUpperCase();
};

export const Avatar = ({ alt, className, name, size = 'md', src }: AvatarProps) => {
  const [hasError, setHasError] = useState(false);

  const handleError = useCallback(() => {
    setHasError(true);
  }, []);

  const showImage = src && !hasError;

  return (
    <AvatarContainer $size={size} className={className} data-testid='avatar'>
      {showImage ? (
        <AvatarImage alt={alt ?? name ?? 'Avatar'} src={src} onError={handleError} />
      ) : (
        getInitials(name)
      )}
    </AvatarContainer>
  );
};
