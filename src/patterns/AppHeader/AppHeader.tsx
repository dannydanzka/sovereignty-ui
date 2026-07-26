/**
 * AppHeader Pattern
 *
 * Application header shell. All content arrives via slots (logo, nav, actions, mobile menu) — no
 * routing, no auth, no brand assets. The only owned state is the mobile panel.
 *
 * It also owns the three behaviours a marketing header always ends up needing, and that a product
 * otherwise hand-rolls: `floating` over a hero, `hidden` for hide-on-scroll-down (pair it with
 * `useHeaderScroll`), and `transparent` for sitting on dark imagery.
 *
 * `transparent` is the one that earns its keep. The bar flips its own `color`, so everything in the
 * slots inherits it — a consumer does not thread an `isOnDark` flag through its logo, links, cart
 * icon and hamburger. Doing that by hand is how five styled components end up each carrying the
 * same boolean.
 */

import { Menu, X } from 'lucide-react';
import { useCallback, useState } from 'react';

import type { AppHeaderProps } from './AppHeader.interfaces';

import {
  ActionsSlot,
  HeaderBar,
  HeaderContent,
  LogoSlot,
  MenuButton,
  MobileMenu,
  NavSlot,
} from './AppHeader.styled';

export const AppHeader = ({
  actionsCollapse = true,
  actionsSlot,
  className,
  closeMenuLabel = 'Close menu',
  collapseAt = 'md',
  floating = false,
  hidden = false,
  logoSlot,
  mobileMenuContent,
  navSlot,
  onMenuToggle,
  openMenuLabel = 'Open menu',
  sticky = true,
  transparent = false,
}: AppHeaderProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleToggleMenu = useCallback(() => {
    /* The next value is computed OUTSIDE the updater on purpose. A state updater has to be pure —
       React may re-run it during render — and notifying the consumer from inside it triggers
       "Cannot update a component while rendering a different component". */
    const next = !isMenuOpen;
    setIsMenuOpen(next);
    onMenuToggle?.(next);
  }, [isMenuOpen, onMenuToggle]);

  return (
    <HeaderBar
      $collapseAt={collapseAt}
      $floating={floating}
      $hidden={hidden}
      $sticky={sticky}
      $transparent={transparent}
      className={className}
      data-testid='app-header'
    >
      <HeaderContent>
        <LogoSlot>{logoSlot}</LogoSlot>
        {navSlot && <NavSlot $collapseAt={collapseAt}>{navSlot}</NavSlot>}
        {actionsSlot && (
          <ActionsSlot $collapse={actionsCollapse} $collapseAt={collapseAt}>
            {actionsSlot}
          </ActionsSlot>
        )}
        {mobileMenuContent && (
          <MenuButton
            $collapseAt={collapseAt}
            aria-expanded={isMenuOpen}
            aria-label={isMenuOpen ? closeMenuLabel : openMenuLabel}
            type='button'
            onClick={handleToggleMenu}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </MenuButton>
        )}
      </HeaderContent>
      {mobileMenuContent && (
        <MobileMenu $collapseAt={collapseAt} $isOpen={isMenuOpen} data-testid='app-header-menu'>
          {mobileMenuContent}
        </MobileMenu>
      )}
    </HeaderBar>
  );
};
