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
