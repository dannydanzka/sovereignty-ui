/**
 * Chip
 *
 * A selectable pill — the control every product hand-rolls for "filter by category" rows.
 *
 * Not a `Badge`: a badge is a *readout* (status, count) and is not interactive; a chip is a
 * *control* the user presses to narrow a list. Reaching for `Badge` here is what produces a
 * clickable thing that looks like a label, so they stay separate components on purpose.
 *
 * Semantics: a toggle button with `aria-pressed`, not a radio — a chip row is just as often
 * multi-select as single-select, and `aria-pressed` reads correctly either way.
 */

import { useCallback } from 'react';

import type { ChipProps } from './Chip.interfaces';

import { ChipIcon, ChipLabel, StyledChip } from './Chip.styled';

export const Chip = ({
  className,
  disabled = false,
  icon,
  label,
  onSelect,
  selected = false,
  size = 'md',
  value,
}: ChipProps) => {
  const handleClick = useCallback(() => onSelect(value), [onSelect, value]);

  return (
    <StyledChip
      $selected={selected}
      $size={size}
      aria-pressed={selected}
      className={className}
      disabled={disabled}
      type='button'
      onClick={handleClick}
    >
      {icon ? <ChipIcon>{icon}</ChipIcon> : null}
      <ChipLabel $selected={selected} $size={size}>
        {label}
      </ChipLabel>
    </StyledChip>
  );
};
