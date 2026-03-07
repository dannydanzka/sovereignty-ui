/**
 * GlobalLoading Styled Components
 *
 * Full-screen overlay with centered content.
 */

import styled from 'styled-components';

import { color, layout } from '../../tokens';

export const LoadingOverlay = styled.div<{ $isVisible: boolean }>`
  align-items: center;
  background: ${color.background};
  display: ${({ $isVisible }) => ($isVisible ? 'flex' : 'none')};
  flex-direction: column;
  inset: 0;
  justify-content: center;
  position: fixed;
  z-index: ${layout.zIndex.modal};
`;
