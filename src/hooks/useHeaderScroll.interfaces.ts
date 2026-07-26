/** useHeaderScroll contracts. */

export interface UseHeaderScrollOptions {
  /** Scroll depth (px) past which a downward scroll hides the header. */
  hideThreshold?: number;
  /** Scroll depth (px) past which the header counts as "scrolled" (i.e. no longer over the hero). */
  scrollThreshold?: number;
}

export interface HeaderScrollState {
  isHidden: boolean;
  isScrolled: boolean;
}
