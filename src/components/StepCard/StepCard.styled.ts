/**
 * StepCard Styled Components
 *
 * Step-by-step instruction card with numbered circle.
 */

import styled from 'styled-components';

import { color, elevation, shape, spacing, typography } from '../../tokens';

export const StepCardContainer = styled.div`
  background-color: ${color.surface};
  border: 1px solid ${color.border};
  border-radius: ${shape.lg};
  padding: ${spacing.xl};
  text-align: center;
  transition:
    box-shadow 0.3s ease,
    transform 0.3s ease;

  &:hover {
    box-shadow: ${elevation.md};
    transform: translateY(-4px);
  }
`;

export const StepNumber = styled.div`
  align-items: center;
  background: linear-gradient(135deg, ${color.primary500}, ${color.textAccent});
  border-radius: 50%;
  color: ${color.white};
  display: flex;
  font-size: ${typography.size['2xl']};
  font-weight: ${typography.weight.bold};
  height: ${spacing['2xl']};
  justify-content: center;
  margin: 0 auto ${spacing.md};
  width: ${spacing['2xl']};
`;

export const StepTitle = styled.div`
  color: ${color.textPrimary};
  font-family: ${typography.family.display};
  font-size: ${typography.size.xl};
  font-weight: ${typography.weight.semibold};
  margin-bottom: ${spacing.sm};
`;

export const StepDescription = styled.p`
  color: ${color.textSecondary};
  font-family: ${typography.family.body};
  font-size: ${typography.size.base};
  line-height: 1.6;
`;
