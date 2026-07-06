/**
 * ImagePreviewModal Component — React Native resolution
 *
 * Web uses a portal + fixed overlay + document keydown/scroll-lock; native maps
 * to the RN <Modal> host with an RN Image. Same public props
 * (ImagePreviewModal.interfaces.ts).
 */

import { Modal as RNModal } from 'react-native';

import { c } from '../../tokens/css-variables';
import type { ImagePreviewModalProps } from './ImagePreviewModal.interfaces';
import { X } from '../../internal/icons';

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
}: ImagePreviewModalProps) => (
  <RNModal animationType='fade' transparent visible={isOpen} onRequestClose={onClose}>
    <ModalOverlay>
      <ModalContent>
        <PreviewImage alt={title} src={imageUrl} />

        <ImageOverlay>
          <TitleWrapper>
            <ImageTitle>{title}</ImageTitle>
            {badge ? <BadgeSlot>{badge}</BadgeSlot> : null}
          </TitleWrapper>
          <CloseButton aria-label={closeLabel} onClick={onClose}>
            <X color={c('white')} size={20} />
          </CloseButton>
        </ImageOverlay>

        {description ? (
          <CaptionOverlay>
            <ImageDescription>{description}</ImageDescription>
          </CaptionOverlay>
        ) : null}
      </ModalContent>
    </ModalOverlay>
  </RNModal>
);
