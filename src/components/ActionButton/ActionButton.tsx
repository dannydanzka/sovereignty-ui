/**
 * ActionButton Component
 *
 * Icon button for table row actions (view/edit/delete/neutral).
 * Icon is injected via prop; loading state swaps it for a spinner.
 */

import { Loader2 } from 'lucide-react';

import type { ActionButtonProps } from './ActionButton.interfaces';

import { SpinnerIcon, StyledActionButton } from './ActionButton.styled';

export const ActionButton = ({
  className,
  disabled = false,
  icon,
  isLoading = false,
  onClick,
  size = 'sm',
  title,
  variant = 'neutral',
}: ActionButtonProps) => {
  const iconSize = size === 'sm' ? 14 : 16;

  return (
    <StyledActionButton
      $isLoading={isLoading}
      $size={size}
      $variant={variant}
      aria-label={title}
      className={className}
      disabled={disabled}
      title={title}
      type='button'
      onClick={isLoading ? undefined : onClick}
    >
      {isLoading ? (
        <SpinnerIcon>
          <Loader2 size={iconSize} />
        </SpinnerIcon>
      ) : (
        icon
      )}
    </StyledActionButton>
  );
};
