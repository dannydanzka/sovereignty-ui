/**
 * useModal
 *
 * Open/close/toggle state management for modals and dialogs.
 */

import { useCallback, useState } from 'react';

import type { UseModalReturn } from './useModal.interfaces';

export const useModal = (initialOpen = false): UseModalReturn => {
  const [isOpen, setIsOpen] = useState(initialOpen);

  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);
  const toggle = useCallback(() => setIsOpen((prev) => !prev), []);

  return { close, isOpen, open, toggle };
};
