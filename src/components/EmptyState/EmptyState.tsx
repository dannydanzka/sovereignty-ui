/**
 * EmptyState
 */

import type { EmptyStateProps } from './EmptyState.interfaces';

import { Action, Container, IconWrapper, Message, Title } from './EmptyState.styled';

export const EmptyState = ({ action, className, icon, message, title }: EmptyStateProps) => (
  <Container className={className}>
    {icon && <IconWrapper>{icon}</IconWrapper>}
    {title && <Title>{title}</Title>}
    {message && <Message>{message}</Message>}
    {action && <Action>{action}</Action>}
  </Container>
);
