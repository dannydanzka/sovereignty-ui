/**
 * AppFooter Styled Components
 *
 * Column grid over a bottom bar with copyright and social links.
 */

import styled from 'styled-components';

import { c, s, tf, ts, tw } from '../../tokens/css-variables';
import { layout } from '../../tokens';

export const FooterContainer = styled.footer`
  background: ${c('backgroundDark')};
  color: ${c('textInverse')};
  width: 100%;
`;

export const FooterContent = styled.div`
  display: grid;
  gap: ${s('lg')};
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  margin: 0 auto;
  max-width: ${layout.container.lg};
  padding: ${s('lg')} ${s('md')};
`;

export const BrandSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${s('xs')};
`;

export const FooterColumnWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${s('xs')};
`;

export const ColumnTitle = styled.h3`
  color: ${c('textInverse')};
  font-family: ${tf('display')};
  font-size: ${ts('sm')};
  font-weight: ${tw('bold')};
  letter-spacing: 0.05em;
  margin: 0 0 ${s('micro')};
  text-transform: uppercase;
`;

export const FooterBottom = styled.div`
  align-items: center;
  border-top: 1px solid rgb(${c('whiteRgb')} / 0.15);
  display: flex;
  flex-wrap: wrap;
  gap: ${s('sm')};
  justify-content: space-between;
  margin: 0 auto;
  max-width: ${layout.container.lg};
  padding: ${s('sm')} ${s('md')};

  @media (max-width: ${layout.breakpoint.md}) {
    flex-direction: column;
    text-align: center;
  }
`;

export const Copyright = styled.p`
  color: ${c('textInverse')};
  font-family: ${tf('body')};
  font-size: ${ts('xs')};
  margin: 0;
  opacity: 0.8;
`;

export const SocialSlot = styled.div`
  align-items: center;
  display: flex;
  gap: ${s('xs')};
`;
