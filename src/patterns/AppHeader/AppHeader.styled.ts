/**
 * AppHeader Styled Components
 *
 * App bar shell: logo + desktop nav + actions, hamburger + slide-down panel
 * on small screens.
 */

import styled from 'styled-components';

import { c, el, mo, s } from '../../tokens/css-variables';
import { layout } from '../../tokens';
import type { StyledHeaderProps, StyledMobileMenuProps } from './AppHeader.interfaces';

export const HeaderBar = styled.header<StyledHeaderProps>`
  background: ${c('surface')};
  border-bottom: 1px solid ${c('border')};
  position: ${({ $sticky }) => ($sticky ? 'sticky' : 'relative')};
  top: 0;
  width: 100%;
  z-index: ${layout.zIndex.sticky};
`;

export const HeaderContent = styled.div`
  align-items: center;
  display: flex;
  gap: ${s('md')};
  justify-content: space-between;
  margin: 0 auto;
  max-width: ${layout.container.lg};
  padding: ${s('sm')} ${s('md')};
`;

export const LogoSlot = styled.div`
  align-items: center;
  display: flex;
  flex-shrink: 0;
`;

export const NavSlot = styled.nav`
  align-items: center;
  display: flex;
  flex: 1;
  gap: ${s('sm')};
  justify-content: center;

  @media (max-width: ${layout.breakpoint.md}) {
    display: none;
  }
`;

export const ActionsSlot = styled.div`
  align-items: center;
  display: flex;
  flex-shrink: 0;
  gap: ${s('xs')};

  @media (max-width: ${layout.breakpoint.md}) {
    display: none;
  }
`;

export const MenuButton = styled.button`
  align-items: center;
  background: transparent;
  border: none;
  color: ${c('textPrimary')};
  cursor: pointer;
  display: inline-flex;
  justify-content: center;
  padding: ${s('micro')};

  @media (min-width: ${layout.breakpoint.md}) {
    display: none;
  }
`;

export const MobileMenu = styled.div<StyledMobileMenuProps>`
  background: ${c('surface')};
  box-shadow: ${el('md')};
  display: ${({ $isOpen }) => ($isOpen ? 'block' : 'none')};
  padding: ${s('sm')} ${s('md')};
  transition: ${mo('fast')};

  @media (min-width: ${layout.breakpoint.md}) {
    display: none;
  }
`;
