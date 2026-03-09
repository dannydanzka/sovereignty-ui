/**
 * ErrorState Styled Components
 */

import styled from 'styled-components';

import { color, spacing, typography } from '../../tokens';

export const Container = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
  gap: ${spacing.sm};
  justify-content: center;
  padding: ${spacing['2xl']};
  text-align: center;
`;

export const IconWrapper = styled.div`
  align-items: center;
  background: ${color.errorBackground};
  border-radius: 50%;
  color: ${color.errorDark};
  display: flex;
  height: ${spacing['4xl']};
  justify-content: center;
  width: ${spacing['4xl']};

  svg {
    height: ${spacing.lg};
    width: ${spacing.lg};
  }
`;

export const Title = styled.h3`
  color: ${color.textPrimary};
  font-family: ${typography.family.display};
  font-size: ${typography.size.lg};
  font-weight: ${typography.weight.semibold};
  margin: 0;
`;

export const Message = styled.p`
  color: ${color.textSecondary};
  font-family: ${typography.family.body};
  font-size: ${typography.size.sm};
  line-height: ${typography.leading.relaxed};
  margin: 0;
  max-width: 400px;
`;

export const Action = styled.div`
  margin-top: ${spacing.xs};
`;
