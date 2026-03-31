/**
 * GlobalLoading Styled Components
 *
 * Full-screen overlay with centered content.
 */

import styled from 'styled-components';

import { c } from '../../tokens/css-variables';
import { layout } from '../../tokens';

export const LoadingOverlay = styled.div<{ $isVisible: boolean }>`
  align-items: center;
  background: ${c('background')};
  display: ${({ $isVisible }) => ($isVisible ? 'flex' : 'none')};
  flex-direction: column;
  inset: 0;
  justify-content: center;
  position: fixed;
  z-index: ${layout.zIndex.modal};
`;
