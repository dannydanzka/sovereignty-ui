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

/**
 * The screen's H1.
 *
 * Colour and scale are vars because a branded product decides them ONCE — not per screen. Without
 * this seam every screen forks the heading to apply the tenant colour, which is how a product ends
 * up with three title sizes and four title colours and no one able to say which is correct.
 *
 * Heading level is `as`: `<PageTitle as="h2">` when the page already owns its H1. Use it — a screen
 * with two H1s (or an H1 that is really a section) is a real navigation defect for a screen reader,
 * and picking the tag by how big the text should look is how that happens.
 */
export const PageTitle = styled.h1`
  color: var(--sui-page-title-color, ${c('textPrimary')});
  font-family: ${tf('display')};
  font-size: var(--sui-page-title-size, ${ts('4xl')});
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

/** A section heading inside a screen. Same seam as `PageTitle`; same `as` for the heading level. */
export const SectionTitle = styled.h2`
  color: var(--sui-section-title-color, ${c('textPrimary')});
  font-family: ${tf('display')};
  font-size: var(--sui-section-title-size, ${ts('xl')});
  font-weight: ${tw('semibold')};
  margin: 0 0 ${s('sm')};
`;
