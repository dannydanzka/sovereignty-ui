/**
 * AuthLayout Styled Components
 *
 * Centered auth section with optional side illustration slots (hidden on
 * small screens), title/subtitle header, and an elevated card.
 */

import styled from 'styled-components';

import { c, el, s, sh, tf, ts, tw } from '../../tokens/css-variables';
import { layout } from '../../tokens';

export const AuthPageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  width: 100%;
`;

export const AuthSection = styled.section`
  align-items: center;
  background-color: ${c('backgroundAlt')};
  display: flex;
  flex: 1;
  justify-content: center;
  padding: ${s('lg')} ${s('sm')};
  position: relative;

  @media (max-width: ${layout.breakpoint.md}) {
    align-items: flex-start;
    padding: ${s('md')} ${s('sm')};
  }
`;

export const AuthContent = styled.div`
  align-items: center;
  display: flex;
  gap: ${s('lg')};
  justify-content: center;
  max-width: ${layout.container.lg};
  position: relative;
  width: 100%;

  @media (max-width: ${layout.breakpoint.lg}) {
    flex-direction: column;
  }
`;

export const AuthSideSlot = styled.div`
  align-items: center;
  display: flex;
  flex: 1;
  justify-content: center;

  @media (max-width: ${layout.breakpoint.lg}) {
    display: none;
  }

  img {
    height: auto;
    max-height: 420px;
    width: auto;
  }
`;

export const AuthCardWrapper = styled.div`
  display: flex;
  flex: 2;
  flex-direction: column;
  gap: ${s('md')};
  max-width: 480px;
  width: 100%;

  @media (max-width: ${layout.breakpoint.md}) {
    max-width: 100%;
  }
`;

export const AuthHeader = styled.div`
  text-align: center;
`;

export const AuthTitle = styled.h1`
  color: ${c('textPrimary')};
  font-family: ${tf('display')};
  font-size: ${ts('6xl')};
  font-weight: ${tw('bold')};
  margin: 0;

  @media (max-width: ${layout.breakpoint.md}) {
    font-size: ${ts('4xl')};
  }
`;

export const AuthSubtitle = styled.p`
  color: ${c('textPrimary')};
  font-family: ${tf('body')};
  font-size: ${ts('2xl')};
  font-weight: ${tw('semibold')};
  margin: ${s('xs')} 0 0;

  @media (max-width: ${layout.breakpoint.md}) {
    font-size: ${ts('xl')};
  }
`;

export const StyledAuthCard = styled.div`
  background: ${c('surface')};
  border-radius: ${sh('lg')};
  box-shadow: ${el('md')};
  padding: ${s('lg')};

  @media (max-width: ${layout.breakpoint.md}) {
    padding: ${s('md')};
  }
`;
