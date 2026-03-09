/**
 * Modal
 *
 * Unified modal with two variants:
 * - default: standard header + content + optional footer
 * - confirm: icon + message + action buttons
 */

import type { MouseEvent } from 'react';
import { useCallback, useEffect, useState } from 'react';
import { X } from 'lucide-react';

import { Button } from '../Button';
import { CONFIRM_VARIANTS, MODAL_VARIANTS } from './Modal.constants';
import type { ModalProps, ModalSize } from './Modal.interfaces';

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
  const [isClosing, setIsClosing] = useState(false);

  const handleClose = useCallback(() => {
    if (disableClose || loading) return;
    setIsClosing(true);
    setTimeout(() => {
      setIsClosing(false);
      onClose();
    }, 200);
  }, [disableClose, loading, onClose]);

  const handleCancel = useCallback(() => {
    if (loading) return;
    if (onCancel) {
      onCancel();
    } else {
      handleClose();
    }
  }, [loading, onCancel, handleClose]);

  const handleConfirm = useCallback(() => {
    if (loading || !onConfirm) return;
    onConfirm();
  }, [loading, onConfirm]);

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === 'Escape' && !disableClose && !loading) {
        handleClose();
      }
    },
    [handleClose, disableClose, loading]
  );

  const handleContentClick = useCallback((e: MouseEvent) => {
    e.stopPropagation();
  }, []);

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

  if (!isOpen && !isClosing) return null;

  const normalizedSize = normalizeSize(size);

  const renderConfirmContent = () => (
    <ModalContent>
      {icon && <ModalIcon $variant={confirmVariant}>{icon}</ModalIcon>}
      {title && <ModalTitle $centered>{title}</ModalTitle>}
      {message && <ModalMessage>{message}</ModalMessage>}
      {children && <ModalConfirmChildren>{children}</ModalConfirmChildren>}
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

  const renderDefaultContent = () => (
    <>
      {title && (
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
      )}
      <ModalContent $noPadding={noPadding}>{children}</ModalContent>
      {footer && <ModalFooterBar>{footer}</ModalFooterBar>}
    </>
  );

  return (
    <ModalOverlay $isClosing={isClosing}>
      <ModalContainer
        $isClosing={isClosing}
        $size={normalizedSize}
        aria-modal='true'
        role='dialog'
        onClick={handleContentClick}
      >
        {variant === MODAL_VARIANTS.CONFIRM ? renderConfirmContent() : renderDefaultContent()}
      </ModalContainer>
    </ModalOverlay>
  );
};
