/**
 * ErrorState
 */

import { AlertCircle } from 'lucide-react';

import type { ErrorStateProps } from './ErrorState.interfaces';

import { Action, Container, IconWrapper, Message, Title } from './ErrorState.styled';

export const ErrorState = ({ action, className, icon, message, title }: ErrorStateProps) => (
  <Container className={className}>
    <IconWrapper>{icon ?? <AlertCircle />}</IconWrapper>
    {title && <Title>{title}</Title>}
    {message && <Message>{message}</Message>}
    {action && <Action>{action}</Action>}
  </Container>
);
