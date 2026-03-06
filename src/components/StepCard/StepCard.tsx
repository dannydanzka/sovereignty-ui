/**
 * StepCard Component
 *
 * Step-by-step instruction card with numbered circle, title, and description.
 */

import type { StepCardProps } from './StepCard.interfaces';

import { StepCardContainer, StepDescription, StepNumber, StepTitle } from './StepCard.styled';

export const StepCard = ({ className, description, number, title }: StepCardProps) => (
  <StepCardContainer className={className}>
    <StepNumber>{number}</StepNumber>
    <StepTitle>{title}</StepTitle>
    <StepDescription>{description}</StepDescription>
  </StepCardContainer>
);
