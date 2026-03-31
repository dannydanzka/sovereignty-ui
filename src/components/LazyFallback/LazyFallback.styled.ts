/**
 * LazyFallback Styled Components
 *
 * Full-screen centered container for Suspense fallback.
 */

import styled from 'styled-components';

import { c } from '../../tokens/css-variables';
import { layout } from '../../tokens';

export const FallbackContainer = styled.div`
  align-items: center;
  background: ${c('background')};
  display: flex;
  inset: 0;
  justify-content: center;
  position: fixed;
  z-index: ${layout.zIndex.modal};
`;
