/**
 * ScreenBoundary
 *
 * Declarative boundary that handles loading/error states for screen content.
 * Eliminates repetitive if/else boilerplate in every screen component.
 */

import { ErrorState } from '../ErrorState';
import { LoadingState } from '../LoadingState';
import type { ScreenBoundaryProps } from './ScreenBoundary.interfaces';

import { PageTitle, ScreenContainer } from '../PageLayout/PageLayout.styled';

export const ScreenBoundary = ({
  children,
  className,
  error,
  errorAction,
  errorTitle = 'Error',
  isLoading,
  loadingMessage,
  title,
}: ScreenBoundaryProps) => {
  if (isLoading) {
    return (
      <ScreenContainer className={className}>
        <PageTitle>{title}</PageTitle>
        <LoadingState message={loadingMessage} />
      </ScreenContainer>
    );
  }

  if (error) {
    return (
      <ScreenContainer className={className}>
        <PageTitle>{title}</PageTitle>
        <ErrorState action={errorAction} message={error} title={errorTitle} />
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer className={className}>
      <PageTitle>{title}</PageTitle>
      {children}
    </ScreenContainer>
  );
};
