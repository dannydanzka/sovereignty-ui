/** BackLink contract. */

import type { AnchorHTMLAttributes, ReactNode } from 'react';

export interface BackLinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  children: ReactNode;
  className?: string;
  href?: string;
}
