/**
 * ToggleActiveButton Component
 *
 * Icon button for toggling entity status in admin tables.
 * Active = red (Power icon) | Inactive = green (Power icon) | Loading = yellow (spinning Loader2).
 */

import { Loader2, Power } from 'lucide-react';

import type { ToggleActiveButtonProps } from './ToggleActiveButton.interfaces';

import { SpinnerIcon, StyledToggleButton } from './ToggleActiveButton.styled';

export const ToggleActiveButton = ({
  isActive,
  isLoading = false,
  onClick,
  shape = 'square',
  size = 'sm',
  title,
}: ToggleActiveButtonProps) => {
  const buttonTitle = title ?? (isActive ? 'Desactivar' : 'Activar');
  const iconSize = size === 'sm' ? 14 : 16;

  return (
    <StyledToggleButton
      $isActive={isActive}
      $isLoading={isLoading}
      $shape={shape}
      $size={size}
      title={buttonTitle}
      type='button'
      onClick={isLoading ? undefined : onClick}
    >
      {isLoading ? (
        <SpinnerIcon>
          <Loader2 size={iconSize} />
        </SpinnerIcon>
      ) : (
        <Power size={iconSize} />
      )}
    </StyledToggleButton>
  );
};
