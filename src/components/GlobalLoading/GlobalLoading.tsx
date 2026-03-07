/**
 * GlobalLoading Component
 *
 * Full-screen loading overlay. Agnostic — no Redux, no logo.
 * Pass children for custom content (logo, brand spinner, etc.)
 * or use default Spinner.
 */

import type { GlobalLoadingProps } from './GlobalLoading.interfaces';
import { Spinner } from '../Spinner';

import { LoadingOverlay } from './GlobalLoading.styled';

export const GlobalLoading = ({ children, className, isVisible, text }: GlobalLoadingProps) => (
  <LoadingOverlay $isVisible={isVisible} className={className} data-testid='global-loading'>
    {children ?? <Spinner size='lg' text={text} />}
  </LoadingOverlay>
);
