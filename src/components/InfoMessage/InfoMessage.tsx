/**
 * InfoMessage
 */

import type { InfoMessageProps } from './InfoMessage.interfaces';

import { StyledInfoMessage } from './InfoMessage.styled';

export const InfoMessage = ({ children, className, variant = 'info' }: InfoMessageProps) => (
  <StyledInfoMessage $variant={variant} className={className}>
    {children}
  </StyledInfoMessage>
);
