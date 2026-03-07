/**
 * useClickOutside
 *
 * Detect clicks outside a referenced element.
 */

import type { RefObject } from 'react';
import { useEffect } from 'react';

export const useClickOutside = (ref: RefObject<HTMLElement | null>, handler: () => void): void => {
  useEffect(() => {
    const listener = (event: MouseEvent | TouchEvent) => {
      const element = ref.current;
      if (!element || element.contains(event.target as Node)) return;
      handler();
    };

    document.addEventListener('mousedown', listener);
    document.addEventListener('touchstart', listener);

    return () => {
      document.removeEventListener('mousedown', listener);
      document.removeEventListener('touchstart', listener);
    };
  }, [ref, handler]);
};
