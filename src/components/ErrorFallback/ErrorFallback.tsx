/**
 * ErrorFallback Component
 *
 * Agnostic error display with configurable title, description, icon, and actions.
 * No i18n dependency — pass translated strings via props.
 */

import { AlertTriangle } from 'lucide-react';

import type { ErrorFallbackProps } from './ErrorFallback.interfaces';

import {
  ActionButton,
  ErrorActions,
  ErrorContainer,
  ErrorDescription,
  ErrorIconWrapper,
  ErrorTitle,
} from './ErrorFallback.styled';

export const ErrorFallback = ({
  actions = [],
  className,
  description = 'An unexpected error occurred. Please try again.',
  icon,
  onRetry,
  retryLabel = 'Try Again',
  title = 'Something went wrong',
}: ErrorFallbackProps) => (
  <ErrorContainer className={className} data-testid='error-fallback'>
    <ErrorIconWrapper>{icon ?? <AlertTriangle size={48} />}</ErrorIconWrapper>
    <ErrorTitle>{title}</ErrorTitle>
    <ErrorDescription>{description}</ErrorDescription>
    <ErrorActions>
      {onRetry && (
        <ActionButton $variant='primary' onClick={onRetry}>
          {retryLabel}
        </ActionButton>
      )}
      {actions.map((action) => (
        <ActionButton $variant='secondary' key={action.label} onClick={action.onClick}>
          {action.label}
        </ActionButton>
      ))}
    </ErrorActions>
  </ErrorContainer>
);
