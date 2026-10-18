/**
 * ImagePreviewModal Component
 *
 * Fullscreen image or video preview with title, optional badge slot, and description.
 * Closes on Escape, overlay click, or the close button; locks body scroll while open.
 * Optional previous/next arrows (and ArrowLeft/ArrowRight) and a download button.
 */

import { ChevronLeft, ChevronRight, Download, X } from 'lucide-react';
import { useCallback, useEffect } from 'react';

import type { ImagePreviewModalProps } from './ImagePreviewModal.interfaces';
import { VIDEO_MEDIA_TYPE } from './ImagePreviewModal.constants';

import {
  BadgeSlot,
  CaptionOverlay,
  CloseButton,
  HeaderActions,
  ImageDescription,
  ImageOverlay,
  ImageTitle,
  ModalContent,
  ModalOverlay,
  NavButton,
  PreviewImage,
  PreviewVideo,
  TitleWrapper,
} from './ImagePreviewModal.styled';

export const ImagePreviewModal = ({
  badge,
  closeLabel = 'Close',
  description,
  downloadLabel = 'Download',
  imageUrl,
  isOpen,
  mediaType = 'image',
  nextLabel = 'Next',
  onClose,
  onDownload,
  onNext,
  onPrevious,
  previousLabel = 'Previous',
  title,
}: ImagePreviewModalProps) => {
  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
      if (event.key === 'ArrowRight') onNext?.();
      if (event.key === 'ArrowLeft') onPrevious?.();
    },
    [onClose, onNext, onPrevious]
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
        {mediaType === VIDEO_MEDIA_TYPE ? (
          <PreviewVideo aria-label={title} autoPlay controls playsInline src={imageUrl} />
        ) : (
          <PreviewImage alt={title} src={imageUrl} />
        )}

        {onPrevious && (
          <NavButton $side='left' aria-label={previousLabel} type='button' onClick={onPrevious}>
            <ChevronLeft size={28} />
          </NavButton>
        )}
        {onNext && (
          <NavButton $side='right' aria-label={nextLabel} type='button' onClick={onNext}>
            <ChevronRight size={28} />
          </NavButton>
        )}

        <ImageOverlay>
          <TitleWrapper>
            <ImageTitle>{title}</ImageTitle>
            {badge && <BadgeSlot>{badge}</BadgeSlot>}
          </TitleWrapper>
          <HeaderActions>
            {onDownload && (
              <CloseButton aria-label={downloadLabel} type='button' onClick={onDownload}>
                <Download size={18} />
              </CloseButton>
            )}
            <CloseButton aria-label={closeLabel} type='button' onClick={onClose}>
              <X size={20} />
            </CloseButton>
          </HeaderActions>
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
