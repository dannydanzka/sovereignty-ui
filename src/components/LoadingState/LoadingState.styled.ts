/**
 * LoadingState Styled Components
 */

import styled, { keyframes } from 'styled-components';

import { color, spacing, typography } from '../../tokens';

const spin = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

export const Container = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
  gap: ${spacing.sm};
  justify-content: center;
  padding: ${spacing['2xl']};
  text-align: center;
`;

export const SpinnerElement = styled.div`
  animation: ${spin} 1s linear infinite;
  border: 3px solid ${color.neutral200};
  border-radius: 50%;
  border-top-color: ${color.primary500};
  height: ${spacing.xl};
  width: ${spacing.xl};
`;

export const Text = styled.span`
  color: ${color.textSecondary};
  font-family: ${typography.family.body};
  font-size: ${typography.size.sm};
`;
