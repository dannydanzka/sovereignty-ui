/**
 * ModalFooter
 */

import type { ModalFooterProps } from './ModalFooter.interfaces';

import { StyledModalFooter } from './ModalFooter.styled';

export const ModalFooter = ({ align = 'right', children, className }: ModalFooterProps) => (
  <StyledModalFooter $align={align} className={className}>
    {children}
  </StyledModalFooter>
);
