/**
 * LazyFallback Component
 *
 * Suspense fallback wrapper. Shows centered Spinner by default,
 * or custom children (e.g., a branded logo).
 */

import type { LazyFallbackProps } from './LazyFallback.interfaces';
import { Spinner } from '../Spinner';

import { FallbackContainer } from './LazyFallback.styled';

export const LazyFallback = ({ children, className }: LazyFallbackProps) => (
  <FallbackContainer className={className} data-testid='lazy-fallback'>
    {children ?? <Spinner size='lg' />}
  </FallbackContainer>
);
