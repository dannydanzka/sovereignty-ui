/**
 * ImagePreviewModal Component Interfaces
 */

import type { ReactNode } from 'react';

export type ImagePreviewMediaType = 'image' | 'video';

export interface ImagePreviewModalProps {
  badge?: ReactNode;
  closeLabel?: string;
  description?: string;
  downloadLabel?: string;
  imageUrl: string;
  isOpen: boolean;
  /** Web only: native renders images. A video plays with controls, starting on open. */
  mediaType?: ImagePreviewMediaType;
  nextLabel?: string;
  onClose: () => void;
  /** When set, a download button appears next to close. */
  onDownload?: () => void;
  /** When set, a next arrow appears and ArrowRight triggers it. */
  onNext?: () => void;
  /** When set, a previous arrow appears and ArrowLeft triggers it. */
  onPrevious?: () => void;
  previousLabel?: string;
  title: string;
}

export interface StyledOverlayProps {
  $isOpen: boolean;
}

export interface StyledNavButtonProps {
  $side: 'left' | 'right';
}
