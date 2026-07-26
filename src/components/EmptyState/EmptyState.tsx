/**
 * EmptyState
 */

import type { EmptyStateProps } from './EmptyState.interfaces';

import { Action, Container, IconWrapper, Message, Title } from './EmptyState.styled';

export const EmptyState = ({
  action,
  className,
  icon,
  message,
  title,
  variant = 'block',
}: EmptyStateProps) => (
  <Container $variant={variant} className={className}>
    {icon && variant === 'block' && <IconWrapper>{icon}</IconWrapper>}
    {title && variant === 'block' && <Title>{title}</Title>}
    {message && <Message $variant={variant}>{message}</Message>}
    {action && <Action>{action}</Action>}
  </Container>
);
