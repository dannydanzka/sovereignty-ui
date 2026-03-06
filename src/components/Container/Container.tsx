/**
 * Container Component
 *
 * Responsive container with max-width and horizontal padding.
 */

import type { ContainerProps } from './Container.interfaces';

import { StyledContainer } from './Container.styled';

export const Container = ({ children, size = 'medium' }: ContainerProps) => (
  <StyledContainer $size={size}>{children}</StyledContainer>
);
