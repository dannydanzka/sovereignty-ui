/**
 * AppFooter Pattern
 *
 * Site footer shell: brand slot, link columns, copyright, and a social slot.
 * All content is injected — no brand assets, no auth state, no i18n.
 */

import type { AppFooterProps } from './AppFooter.interfaces';

import {
  BrandSection,
  ColumnTitle,
  Copyright,
  FooterBottom,
  FooterColumnWrapper,
  FooterContainer,
  FooterContent,
  FooterLink,
  SocialSlot,
} from './AppFooter.styled';

export const AppFooter = ({
  bottomSlot,
  brandSlot,
  className,
  columns = [],
  copyright,
  socialSlot,
}: AppFooterProps) => (
  <FooterContainer className={className}>
    {(brandSlot ?? columns.length > 0) && (
      <FooterContent>
        {brandSlot && <BrandSection>{brandSlot}</BrandSection>}
        {columns.map((column, index) => (
          <FooterColumnWrapper key={column.title ?? `column-${index}`}>
            {column.title && <ColumnTitle>{column.title}</ColumnTitle>}
            {column.content}
          </FooterColumnWrapper>
        ))}
      </FooterContent>
    )}
    {(copyright ?? socialSlot ?? bottomSlot) && (
      <FooterBottom>
        {copyright && <Copyright>{copyright}</Copyright>}
        {bottomSlot}
        {socialSlot && <SocialSlot>{socialSlot}</SocialSlot>}
      </FooterBottom>
    )}
  </FooterContainer>
);

/**
 * Also exported by NAME, and that is not redundant.
 *
 * `AppFooter.Link` is a static property, and static properties do NOT survive the React Server
 * Component boundary: a server component importing `AppFooter` from this (client) module gets a
 * client *reference*, on which `.Link` is `undefined` — it fails at render with "Element type is
 * invalid ... got: undefined". A named export crosses the boundary intact, so a server-rendered
 * footer has to use `FooterLink`.
 */
export { FooterLink };

AppFooter.Link = FooterLink;
