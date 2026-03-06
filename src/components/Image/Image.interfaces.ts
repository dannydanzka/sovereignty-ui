/**
 * Image Component Interfaces
 *
 * Global image component with implicit fallback handling.
 */

import type { ReactNode } from 'react';

export interface ImageProps {
  /** Image alt text (required for accessibility) */
  alt: string;
  /** Optional CSS class */
  className?: string;
  /** Custom fallback icon (defaults to ImageIcon) */
  fallbackIcon?: ReactNode;
  /** Custom fallback text */
  fallbackText?: string;
  /** Image height */
  height?: number | string;
  /** Lazy loading behavior */
  loading?: 'eager' | 'lazy';
  /** Object fit behavior */
  objectFit?: 'contain' | 'cover' | 'fill' | 'none' | 'scale-down';
  /** Image source URL */
  src?: null | string;
  /** Image width */
  width?: number | string;
}
