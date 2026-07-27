/**
 * BackLink — the "‹ back to the list" anchor above a detail screen.
 *
 * Trivial to write and therefore written once per detail screen, which is exactly why it drifts:
 * seven copies of it differed in weight, colour and whether they aligned to the start.
 *
 * It renders an `<a>`. A router-driven product passes its own link component through `as`
 * (`as={Link}`) or wraps it (`<Link legacyBehavior passHref>`). Recolour via `--sui-back-link-color`.
 *
 * `as` reached the styled anchor through `...rest` from the start, but `BackLinkProps` did not declare
 * it, so every real consumer failed to type-check. Worth remembering as a shape of bug: the runtime was
 * right, the doc comment was right, and the contract silently disagreed with both.
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
