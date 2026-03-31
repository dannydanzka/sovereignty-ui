/**
 * StepCard Styled Components
 *
 * Step-by-step instruction card with numbered circle.
 */

import styled from 'styled-components';

import { c, el, s, sh, tf, ts, tw } from '../../tokens/css-variables';

export const StepCardContainer = styled.div`
  background-color: ${c('surface')};
  border: 1px solid ${c('border')};
  border-radius: ${sh('lg')};
  padding: ${s('xl')};
  text-align: center;
  transition:
    box-shadow 0.3s ease,
    transform 0.3s ease;

  &:hover {
    box-shadow: ${el('md')};
    transform: translateY(-4px);
  }
`;

export const StepNumber = styled.div`
  align-items: center;
  background: linear-gradient(135deg, ${c('primary500')}, ${c('textAccent')});
  border-radius: 50%;
  color: ${c('white')};
  display: flex;
  font-size: ${ts('2xl')};
  font-weight: ${tw('bold')};
  height: ${s('2xl')};
  justify-content: center;
  margin: 0 auto ${s('md')};
  width: ${s('2xl')};
`;

export const StepTitle = styled.div`
  color: ${c('textPrimary')};
  font-family: ${tf('display')};
  font-size: ${ts('xl')};
  font-weight: ${tw('semibold')};
  margin-bottom: ${s('sm')};
`;

export const StepDescription = styled.p`
  color: ${c('textSecondary')};
  font-family: ${tf('body')};
  font-size: ${ts('base')};
  line-height: 1.6;
`;
