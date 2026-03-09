/**
 * LoadingState
 */

import type { LoadingStateProps } from './LoadingState.interfaces';

import { Container, SpinnerElement, Text } from './LoadingState.styled';

export const LoadingState = ({ className, message }: LoadingStateProps) => (
  <Container className={className}>
    <SpinnerElement />
    {message && <Text>{message}</Text>}
  </Container>
);
