/**
 * LazyFallback Styled Components
 *
 * Full-screen centered container for Suspense fallback.
 */

import styled from 'styled-components';

import { color, layout } from '../../tokens';

export const FallbackContainer = styled.div`
  align-items: center;
  background: ${color.background};
  display: flex;
  inset: 0;
  justify-content: center;
  position: fixed;
  z-index: ${layout.zIndex.modal};
`;
