/**
 * AuthLayout Pattern
 *
 * Layout shell for authentication screens (login, signup, reset). Centered
 * card with optional title/subtitle and side illustration slots. All content
 * is injected — no brand assets, no routing, no auth state.
 */

import type { AuthCardProps, AuthLayoutProps } from './AuthLayout.interfaces';

import {
  AuthCardWrapper,
  AuthContent,
  AuthHeader,
  AuthPageWrapper,
  AuthSection,
  AuthSideSlot,
  AuthSubtitle,
  AuthTitle,
  StyledAuthCard,
} from './AuthLayout.styled';

export const AuthCard = ({ children, className }: AuthCardProps) => (
  <StyledAuthCard className={className}>{children}</StyledAuthCard>
);

export const AuthLayout = ({
  children,
  className,
  leftSlot,
  rightSlot,
  subtitle,
  title,
}: AuthLayoutProps) => (
  <AuthPageWrapper className={className}>
    <AuthSection>
      <AuthContent>
        {leftSlot && <AuthSideSlot>{leftSlot}</AuthSideSlot>}
        <AuthCardWrapper>
          {(title ?? subtitle) && (
            <AuthHeader>
              {title && <AuthTitle>{title}</AuthTitle>}
              {subtitle && <AuthSubtitle>{subtitle}</AuthSubtitle>}
            </AuthHeader>
          )}
          {children}
        </AuthCardWrapper>
        {rightSlot && <AuthSideSlot>{rightSlot}</AuthSideSlot>}
      </AuthContent>
    </AuthSection>
  </AuthPageWrapper>
);
