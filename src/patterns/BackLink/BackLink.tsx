/**
 * BackLink — the "‹ back to the list" anchor above a detail screen.
 *
 * Trivial to write and therefore written once per detail screen, which is exactly why it drifts:
 * seven copies of it differed in weight, colour and whether they aligned to the start.
 *
 * It renders an `<a>`, so a router-driven product wraps it (`<Link legacyBehavior passHref>`) or
 * passes its own link component through `as`. Recolour via `--sui-back-link-color`.
 */

import { forwardRef } from 'react';

import type { BackLinkProps } from './BackLink.interfaces';

import { BackLinkAnchor } from './BackLink.styled';

export const BackLink = forwardRef<HTMLAnchorElement, BackLinkProps>(
  ({ children, className, href, onClick, ...rest }, ref) => (
    <BackLinkAnchor className={className} href={href} ref={ref} onClick={onClick} {...rest}>
      {children}
    </BackLinkAnchor>
  )
);

BackLink.displayName = 'BackLink';
