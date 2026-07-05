/**
 * AppHeader Pattern
 *
 * Application header shell. All content arrives via slots (logo, nav,
 * actions, mobile menu content) — no routing, no auth, no brand assets.
 * The only owned behavior is the mobile menu open/close state.
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
  actionsSlot,
  className,
  closeMenuLabel = 'Close menu',
  logoSlot,
  mobileMenuContent,
  navSlot,
  openMenuLabel = 'Open menu',
  sticky = true,
}: AppHeaderProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleToggleMenu = useCallback(() => {
    setIsMenuOpen((prev) => !prev);
  }, []);

  return (
    <HeaderBar $sticky={sticky} className={className}>
      <HeaderContent>
        <LogoSlot>{logoSlot}</LogoSlot>
        {navSlot && <NavSlot>{navSlot}</NavSlot>}
        {actionsSlot && <ActionsSlot>{actionsSlot}</ActionsSlot>}
        {mobileMenuContent && (
          <MenuButton
            aria-expanded={isMenuOpen}
            aria-label={isMenuOpen ? closeMenuLabel : openMenuLabel}
            type='button'
            onClick={handleToggleMenu}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </MenuButton>
        )}
      </HeaderContent>
      {mobileMenuContent && <MobileMenu $isOpen={isMenuOpen}>{mobileMenuContent}</MobileMenu>}
    </HeaderBar>
  );
};
