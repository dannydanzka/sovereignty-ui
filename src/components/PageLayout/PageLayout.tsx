/**
 * PageLayout
 *
 * Standard page layout wrapper with optional title.
 * Also exports HeaderRow, SectionTitle, PageTitle primitives for flexible composition.
 */

import type { PageLayoutProps } from './PageLayout.interfaces';

import { PageTitle, PageWrapper, ScreenContainer } from './PageLayout.styled';

export const PageLayout = ({ children, className, title }: PageLayoutProps) => (
  <PageWrapper className={className}>
    <ScreenContainer>
      {title && <PageTitle>{title}</PageTitle>}
      {children}
    </ScreenContainer>
  </PageWrapper>
);

export {
  HeaderRow,
  PageTitle,
  PageWrapper,
  ScreenContainer,
  SectionTitle,
} from './PageLayout.styled';
