/** Sidebar.Header — the identity block plus the collapse and mobile-close affordances. */

import type { SidebarHeaderProps } from './Sidebar.interfaces';

import {
  AvatarButton,
  CloseButton,
  HeaderBadge,
  HeaderWrapper,
  IdentityColumn,
  IdentityEmail,
  IdentityName,
  IdentitySection,
} from './Sidebar.styled';

export const SidebarHeader = ({
  badge,
  className,
  closeLabel,
  collapseLabel,
  email,
  expandLabel,
  initials,
  isCollapsed = false,
  name,
  onClose,
  onToggleCollapse,
}: SidebarHeaderProps) => (
  <HeaderWrapper $isCollapsed={isCollapsed} className={className}>
    <IdentitySection $isCollapsed={isCollapsed}>
      <AvatarButton
        aria-label={isCollapsed ? expandLabel : collapseLabel}
        type='button'
        onClick={onToggleCollapse}
      >
        {initials}
      </AvatarButton>
      <IdentityColumn $isCollapsed={isCollapsed}>
        {name ? <IdentityName>{name}</IdentityName> : null}
        {email ? <IdentityEmail>{email}</IdentityEmail> : null}
      </IdentityColumn>
      {badge ? <HeaderBadge $isCollapsed={isCollapsed}>{badge}</HeaderBadge> : null}
    </IdentitySection>

    <CloseButton aria-label={closeLabel} type='button' onClick={onClose}>
      {/* Inline so the pattern carries no icon-library dependency. */}
      <svg
        aria-hidden='true'
        fill='none'
        height='20'
        stroke='currentColor'
        strokeLinecap='round'
        strokeWidth='2'
        viewBox='0 0 24 24'
        width='20'
      >
        <path d='M18 6 6 18M6 6l12 12' />
      </svg>
    </CloseButton>
  </HeaderWrapper>
);
