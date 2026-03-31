/**
 * Container Styled Components
 *
 * Responsive container with max-width and horizontal padding.
 */

import styled from 'styled-components';

import type { ContainerSize } from './Container.interfaces';
import { s } from '../../tokens/css-variables';

const getMaxWidth = (size: ContainerSize) => {
  switch (size) {
    case 'small':
      return '640px';
    case 'medium':
      return '1024px';
    case 'large':
      return '1280px';
    case 'full':
      return '100%';
  }
};

export const StyledContainer = styled.div<{ $size: ContainerSize }>`
  margin: 0 auto;
  max-width: ${({ $size }) => getMaxWidth($size)};
  padding-left: ${s('sm')};
  padding-right: ${s('sm')};
  width: 100%;

  @media (width >= 768px) {
    padding-left: ${s('md')};
    padding-right: ${s('md')};
  }

  @media (width >= 1024px) {
    padding-left: ${s('lg')};
    padding-right: ${s('lg')};
  }
`;
