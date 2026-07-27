/** BackLink contract. */

import type { AnchorHTMLAttributes, ElementType, ReactNode } from 'react';

export interface BackLinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  /**
   * Render as another component — a router link (`as={Link}`), typically.
   *
   * This is not decoration: without it a Next.js/React Router product cannot use the pattern at all
   * without wrapping every instance, and wrapping is what this pattern exists to stop. The doc comment
   * promised `as` before the prop existed; the first real adoption caught it.
   */
  as?: ElementType;
  children: ReactNode;
  className?: string;
  href?: string;
}
