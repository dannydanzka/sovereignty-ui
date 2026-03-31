/**
 * PageLayout Styled Components
 */

import styled from 'styled-components';

import { c, s, tf, ts, tw } from '../../tokens/css-variables';

export const PageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  width: 100%;
`;

export const ScreenContainer = styled.section`
  flex: 1;
`;

export const PageTitle = styled.h1`
  color: ${c('textPrimary')};
  font-family: ${tf('display')};
  font-size: ${ts('4xl')};
  font-weight: ${tw('semibold')};
  margin: 0 0 ${s('sm')};
`;

export const HeaderRow = styled.div`
  align-items: center;
  display: flex;
  flex-wrap: wrap;
  gap: ${s('sm')};
  justify-content: space-between;
  margin-bottom: ${s('md')};
`;

export const SectionTitle = styled.h2`
  color: ${c('textPrimary')};
  font-family: ${tf('display')};
  font-size: ${ts('xl')};
  font-weight: ${tw('semibold')};
  margin: 0 0 ${s('sm')};
`;
