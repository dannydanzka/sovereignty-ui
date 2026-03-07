/**
 * Tooltip Component
 *
 * Hover tooltip that displays content text.
 */

import type { TooltipProps } from './Tooltip.interfaces';

import { TooltipContainer, TooltipContent } from './Tooltip.styled';

export const Tooltip = ({ children, className, content, position = 'top' }: TooltipProps) => (
  <TooltipContainer className={className}>
    {children}
    <TooltipContent $position={position}>{content}</TooltipContent>
  </TooltipContainer>
);
