/**
 * ImagePreviewModal Component Interfaces
 */

import type { ReactNode } from 'react';

export interface ImagePreviewModalProps {
  badge?: ReactNode;
  closeLabel?: string;
  description?: string;
  imageUrl: string;
  isOpen: boolean;
  onClose: () => void;
  title: string;
}

export interface StyledOverlayProps {
  $isOpen: boolean;
}
