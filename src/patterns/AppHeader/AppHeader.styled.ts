/**
 * AppHeader Styled Components
 *
 * App bar shell: logo + desktop nav + actions, hamburger + slide-down panel on small screens.
 *
 * Two seams keep a consumer from re-implementing this:
 *
 * - **Colour context.** The bar sets its own `color` and every slot inherits it. That is what makes
 *   `transparent` (over a hero) work without threading an `isOnDark` flag through every link, icon
 *   and badge the consumer drops into the slots.
 * - **CSS custom properties** for the surface itself (`--sui-app-header-*`), so a brand re-skin is a
 *   set of declarations rather than a fork.
 */

import styled, { css } from 'styled-components';

import type {
  AppHeaderBreakpoint,
  StyledActionsSlotProps,
  StyledHeaderProps,
  StyledHeaderSlotProps,
  StyledMobileMenuProps,
} from './AppHeader.interfaces';
import { c, el, mo, s } from '../../tokens/css-variables';
import { layout } from '../../tokens';

const BG = `var(--sui-app-header-bg, ${c('surface')})`;
const FG = `var(--sui-app-header-fg, ${c('textPrimary')})`;
const FG_ON_DARK = `var(--sui-app-header-fg-on-dark, ${c('white')})`;
const BORDER = `var(--sui-app-header-border, ${c('border')})`;
const SHADOW = 'var(--sui-app-header-shadow, none)';
const MAX_WIDTH = `var(--sui-app-header-max-width, ${layout.container.lg})`;
const BLUR = 'var(--sui-app-header-blur, none)';

const below = (bp: AppHeaderBreakpoint) => `@media (max-width: ${layout.breakpoint[bp]})`;
const atLeast = (bp: AppHeaderBreakpoint) => `@media (min-width: ${layout.breakpoint[bp]})`;

export const HeaderBar = styled.header<StyledHeaderProps>`
  inset: 0 0 auto 0;
  position: ${({ $floating, $sticky }) => {
    if ($floating) return 'fixed';
    return $sticky ? 'sticky' : 'relative';
  }};
  top: 0;
  transform: ${({ $hidden }) => ($hidden ? 'translateY(-100%)' : 'translateY(0)')};
  transition:
    background ${mo('normal')},
    box-shadow ${mo('normal')},
    color ${mo('normal')},
    transform ${mo('normal')};
  width: 100%;
  z-index: ${layout.zIndex.sticky};

  ${({ $transparent }) =>
    $transparent
      ? css`
          background: transparent;
          border-bottom: 1px solid transparent;
          box-shadow: none;
          color: ${FG_ON_DARK};
        `
      : css`
          backdrop-filter: ${BLUR};
          background: ${BG};
          border-bottom: 1px solid ${BORDER};
          box-shadow: ${SHADOW};
          color: ${FG};
        `}
`;

export const HeaderContent = styled.div`
  align-items: center;
  display: flex;
  gap: ${s('md')};
  justify-content: space-between;
  margin: 0 auto;
  max-width: ${MAX_WIDTH};
  padding: ${s('sm')} ${s('md')};
`;

export const LogoSlot = styled.div`
  align-items: center;
  display: flex;
  flex-shrink: 0;
`;

export const NavSlot = styled.nav<StyledHeaderSlotProps>`
  align-items: center;
  display: flex;
  flex: 1;
  gap: ${s('sm')};
  justify-content: center;

  ${({ $collapseAt }) => below($collapseAt)} {
    display: none;
  }
`;

export const ActionsSlot = styled.div<StyledActionsSlotProps>`
  align-items: center;
  display: flex;
  flex-shrink: 0;
  gap: ${s('xs')};

  ${({ $collapse, $collapseAt }) =>
    $collapse &&
    css`
      ${below($collapseAt)} {
        display: none;
      }
    `}
`;

export const MenuButton = styled.button<StyledHeaderSlotProps>`
  align-items: center;
  background: transparent;
  border: none;
  /* inherit: the button flips with the bar's colour context */
  color: inherit;
  cursor: pointer;
  display: inline-flex;
  justify-content: center;
  padding: ${s('micro')};

  ${({ $collapseAt }) => atLeast($collapseAt)} {
    display: none;
  }
`;

export const MobileMenu = styled.div<StyledMobileMenuProps>`
  background: ${BG};
  box-shadow: ${el('md')};
  /* The panel is a solid surface even under a transparent bar: text over hero imagery is
     unreadable, so this is the one place the colour context must NOT be inherited. */
  color: ${FG};
  display: ${({ $isOpen }) => ($isOpen ? 'block' : 'none')};
  padding: ${s('sm')} ${s('md')};
  transition: ${mo('fast')};

  ${({ $collapseAt }) => atLeast($collapseAt)} {
    display: none;
  }
`;
