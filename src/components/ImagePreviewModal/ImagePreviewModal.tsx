/**
 * ImagePreviewModal Component
 *
 * Fullscreen image preview with title, optional badge slot, and description.
 * Closes on Escape, overlay click, or the close button; locks body scroll
 * while open.
 */

import { useCallback, useEffect } from 'react';
import { X } from 'lucide-react';

import type { ImagePreviewModalProps } from './ImagePreviewModal.interfaces';

import {
  BadgeSlot,
  CaptionOverlay,
  CloseButton,
  ImageDescription,
  ImageOverlay,
  ImageTitle,
  ModalContent,
  ModalOverlay,
  PreviewImage,
  TitleWrapper,
} from './ImagePreviewModal.styled';

export const ImagePreviewModal = ({
  badge,
  closeLabel = 'Close',
  description,
  imageUrl,
  isOpen,
  onClose,
  title,
}: ImagePreviewModalProps) => {
  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    },
    [onClose]
  );

  const handleOverlayClick = useCallback(
    (event: React.MouseEvent) => {
      if (event.target === event.currentTarget) {
        onClose();
      }
    },
    [onClose]
  );

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, handleKeyDown]);

  if (!isOpen) return null;

  return (
    <ModalOverlay $isOpen={isOpen} onClick={handleOverlayClick}>
      <ModalContent>
        <PreviewImage alt={title} src={imageUrl} />

        <ImageOverlay>
          <TitleWrapper>
            <ImageTitle>{title}</ImageTitle>
            {badge && <BadgeSlot>{badge}</BadgeSlot>}
          </TitleWrapper>
          <CloseButton aria-label={closeLabel} type='button' onClick={onClose}>
            <X size={20} />
          </CloseButton>
        </ImageOverlay>

        {description && (
          <CaptionOverlay>
            <ImageDescription>{description}</ImageDescription>
          </CaptionOverlay>
        )}
      </ModalContent>
    </ModalOverlay>
  );
};
