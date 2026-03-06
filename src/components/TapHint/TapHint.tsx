/**
 * TapHint Component
 *
 * Subtle pulsing icon overlay that hints "click here" on interactive elements.
 * Fades away after autoHideMs or on first parent interaction.
 */

import { Maximize2 } from 'lucide-react';
import { useEffect, useState } from 'react';

import type { TapHintProps } from './TapHint.interfaces';

import { TapHintWrapper } from './TapHint.styled';

export const TapHint = ({
  autoHideMs = 5000,
  position = 'bottom-right',
  size = 32,
}: TapHintProps): React.JSX.Element | null => {
  const [isHidden, setIsHidden] = useState(false);
  const [isRemoved, setIsRemoved] = useState(false);

  useEffect(() => {
    if (autoHideMs <= 0) return;

    const timer = setTimeout(() => setIsHidden(true), autoHideMs);
    return () => clearTimeout(timer);
  }, [autoHideMs]);

  useEffect(() => {
    if (!isHidden) return;

    const timer = setTimeout(() => setIsRemoved(true), 300);
    return () => clearTimeout(timer);
  }, [isHidden]);

  if (isRemoved) return null;

  const iconSize = Math.round(size * 0.5);

  return (
    <TapHintWrapper $isHidden={isHidden} $position={position} $size={size}>
      <Maximize2 size={iconSize} />
    </TapHintWrapper>
  );
};
