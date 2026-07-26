/**
 * useHeaderScroll
 *
 * Drives a marketing header: transparent → solid past a threshold (`isScrolled`), and out of the
 * way while the reader scrolls down (`isHidden`). Feeds `AppHeader`'s `transparent` and `hidden`.
 *
 * Reads are throttled to one per animation frame — a scroll listener that calls `setState` on every
 * event re-renders the header dozens of times a second.
 */

import { useEffect, useState } from 'react';

import type { HeaderScrollState, UseHeaderScrollOptions } from './useHeaderScroll.interfaces';

export const useHeaderScroll = ({
  hideThreshold = 240,
  scrollThreshold = 80,
}: UseHeaderScrollOptions = {}): HeaderScrollState => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isHidden, setIsHidden] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    let lastY = window.scrollY;
    let ticking = false;

    const handleScroll = () => {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(() => {
        const currentY = window.scrollY;
        setIsScrolled(currentY > scrollThreshold);
        /* Hide only while going DOWN and past the threshold; any upward move brings it back, so a
           reader who wants the nav never has to scroll to the top to get it. */
        if (currentY > lastY && currentY > hideThreshold) {
          setIsHidden(true);
        } else if (currentY < lastY) {
          setIsHidden(false);
        }
        lastY = currentY;
        ticking = false;
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [hideThreshold, scrollThreshold]);

  return { isHidden, isScrolled };
};
