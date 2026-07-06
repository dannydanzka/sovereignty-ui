/**
 * Modal Component — React Native resolution
 *
 * Web uses a portal + fixed overlay + document keydown/scroll-lock; native maps
 * to the RN <Modal> host (backdrop, Android back button, fade). Same public
 * props (Modal.interfaces.ts) and the same default/confirm content structure.
 */

import { Modal as RNModal } from 'react-native';
import { useCallback } from 'react';

import { Button } from '../Button';
import { CONFIRM_VARIANTS, MODAL_VARIANTS } from './Modal.constants';
import type { ModalProps, ModalSize } from './Modal.interfaces';
import { X } from '../../internal/icons';

import {
  ModalActions,
  ModalConfirmChildren,
  ModalContainer,
  ModalContent,
  ModalFooterBar,
  ModalHeader,
  ModalIcon,
  ModalMessage,
  ModalOverlay,
  ModalTitle,
} from './Modal.styled';

const normalizeSize = (size: ModalSize): 'full' | 'lg' | 'md' | 'sm' | 'xl' => {
  const sizeMap: Record<ModalSize, 'full' | 'lg' | 'md' | 'sm' | 'xl'> = {
    full: 'full',
    large: 'lg',
    lg: 'lg',
    md: 'md',
    medium: 'md',
    sm: 'sm',
    small: 'sm',
    xl: 'xl',
  };
  return sizeMap[size];
};

export const Modal = ({
  cancelText,
  children,
  closeLabel = 'Close',
  confirmText,
  confirmVariant = 'danger',
  disableClose = false,
  footer,
  icon,
  isOpen,
  loading = false,
  message,
  noPadding = false,
  onCancel,
  onClose,
  onConfirm,
  size = 'md',
  title,
  variant = 'default',
}: ModalProps) => {
  const handleClose = useCallback(() => {
    if (disableClose || loading) return;
    onClose();
  }, [disableClose, loading, onClose]);

  const handleCancel = useCallback(() => {
    if (loading) return;
    if (onCancel) onCancel();
    else handleClose();
  }, [loading, onCancel, handleClose]);

  const handleConfirm = useCallback(() => {
    if (loading || !onConfirm) return;
    onConfirm();
  }, [loading, onConfirm]);

  const normalizedSize = normalizeSize(size);

  const confirmContent = (
    <ModalContent>
      {icon ? <ModalIcon $variant={confirmVariant}>{icon}</ModalIcon> : null}
      {title ? <ModalTitle $centered>{title}</ModalTitle> : null}
      {message ? <ModalMessage>{message}</ModalMessage> : null}
      {children ? <ModalConfirmChildren>{children}</ModalConfirmChildren> : null}
      <ModalActions>
        <Button disabled={loading} variant='secondary' onClick={handleCancel}>
          {cancelText ?? 'Cancel'}
        </Button>
        <Button
          loading={loading}
          variant={confirmVariant === CONFIRM_VARIANTS.INFO ? 'primary' : confirmVariant}
          onClick={handleConfirm}
        >
          {confirmText ?? 'Confirm'}
        </Button>
      </ModalActions>
    </ModalContent>
  );

  const defaultContent = (
    <>
      {title ? (
        <ModalHeader>
          <ModalTitle>{title}</ModalTitle>
          <Button
            aria-label={closeLabel}
            disabled={disableClose || loading}
            icon={<X size={20} />}
            iconOnly
            size='sm'
            variant='ghost'
            onClick={handleClose}
          />
        </ModalHeader>
      ) : null}
      <ModalContent $noPadding={noPadding}>{children}</ModalContent>
      {footer ? <ModalFooterBar>{footer}</ModalFooterBar> : null}
    </>
  );

  return (
    <RNModal animationType='fade' transparent visible={isOpen} onRequestClose={handleClose}>
      <ModalOverlay>
        <ModalContainer $isClosing={false} $size={normalizedSize}>
          {variant === MODAL_VARIANTS.CONFIRM ? confirmContent : defaultContent}
        </ModalContainer>
      </ModalOverlay>
    </RNModal>
  );
};
